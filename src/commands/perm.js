const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const coin = require("../schemas/coin");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["perm"],
		name: "yetki",
		help: "yetki [yükselt/düşür] [kullanıcı]",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("yetki")
		.setDescription("Belirttiğiniz kullanıcının yetkisini düşürür/yükseltir.")
		.addStringOption((option) => option.setName("işlem").setDescription("Uygulamak istediğiniz işlem.").addChoice("yükselt", "yükselt").addChoice("düşür", "düşür").setRequired(true))
		.addUserOption((option) => option.setName("kullanıcı").setDescription("Yetkisini düşürmek/yükseltmek istediğiniz kullanıcı.").setRequired(true)),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ message, args, embed, reply, interaction }) => {
		const msgMember = interaction ? interaction.member : message.member;
		if (!msgMember.permissions.has(8)) return reply({ embeds: [embed.setDescription("Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!")] });
		const member = interaction ? interaction.options.getMember("kullanıcı") || interaction.member : message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.member;
		if (!conf.staffs.some((x) => member.roles.cache.has(x))) return reply({ embeds: [embed.setDescription("Bu kullanıcı bir yetkili değil!")] });

		const operation = interaction ? interaction.options.getString("işlem") : args[0];
		const data = (await coin.findOne({ guildID: member.guild.id, userID: member.user.id })) || { coin: 0 };
		const roles = client.ranks.filter((x) => (operation === "yükselt" ? x.coin > data.coin : x.coin < data.coin)).sort((a, b) => b.coin - a.coin);
		const menu = new MessageActionRow().addComponents(
			new MessageSelectMenu().setCustomId("roles").addOptions(
				roles.map((x) => {
					const roleNames =
						x.role.length > 1
							? x.role
									.slice(0, -1)
									.map((r) => member.guild.roles.cache.get(r).name)
									.join(", ") +
							  " ve " +
							  x.role.map((r) => member.guild.roles.cache.get(r).name).slice(-1)
							: x.role.map((r) => member.guild.roles.cache.get(r).name).join("");
					return {
						label: roleNames,
						description: x.coin.toString() + " coin",
						value: x.coin.toString()
					};
				})
			)
		);
		if (roles.length > 0) reply({ embeds: [embed.setDescription(`Kullanıcının yetkisini ${operation}mek istediğiniz rolü seçin.`)], components: [menu] });
		else return reply({ embeds: [embed.setDescription(`Bu kullanıcının yetkisini ${operation}ebileceğiniz bir rol bulunmuyor!`)] });

		const collector = (interaction ? interaction : message).channel.createMessageComponentCollector({
			filter: (i) => i.user.id === msgMember.user.id && i.customId === "roles",
			componentType: "SELECT_MENU",
			time: 15000
		});

		collector.on("collect", async (i) => {
			const currentRank = client.ranks.filter((x) => x.role.some((r) => member.roles.cache.has(r)) && (operation === "yükselt" ? x.coin <= data.coin : x.coin >= data.coin));
			const selectedRank = client.ranks.filter((x) => x.coin === parseInt(i.values[0]))[0];
			currentRank.forEach((x) => x.role.forEach((r) => member.roles.remove(r).catch(() => {})));
			await coin.updateOne({ guildID: member.guild.id, userID: member.user.id }, { $set: { coin: selectedRank.coin } }, { upsert: true });
			selectedRank.role.forEach((x) => member.roles.add(x).catch(() => {}));
			i.update({ embeds: [embed.setDescription(`Kullanıcının yetkisi başarıyla ${Array.isArray(currentRank[0].role) ? currentRank[0].role.listRoles() : `<@&${currentRank[0].role}>`} yetkisinden ${Array.isArray(selectedRank.role) ? selectedRank.role.listRoles() : `<@&${selectedRank.role}>`} yetkisine ${operation}${operation === "yükselt" ? "ildi" : "üldü"}`)], components: [] })
		});
	}
};
