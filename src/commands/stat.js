const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");
const conf = require("../configs/config.json");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const voiceUserParent = require("../schemas/voiceUserParent");

module.exports = {
	conf: {
		aliases: [],
		name: "stat",
		help: "stat [kullanıcı]?",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("stat")
		.setDescription("Belirtilen kullanıcının ya da sizin istatistiklerinizi gösterir.")
		.addUserOption((option) => option.setName("kullanıcı").setDescription("İstatistikleri gösterilecek olan kullanıcı.").setRequired(false)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, reply, embed, interaction, args }) => {
		const guild = interaction ? interaction.guild : message.guild;
		const member = interaction ? interaction.options.getMember("kullanıcı") || interaction.member : message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		const category = async (parentsArray) => {
			const data = await voiceUserParent.find({ guildID: guild.id, userID: member.user.id });
			const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
			let voiceStat = 0;
			for (var i = 0; i <= voiceUserParentData.length; i++) {
				voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
			}
			return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
		};

		const Active1 = await messageUserChannel.find({ guildID: guild.id, userID: member.user.id }).sort({ channelData: -1 });
		const Active2 = await voiceUserChannel.find({ guildID: guild.id, userID: member.user.id }).sort({ channelData: -1 });
		const voiceLength = Active2 ? Active2.length : 0;
		let voiceTop;
		let messageTop;
		Active1.length > 0
			? (messageTop = Active1.splice(0, 5)
					.map((x) => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``)
					.join("\n"))
			: (messageTop = "Veri bulunmuyor.");
		Active2.length > 0
			? (voiceTop = Active2.splice(0, 5)
					.map((x) => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``)
					.join("\n"))
			: (voiceTop = "Veri bulunmuyor.");

		const messageData = await messageUser.findOne({ guildID: guild.id, userID: member.user.id });
		const voiceData = await voiceUser.findOne({ guildID: guild.id, userID: member.user.id });

		const messageDaily = messageData ? messageData.dailyStat : 0;
		const messageWeekly = messageData ? messageData.weeklyStat : 0;

		const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika] s [saniye]");
		const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika] s [saniye]");

		const filteredParents = guild.channels.cache.filter(
			(x) =>
				x.type === "category" &&
				!conf.parents.publicParents.includes(x.id) &&
				!conf.parents.registerParents.includes(x.id) &&
				!conf.parents.solvingParents.includes(x.id) &&
				!conf.parents.privateParents.includes(x.id) &&
				!conf.parents.aloneParents.includes(x.id) &&
				!conf.parents.funParents.includes(x.id)
		);

		embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
		embed.setDescription(` ${member.user.toString()} (${member.roles.highest.toString()}) kullanıcısının genel aktiflik istatistikleri`);
		embed.addField(
			"**➥ Ses Kategori Bilgileri:**",
			`
			• Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`
			• Public Odalar: \`${await category(conf.parents.publicParents)}\`
			• Kayıt Odaları: \`${await category(conf.parents.registerParents)}\`
			• Sorun Çözme & Terapi: \`${await category(conf.parents.solvingParents)}\`
			• Private Odalar: \`${await category(conf.parents.privateParents)}\`
			• Game Odalar: \`${await category(conf.parents.aloneParents)}\`
			• Oyun & Eğlence Odaları: \`${await category(conf.parents.funParents)}\`
			• Diğer: \`${await category(filteredParents.map((x) => x.id))}\``
		);
		embed.addField(`**➥ Sesli Kanal Bilgileri: (\`Toplam ${voiceLength} kanal\`)**`, voiceTop);
		embed.addField(`**➥ Mesaj Bilgileri: (\`Toplam ${messageData ? messageData.topStat : 0} mesaj\`)**`, messageTop);
		embed.addField(
			"Ses Verileri:",
			`
     \`•\` Haftalık Ses: \`${voiceWeekly}\`
     \`•\` Günlük Ses: \`${voiceDaily}\`
    `,
			true
		);
		embed.addField(
			"Mesaj Verileri:",
			`
    \`•\` Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
    \`•\` Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
    `,
			true
		);
		reply({ embeds: [embed] });
	}
};
