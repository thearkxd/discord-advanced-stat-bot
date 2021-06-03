const { GuildMember, TextChannel, MessageEmbed } = require("discord.js");
const { emojis } = require("../configs/config.json");
const task = require("../schemas/task");

/**
 * @param { Client } client
 */
module.exports = function (client) {
	/**
	 * @param {String|Array} role
	 * @param {Boolean} every
	 * @returns {Boolean}
	 */
	GuildMember.prototype.hasRole = function (role, every = true) {
		return (
			(Array.isArray(role) &&
				((every && role.every((x) => this.roles.cache.has(x))) ||
					(!every && role.some((x) => this.roles.cache.has(x))))) ||
			(!Array.isArray(role) && this.roles.cache.has(role))
		);
	};

	/**
	 * @param {String} guildID
	 * @param {String} type
	 * @param {Number} count
	 * @param {Number} prizeCount
	 * @param {Boolean} active
	 * @param {Number} duration
	 * @param {Array<String>|null} channels
	 * @returns {Promise<Document<any, any>>}
	 */
	GuildMember.prototype.giveTask = async function (guildID, type, count, prizeCount, active = true, duration, channels = null) {
		const id = await task.find({ guildID });
		return await new task({ guildID, userID: this.user.id, id: id ? id.length + 1 : 1, type, count, prizeCount, active, finishDate: Date.now() + duration, channels }).save();
	};

	/**
	 * @param {Message} message
	 * @param {String} text
	 * @returns {Promise<void>}
	 */
	TextChannel.prototype.error = async function (message, text) {
		const theark = await client.users.fetch("350976460313329665");
		const embed = new MessageEmbed()
			.setColor("RED")
			.setAuthor(
				message.member.displayName,
				message.author.avatarURL({ dynamic: true, size: 2048 })
			)
			.setFooter("Developed by Theark", theark.avatarURL({ dynamic: true }));
		return this.send(embed.setDescription(text)).then((x) => {
			if (x.deletable) x.delete({ timeout: 10000 });
		});
	};

	/**
	 * @param {MessageEmbed} embed
	 * @returns {void}
	 */
	TextChannel.prototype.sendEmbed = function (embed) {
		if (!embed || !embed.description) return;
		const text = embed.description;
		for (let i = 0; i < Math.floor(text.length / 2048) + 1; i++) {
			this.send(embed.setDescription(text.slice(i * 2048, (i + 1) * 2048)));
		}
	};

	/**
	 * @param {Number} value
	 * @param {Number} maxValue
	 * @param {Number} size
	 * @returns {String}
	 */
	client.progressBar = (value, maxValue, size) => {
		const progress = Math.round(
			size * (value / maxValue > 1 ? 1 : value / maxValue)
		);
		const emptyProgress = size - progress > 0 ? size - progress : 0;

		const progressText = emojis.fill.repeat(progress);
		const emptyProgressText = emojis.empty.repeat(emptyProgress);

		return emptyProgress > 0
			? progress === 0
				? emojis.emptyStart + progressText + emptyProgressText + emojis.emptyEnd
				: emojis.fillStart + progressText + emptyProgressText + emojis.emptyEnd
			: emojis.fillStart + progressText + emptyProgressText + emojis.fillEnd;
	};

	/**
	 * @returns {any}
	 */
	Array.prototype.random = function () {
		return this[Math.floor((Math.random() * this.length))];
	};
};
