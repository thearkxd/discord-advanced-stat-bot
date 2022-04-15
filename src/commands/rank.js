const { SlashCommandBuilder } = require("@discordjs/builders");
const conf = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["yetki"],
		name: "rank",
		help: "rank [ekle] [coin] [rol(ler)] / [sil] [coin] / [temizle] / [liste]",
		enabled: conf.coinSystem,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("rank")
		.setDescription("Rank sistemi işlemleri.")
		.addSubcommand((command) =>
			command
				.setName("ekle")
				.setDescription("Rank ekleme işlemi.")
				.addIntegerOption((option) => option.setName("coin").setDescription("Rank'e kaç coinde ulaşılabileceği.").setRequired(true))
				.addRoleOption((option) => option.setName("roller").setDescription("Rank'e ulaştığında verilen rol(ler).").setRequired(true))
		)
		.addSubcommand((command) =>
			command
				.setName("sil")
				.setDescription("Rank silme işlemi.")
				.addIntegerOption((option) => option.setName("coin").setDescription("Kaç coinde ulaşılan rank'in silineceği.").setRequired(true))
		)
		.addSubcommand((command) => command.setName("temizle").setDescription("Bütün rank'leri silme işlemi."))
		.addSubcommand((command) => command.setName("liste").setDescription("Bütün rank'lerin listesi.")),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, args, embed, reply, interaction }) => {
		if (!conf.coinSystem) return reply({ embeds: [embed.setDescription("Coin sistemi kapalı olduğu için bu komutu kullanamazsınız!")] });
		const member = interaction ? interaction.member : message.member;
		if (!member.permissions.has(8)) return;
		const coin = interaction ? interaction.options.getInteger("coin") : args[1];
		if (["ekle", "add"].includes(args[0]) || interaction.options.getSubcommand() === "ekle") {
			if (!coin || isNaN(coin)) return reply({ embeds: [embed.setDescription("Eklenecek yetkinin coinini belirtmelisin!")] });
			if (client.ranks.some((x) => x.coin === coin)) return reply({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller zaten ayarlanmış!`)] });
			const roles = interaction ? [interaction.options.getRole("roller")] : [...message.mentions.roles.values()];
			if (!roles || !roles.length) return reply({ embeds: [embed.setDescription("Eklenecek yetkinin rol(leri) belirtmelisin!")] });
			client.ranks = global.rankdb.push("ranks", { role: roles.map((x) => x.id), coin: parseInt(coin) }).sort((a, b) => a.coin - b.coin);
			reply({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller ayarlandı! \nVerilecek Roller: ${roles.map((x) => `<@&${x.id}>`).join(", ")}`)] });
		} else if (["sil", "delete", "remove"].includes(args[0]) || interaction.options.getSubcommand() === "sil") {
			if (!coin || isNaN(coin)) return reply({ embeds: [embed.setDescription("Silinecek yetkinin coinini belirtmelisin!")] });
			if (!client.ranks.some((x) => x.coin === coin)) return reply({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller ayarlanmamış!`)] });
			client.ranks = global.rankdb
				.set(
					"ranks",
					client.ranks.filter((x) => x.coin !== coin)
				)
				.sort((a, b) => a.coin - b.coin);
			reply({ embeds: [embed.setDescription(`${coin} coine ulaşıldığında verilecek roller silindi!`)] });
		} else if (["temizle", "clear"].includes(args[0]) || interaction.options.getSubcommand() === "temizle") {
			if (!global.rankdb.get("ranks") || !global.rankdb.get("ranks").length) return reply({ embeds: [embed.setDescription("Rank sistemi tertemiz!")] });
			global.rankdb.set("ranks", []);
			reply({ embeds: [embed.setDescription("Tüm yetkiler başarıyla temizlendi!")] });
		} else if (["liste", "list"].includes(args[0]) || interaction.options.getSubcommand() === "liste") {
			const ranks = global.rankdb.get("ranks");
			reply({
				embeds: [
					embed.setDescription(
						ranks && ranks.length
							? ranks
									.sort((a, b) => b.coin - a.coin)
									.map((x) => `${Array.isArray(x.role) ? x.role.listRoles() : `<@&${x.role}>`}: ${x.coin}`)
									.join("\n")
							: "Rank ayarlanmamış!"
					)
				]
			});
		}
	}
};
