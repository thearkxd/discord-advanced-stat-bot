const { CronJob } = require("cron");
const client = global.client;
const messageGuild = require("../schemas/messageGuild");
const voiceGuild = require("../schemas/voiceGuild");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const tasks = require("../schemas/task");

module.exports = () => {
  setInterval(async () => client.guilds.cache.forEach(async (guild) => await tasks.findOneAndUpdate({ guildID: guild.id, active: true, finishDate: { $lte: Date.now() } }, { active: false })), 1000 * 60 * 60);

  const daily = new CronJob("00 00 00 * * *", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { dailyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul");
  daily.start();

  const weekly = new CronJob("00 00 00 * * 0", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul");
  weekly.start();

  const twoWeekly = new CronJob("00 00 00 * * 0/2", () => {
    client.guilds.cache.forEach(async (guild) => {
      await messageGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await voiceGuild.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await messageUser.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
      await voiceUser.findOneAndUpdate({ guildID: guild.id }, { $set: { twoWeeklyStat: 0 } });
    });
  }, null, true, "Europe/Istanbul");
  twoWeekly.start();
};

module.exports.conf = {
  name: "ready"
};
