const { GuildMember, TextChannel, MessageEmbed } = require("discord.js");
const { emojis } = require("../configs/config.json");
const task = require("../schemas/task");
const coin = require("../schemas/coin");

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
	 * @param {String} type 
	 * @param {Array} channels 
	 */
	client.getTaskMessage = (type, count, channels = []) => {
		let taskMessage;
		switch (type) {
			case "invite":
			  taskMessage = `**Sunucumuza ${count} kişi davet et!**`;
			  break;
			case "mesaj":
			  taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count} mesaj at!**` : `**Metin kanallarında ${count} mesaj at!**`;
			  break;
			case "ses":
			  taskMessage = channels.length ? `**${channels.map((x) => `<#${x}>`).join(", ")} ${channels.length > 1 ? "kanallarında" : "kanalında"} ${count/1000/60} dakika vakit geçir!` : `**Seste ${count/1000/60} dakika vakit geçir!**`;
			  break;
			case "taglı":
			  taskMessage = `**${count} kişiye tag aldır!**`;
			  break;
			case "kayıt":
			  taskMessage = `**Sunucumuzda ${count} kişi kayıt et!**`;
			  break;
			default:
				taskMessage = "Bulunamadı!";
			  break;
		  }
		return taskMessage;
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
	GuildMember.prototype.giveTask = async function (guildID, type, count, prizeCount, active = true, duration, channels) {
		const id = await task.find({ guildID });
		const taskMessage = client.getTaskMessage(type, count, channels);
		return await new task({ guildID, userID: this.user.id, id: id ? id.length + 1 : 1, type, count, prizeCount, active, finishDate: Date.now() + duration, channels, message: taskMessage }).save();
	};

	/**
	 * @param {String} guildID
	 * @param {String} type
	 * @param {Number} data
	 * @param {TextChannel|VoiceChannel} channel
	 * @returns {Promise<void>}
	 */
	GuildMember.prototype.updateTask = async function (guildID, type, data, channel = null) {
		const taskData = await task.find({ guildID, userID: this.user.id, type, active: true });
		taskData.forEach(async (x) => {
			if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return;
			x.completedCount += data;
			if (x.completedCount >= x.count) {
				x.active = false;
				x.completed = true;
				await coin.findOneAndUpdate({ guildID, userID: this.user.id }, { $inc: { coin: x.prizeCount } });

				const embed = new MessageEmbed().setColor(this.displayHexColor).setAuthor(this.displayName, this.user.avatarURL({ dynamic: true, size: 2048 })).setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
				if (channel && channel.type === "text") channel.send(embed.setDescription(`
				${this.toString()} Tebrikler! ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} görevini başarıyla tamamladın.
				
				${x.message}
				${emojis.coin} \`${x.prizeCount} coin kazandın!\`
				`));
			}
			await x.save();
		});
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
