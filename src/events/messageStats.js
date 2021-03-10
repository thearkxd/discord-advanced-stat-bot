const settings = require("../configs/settings.json");
const conf = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const messageGuild = require("../schemas/messageGuild");
const guildChannel = require("../schemas/messageGuildChannel");
const userChannel = require("../schemas/messageUserChannel");
const { MessageEmbed } = require("discord.js");
const coin = require("../schemas/coin");
const client = global.client;
let num = 0;

module.exports = async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(settings.prefix)) return;
  
  if (conf.staffs.some(x => message.member.roles.cache.has(x))) {
    if (num % conf.messageCount === 0) {
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: conf.messageCoin } }, { upsert: true });
      num++;
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some(x => x.coin === coinData.coin)) {
        const oldRanks = client.ranks.filter(x => x.coin < coinData.coin);
        const newRank = client.ranks.find(x => x.coin === coinData.coin);
        if (newRank.hammer) message.member.roles.add(newRank.hammer);
        message.member.roles.add(newRank.role);
        oldRanks.forEach(x => message.member.roles.remove(x.role));
        const embed = new MessageEmbed().setColor("GREEN");
        message.guild.channels.cache.get(conf.rankLog).send(embed.setDescription(`${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`));
      }
    } else num++;
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
};

module.exports.conf = {
  name: "message",
};