const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const coin = require("../schemas/coin");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["role"],
		name: "rol",
		help: "rol [rol]",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("rol")
		.setDescription("İstediğiniz rolün istatistiklerini gösterir.")
		.addRoleOption((option) => option.setName("rol").setDescription("İstatistiklerini görmek istediğiniz rol.").setRequired(true)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ message, args, embed, reply, interaction }) => {
		const member = interaction ? interaction.member : message.member;
		if (!member.permissions.has(8)) return;
		const role = interaction ? interaction.options.getRole("rol") : message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		if (!role) return reply({ embeds: [embed.setDescription("Bir rol belirtmelisin!")] });
		if (role.members.size === 0) return reply({ embeds: [embed.setDescription("Bu rol kimsede bulunmuyor!")] });

		const messageData = async (type) => {
			let data = await messageUser.find({ guildID: member.guild.id }).sort({ topStat: -1 });
			data = data.filter((x) => member.guild.members.cache.has(x.userID) && member.guild.members.cache.get(x.userID).roles.cache.has(role.id));
			return data.length > 0
				? data
						.splice(0, 5)
						.map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${Number(x[type]).toLocaleString()} mesaj\``)
						.join("\n")
				: "Veri bulunmuyor!";
		};

		const voiceData = async (type) => {
			let data = await voiceUser.find({ guildID: member.guild.id }).sort({ topStat: -1 });
			data = data.filter((x) => member.guild.members.cache.has(x.userID) && member.guild.members.cache.get(x.userID).roles.cache.has(role.id));
			return data.length > 0
				? data
						.splice(0, 5)
						.map((x, index) => `\`${index + 1}.\` <@${x.userID}> : \`${moment.duration(x[type]).format("H [saat], m [dakika] s [saniye]")}\``)
						.join("\n")
				: "Veri bulunmuyor!";
		};

		const coinData = async () => {
			let data = await coin.find({ guildID: member.guild.id }).sort({ coin: -1 });
			data = data.filter((x) => member.guild.members.cache.has(x.userID) && member.guild.members.cache.get(x.userID).roles.cache.has(role.id));
			return data.length > 0
				? data
						.splice(0, 5)
						.map((x, index) => `\`${index + 1}.\` <@${x.userID}>: \`${Number(x.coin).toLocaleString()} coin\``)
						.join("\n")
				: "Veri bulunmuyor!";
		};

		embed.setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true, size: 2048 }));
		embed.setThumbnail(member.guild.iconURL({ dynamic: true, size: 2048 }));
		embed.setDescription(`
    ${role.toString()} rolüne sahip üyelerin verileri
    **───────────────**
    
    **➥ Toplam Ses Bilgileri:**
    ${await voiceData("topStat")}

    **➥ Haftalık Ses Bilgileri:**
    ${await voiceData("weeklyStat")}

    **➥ Günlük Ses Bilgileri:**
    ${await voiceData("dailyStat")}
    
    **───────────────**
    
    **➥ Toplam Mesaj Bilgileri:**
    ${await messageData("topStat")}

    **➥ Haftalık Mesaj Bilgileri:**
    ${await messageData("weeklyStat")}

    **➥ Günlük Mesaj Bilgileri:**
    ${await messageData("dailyStat")}

    ${
			conf.coinSystem
				? `
    **───────────────**

    **➥ Toplam Coin Bilgileri:**
    ${await coinData()}
    `
				: ""
		}
    `);
		reply({ embeds: [embed] });
	}
};
