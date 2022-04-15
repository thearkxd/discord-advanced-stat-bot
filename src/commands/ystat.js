const { SlashCommandBuilder } = require("@discordjs/builders");
const conf = require("../configs/config.json");
const coin = require("../schemas/coin");

module.exports = {
	conf: {
		aliases: [],
		name: "ystat",
		help: "ystat [kullanıcı]?",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("ystat")
		.setDescription("Belirtilen kullanıcının ya da sizin yetkili istatistiklerinizi gösterir.")
		.addUserOption((option) => option.setName("kullanıcı").setDescription("Yetkili istatistikleri gösterilecek olan kullanıcı.").setRequired(false)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, reply, embed, interaction }) => {
		const guild = interaction ? interaction.guild : message.guild;
		const member = interaction ? interaction.options.getMember("kullanıcı") || interaction.member : message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		if (!conf.staffs.some((x) => member.roles.cache.has(x))) return reply({ embeds: [embed.setDescription("Bu kullanıcı bir yetkili değil!")] });
		const coinData = await coin.findOne({ guildID: guild.id, userID: member.user.id });

		const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find((x) => x.coin >= (coinData ? Math.floor(coinData.coin) : 0)))] || client.ranks[client.ranks.length - 1];
		const currentRank = client.ranks.filter((x) => (coinData ? Math.floor(coinData.coin) : 0) >= x.coin).last();

		if (conf.coinSystem && member.hasRole(conf.staffs, false) && client.ranks.length > 0) {
			embed.addField("**➥ Puan Durumu:**", `\n${client.progressBar(coinData ? Math.floor(coinData.coin) : 0, maxValue.coin, 8)} \`${coinData ? Math.floor(coinData.coin) : 0} / ${maxValue.coin}\``);
			embed.addField(
				"**➥ Yetki Durumu:**",
				currentRank !== client.ranks.last()
					? `${currentRank ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.listRoles() : `<@&${currentRank.role}>`} yetkisindesiniz.` : ""} ${
							Array.isArray(maxValue.role) ? maxValue.role.listRoles() : `<@&${maxValue.role}>`
					  } yetkisine ulaşmak için \`${Math.floor(maxValue.coin - Math.floor(coinData.coin))}\` coin daha kazanmanız gerekiyor!`
					: "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz."
			);
		}
		embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
		embed.setDescription(`${member.user.toString()} (${member.roles.highest.toString()}) kullanıcısının yetkili aktiflik istatistikleri`);
		reply({ embeds: [embed] });
	}
};
