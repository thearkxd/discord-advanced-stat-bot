const { scheduleJob } = require("node-schedule");
const client = global.client;
const messageGuild = require("../schemas/messageGuild");
const voiceGuild = require("../schemas/voiceGuild");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const tasks = require("../schemas/task");
const coin = require("../schemas/coin");

module.exports = async () => {
	scheduleJob("* * * * *", async () => {
		client.guilds.cache.forEach(async (guild) => {
			const data = await tasks.find({ guildID: guild.id, active: true, finishDate: { $lte: Date.now() } });
			if (!data) return;
			data.forEach(async (x) => await coin.updateOne({ guildID: x.guildID, userID: x.userID }, { $inc: { coin: -x.prizeCount } }, { upsert: true }));
			await tasks.updateMany(
				{
					guildID: guild.id,
					active: true,
					finishDate: { $lte: Date.now() }
				},
				{ active: false }
			);
		});
	});

	scheduleJob("0 0 * * *", () => {
		client.guilds.cache.forEach(async (guild) => {
			await messageGuild.updateOne({ guildID: guild.id }, { $set: { dailyStat: 0 } });
			await voiceGuild.updateOne({ guildID: guild.id }, { $set: { dailyStat: 0 } });
			await messageUser.updateOne({ guildID: guild.id }, { $set: { dailyStat: 0 } });
			await voiceUser.updateOne({ guildID: guild.id }, { $set: { dailyStat: 0 } });
		});
	});

	scheduleJob("0 0 * * 0", () => {
		client.guilds.cache.forEach(async (guild) => {
			await messageGuild.updateOne({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
			await voiceGuild.updateOne({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
			await messageUser.updateOne({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
			await voiceUser.updateOne({ guildID: guild.id }, { $set: { weeklyStat: 0 } });
		});
	});
};

module.exports.conf = {
	name: "ready"
};
