const { CronJob } = require("cron");
const client = global.client;
const messageGuild = require("../schemas/messageGuild");
const voiceGuild = require("../schemas/voiceGuild");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
let Week = 0;

module.exports = async () => {
  const daily = new CronJob("00 00 * * *", async () => {
    client.guilds.cache.forEach(async (guild) => {
      const messageGuildData = await messageGuild.findOne({ guildID: guild.id });
      const voiceGuildData = await voiceGuild.findOne({ guildID: guild.id });
      const messageUserData = await messageUser.findOne({ guildID: guild.id });
      const voiceUserData = await voiceUser.findOne({ guildID: guild.id });

      if (messageGuildData) {
        messageGuildData.dailyStat = 0;
        messageGuildData.save();
      }
      if (voiceGuildData) {
        voiceGuildData.dailyStat = 0;
        voiceGuildData.save();
      }
      if (messageUserData) {
        messageUserData.dailyStat = 0;
        messageUserData.save();
      }
      if (voiceUserData) {
        voiceUserData.dailyStat = 0;
        voiceUserData.save();
      }
    });
  }, null, true, "Europe/Istanbul");
  daily.start();

  const weekly = new CronJob("00 00 * * 1", async () => {
    Week += 1;
    client.guilds.cache.forEach(async (guild) => {
      const messageGuildData = await messageGuild.findOne({ guildID: guild.id });
      const voiceGuildData = await voiceGuild.findOne({ guildID: guild.id });
      const messageUserData = await messageUser.findOne({ guildID: guild.id });
      const voiceUserData = await voiceUser.findOne({ guildID: guild.id });

      if (messageGuildData) {
        messageGuildData.weeklyStat = 0;
        messageGuildData.save();
      }
      if (voiceGuildData) {
        voiceGuildData.weeklyStat = 0;
        voiceGuildData.save();
      }
      if (messageUserData) {
        messageUserData.weeklyStat = 0;
        messageUserData.save();
      }
      if (voiceUserData) {
        voiceUserData.weeklyStat = 0;
        voiceUserData.save();
      }

      if (Week === 2) {
        Week = 0;
        if (messageGuildData) {
          messageGuildData.twoWeeklyStat = 0;
          messageGuildData.save();
        }
        if (voiceGuildData) {
          voiceGuildData.twoWeeklyStat = 0;
          voiceGuildData.save();
        }
        if (messageUserData) {
          messageUserData.twoWeeklyStat = 0;
          messageUserData.save();
        }
        if (voiceUserData) {
          voiceUserData.twoWeeklyStat = 0;
          voiceUserData.save();
        }
      }
    });
  }, null, true, "Europe/Istanbul");
  weekly.start();
};

module.exports.conf = {
  name: "ready",
};
