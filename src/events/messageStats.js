const conf = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const messageGuild = require("../schemas/messageGuild");
const guildChannel = require("../schemas/messageGuildChannel");
const userChannel = require("../schemas/messageUserChannel");
const { MessageEmbed } = require("discord.js");
const coin = require("../schemas/coin");
const client = global.client;
const nums = new Map();
const settings = require("../configs/settings.json");

/**
 * @param message
 * @returns {Promise<void>}
 */
module.exports = async (message) => {
	const prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
	if (message.author.bot || !message.guild || prefix) return;

	if (conf.coinSystem && conf.staffs.some((x) => message.member.roles.cache.has(x)) && !conf.ignoreChannels.some((x) => message.channel.id === x)) {
		const num = nums.get(message.author.id);
		if (num && num % conf.points.messageCount === 0) {
			nums.set(message.author.id, num + 1);
			await coin.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { coin: conf.points.messageCoin } }, { upsert: true });
			const coinData = await coin.findOne({
				guildID: message.guild.id,
				userID: message.author.id
			});
			if (coinData && client.ranks.some((x) => coinData.coin === x.coin)) {
				const newRank = client.ranks.filter((x) => coinData.coin >= x.coin).last();
				message.member.roles.add(newRank.role);
				const oldRoles = client.ranks.filter((x) => coinData.coin < x.coin && message.member.hasRole(x.role));
				oldRoles.forEach((x) => x.role.forEach((r) => message.member.roles.remove(r)));
				const embed = new MessageEmbed().setColor("GREEN");
				message.guild.channels.cache.get(conf.rankLog).send({
					embeds: [
						embed.setDescription(
							`${message.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${
								Array.isArray(newRank.role) ? newRank.role.map((x) => `<@&${x}>`).join(", ") : `<@&${newRank.role}>`
							} rolü verildi!`
						)
					]
				});
			}
		} else nums.set(message.author.id, num ? num + 1 : 1);

		message.member.updateTask(message.guild.id, "mesaj", 1, message.channel);
	}

	await messageUser.updateOne({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1 } }, { upsert: true });
	await messageGuild.updateOne({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1 } }, { upsert: true });
	await guildChannel.updateOne({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
	await userChannel.updateOne(
		{
			guildID: message.guild.id,
			userID: message.author.id,
			channelID: message.channel.id
		},
		{ $inc: { channelData: 1 } },
		{ upsert: true }
	);
};

module.exports.conf = {
	name: "messageCreate"
};
