const conf = require("../configs/config.json");
const joinedAt = require("../schemas/voiceJoinedAt");
const voiceUser = require("../schemas/voiceUser");
const voiceGuild = require("../schemas/voiceGuild");
const guildChannel = require("../schemas/voiceGuildChannel");
const userChannel = require("../schemas/voiceUserChannel");
const userParent = require("../schemas/voiceUserParent");
const { MessageEmbed } = require("discord.js");
const coin = require("../schemas/coin");
const client = global.client;

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (oldState, newState) => {
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

  if (!oldState.channelID && newState.channelID) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if (oldState.channelID && !newState.channelID) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelID && newState.channelID) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }
};

/**
 * @param {VoiceState} user
 * @param {VoiceChannel} channel
 * @param {Number} data
 * @returns {Promise<void>}
 */
async function saveData(user, channel, data) {
  if (conf.coinSystem && conf.staffs.some(x => user.member.roles.cache.has(x)) && !conf.ignoreChannels.some((x) => channel.id === x)) {
    console.log(((data / 1000 / 60) / conf.voiceCount) * conf.voiceCoin)
    if (channel.parent && conf.publicParents.includes(channel.parentID)) await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: ((data / 1000 / 60) / conf.voiceCount) * conf.publicCoin } }, { upsert: true });
    else await coin.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: ((data / 1000 / 60) / conf.voiceCount) * conf.voiceCoin } }, { upsert: true });
    const coinData = await coin.findOne({ guildID: user.guild.id, userID: user.id });
    if (coinData && client.ranks.some(x => x.coin >= coinData.coin)) {
      let newRank = client.ranks.filter(x => coinData.coin >= x.coin);
      newRank = newRank[newRank.length-1];
      if (newRank && Array.isArray(newRank.role) && !newRank.role.some(x => user.member.roles.cache.has(x)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        user.member.roles.add(newRank.role);
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(x => user.member.roles.cache.has(x)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
        const embed = new MessageEmbed().setColor("GREEN");
        user.guild.channels.cache.get(conf.rankLog).send({ embeds: [embed.setDescription(`${user.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`)] });
      }
    }
  }

  user.member.updateTask(user.guild.id, "ses", data, channel);

  await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.parent) await userParent.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, parentID: channel.parentID }, { $inc: { parentData: data } }, { upsert: true });
}

module.exports.conf = {
  name: "voiceStateUpdate",
};
