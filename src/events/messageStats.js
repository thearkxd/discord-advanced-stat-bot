const conf = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const messageGuild = require("../schemas/messageGuild");
const guildChannel = require("../schemas/messageGuildChannel");
const userChannel = require("../schemas/messageUserChannel");
const { MessageEmbed } = require("discord.js");
const coin = require("../schemas/coin");
const client = global.client;
const nums = new Map();
const tasks = require("../schemas/task");
const settings = require("../configs/settings.json");

/**
 * @param message
 * @returns {Promise<void>}
 */
module.exports = async (message) => {
  const prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
  if (message.author.bot || !message.guild || prefix) return;

  if (conf.coinSystem && conf.staffs.some(x => message.member.roles.cache.has(x)) && !conf.ignoreChannels.some((x) => message.channel.id === x)) {
    const num = nums.get(message.author.id);
    if (num && (num % conf.messageCount) === 0) {
      nums.set(message.author.id, num + 1);
      await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: conf.messageCoin } }, { upsert: true });
      const coinData = await coin.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (coinData && client.ranks.some(x => coinData.coin === x.coin)) {
        let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
        newRank = newRank[newRank.length-1];
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        message.member.roles.add(newRank.role);
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => message.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && message.member.roles.cache.has(oldRank.role)) message.member.roles.remove(oldRank.role);
        const embed = new MessageEmbed().setColor("GREEN");
        message.guild.channels.cache.get(conf.rankLog).send(embed.setDescription(`${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`));
      }
    } else nums.set(message.author.id, num ? num + 1 : 1);

    const taskData = await tasks.find({ guildID: message.guild.id, userID: message.author.id, type: "mesaj", active: true });
    taskData.forEach(async (x) => {
      if (x.channels && x.channels.some((x) => x !== message.channel.id)) return;
      x.completedCount += 1;
      if (x.completedCount === x.count) {
        x.active = false;
        x.completed = true;
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: x.prizeCount } });
      }
      await x.save();
    });
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
};

module.exports.conf = {
  name: "message",
};