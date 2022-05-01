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
const tasks = require("../schemas/task");

/**
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (oldState, newState) => {
	if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;

	if (!oldState.channelId && newState.channelId) await joinedAt.updateOne({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
	const joinedAtData = (await joinedAt.findOne({ userID: oldState.id }))
		? await joinedAt.findOne({ userID: oldState.id })
		: await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true, new: true });
	const data = Date.now() - joinedAtData.date;

	if (oldState.channelId && !newState.channelId) {
		await saveData(oldState, oldState.channel, data);
		await joinedAt.deleteOne({ userID: oldState.id });
	} else if (oldState.channelId && newState.channelId) {
		await saveData(oldState, oldState.channel, data);
		await joinedAt.updateOne({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
	}
};

/**
 * @param {VoiceState} user
 * @param {VoiceChannel} channel
 * @param {Number} data
 * @returns {Promise<void>}
 */
async function saveData(user, channel, data) {
	if (conf.coinSystem && conf.staffs.some((x) => user.member.roles.cache.has(x)) && !conf.ignoreChannels.some((x) => channel.id === x)) {
		if (channel.parent && conf.parents.publicParents.includes(channel.parentId))
			await coin.updateOne(
				{ guildID: user.guild.id, userID: user.id },
				{
					$inc: {
						coin: (data / 1000 / 60 / conf.points.voiceCount) * conf.points.publicCoin
					}
				},
				{ upsert: true }
			);
		else
			await coin.updateOne(
				{ guildID: user.guild.id, userID: user.id },
				{
					$inc: {
						coin: (data / 1000 / 60 / conf.points.voiceCount) * conf.points.voiceCoin
					}
				},
				{ upsert: true }
			);
		const coinData = await coin.findOne({
			guildID: user.guild.id,
			userID: user.id
		});
		if (coinData && client.ranks.some((x) => x.coin >= coinData.coin)) {
			const newRank = client.ranks.filter((x) => coinData.coin >= x.coin).last();
			if (
				(newRank && Array.isArray(newRank.role) && !newRank.role.some((x) => user.member.roles.cache.has(x))) ||
				(newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role))
			) {
				user.member.roles.add(newRank.role);
				const oldRoles = client.ranks.filter((x) => coinData.coin < x.coin && user.member.hasRole(x.role));
				oldRoles.forEach((x) => x.role.forEach((r) => user.member.roles.remove(r)));
				const embed = new MessageEmbed().setColor("GREEN");
				user.guild.channels.cache.get(conf.rankLog).send({
					embeds: [
						embed.setDescription(
							`${user.member.toString()} üyesi **${coinData.coin}** coin hedefine ulaştı ve ${Array.isArray(newRank.role) ? newRank.role.listRoles() : `<@&${newRank.role}>`} rolü verildi!`
						)
					]
				});
			}
		}
	}

	user.member.updateTask(user.guild.id, "ses", data, channel);

	await voiceUser.updateOne(
		{ guildID: user.guild.id, userID: user.id },
		{
			$inc: {
				topStat: data,
				dailyStat: data,
				weeklyStat: data
			}
		},
		{ upsert: true }
	);
	await voiceGuild.updateOne(
		{ guildID: user.guild.id },
		{
			$inc: {
				topStat: data,
				dailyStat: data,
				weeklyStat: data
			}
		},
		{ upsert: true }
	);
	await guildChannel.updateOne({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
	await userChannel.updateOne({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
	if (channel.parent)
		await userParent.updateOne(
			{
				guildID: user.guild.id,
				userID: user.id,
				parentID: channel.parentID
			},
			{ $inc: { parentData: data } },
			{ upsert: true }
		);
}

module.exports.conf = {
	name: "voiceStateUpdate"
};
