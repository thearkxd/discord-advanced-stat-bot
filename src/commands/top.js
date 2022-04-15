const { SlashCommandBuilder } = require("@discordjs/builders");
const moment = require("moment");
require("moment-duration-format");
const messageGuild = require("../schemas/messageGuild");
const messageGuildChannel = require("../schemas/messageGuildChannel");
const voiceGuild = require("../schemas/voiceGuild");
const voiceGuildChannel = require("../schemas/voiceGuildChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const coin = require("../schemas/coin");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: [],
		name: "top",
		help: "top",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder().setName("top").setDescription("Sunucunun toplam istatistiklerini gösterir."),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ message, embed, reply, interaction }) => {
		const guild = interaction ? interaction.guild : message.guild;
		const messageChannelData = await messageGuildChannel.find({ guildID: guild.id }).sort({ channelData: -1 });
		const voiceChannelData = await voiceGuildChannel.find({ guildID: guild.id }).sort({ channelData: -1 });
		const messageUsersData = await messageUser.find({ guildID: guild.id }).sort({ topStat: -1 });
		const voiceUsersData = await voiceUser.find({ guildID: guild.id }).sort({ topStat: -1 });
		const messageGuildData = await messageGuild.findOne({ guildID: guild.id });
		const voiceGuildData = await voiceGuild.findOne({ guildID: guild.id });
		const coinData = await coin.find({ guildID: guild.id }).sort({ coin: -1 });

		let coinSum = 0;

		const messageChannels = messageChannelData
			.splice(0, 5)
			.map((x, index) => `\`${index + 1}.\` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``)
			.join("\n");
		const voiceChannels = voiceChannelData
			.splice(0, 5)
			.map((x, index) => `\`${index + 1}.\` <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika] s [saniye]")}\``)
			.join("\n");
		const messageUsers = messageUsersData
			.splice(0, 5)
			.map((x, index) => `\`${index + 1}.\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``)
			.join("\n");
		const voiceUsers = voiceUsersData
			.splice(0, 5)
			.map((x, index) => `\`${index + 1}.\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``)
			.join("\n");
		const coinUsers = coinData
			.splice(0, 5)
			.map((x, index) => {
				coinSum += x.coin;
				return `\`${index + 1}.\` <@${x.userID}>: \`${Number(Math.floor(x.coin)).toLocaleString()} coin\``;
			})
			.join("\n");

		embed.setAuthor(guild.name, guild.iconURL({ dynamic: true, size: 2048 }));
		embed.setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }));
		embed.setDescription(`
    ${guild.name} sunucusunun toplam verileri
    **───────────────**
    
    **➥ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [saat], m [dakika] s [saniye]")}\`)**
    ${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}
    
    **➥ Ses Kanal Bilgileri:**
    ${voiceChannels.length > 0 ? voiceChannels : "Veri Bulunmuyor."}
    
    **───────────────**
    
    **➥ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)**
    ${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}
    
    **➥ Mesaj Kanal Bilgileri:**
    ${messageChannels.length > 0 ? messageChannels : "Veri Bulunmuyor."}

    ${
			conf.coinSystem
				? `
    **───────────────**

    **➥ Coin Bilgileri: \`(Toplam ${coinSum})\`**
    ${coinUsers.length > 0 ? coinUsers : "Veri Bulunmuyor."}
    `
				: ""
		}
    `);
		reply({ embeds: [embed] });
	}
};
