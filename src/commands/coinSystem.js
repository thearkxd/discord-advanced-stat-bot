const { SlashCommandBuilder } = require("@discordjs/builders");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = {
	conf: {
		aliases: ["coin-system", "coinsistem", "coinsystem", "coin-sistem", "coin-sistemi"],
		name: "coinsistemi",
		help: "coinsistemi [aç/kapat]",
		enabled: true,
		slash: true,
	},

	slashOptions: new SlashCommandBuilder()
		.setName("coinsistemi")
		.setDescription("Coin sistemini açar ya da kapatır.")
		.addStringOption((option) => option.setName("işlem").setDescription("Uygulamak istediğiniz işlem.").setRequired(true).addChoice("aç", "aç").addChoice("kapat", "kapat")),

	run: async ({ client, interaction, args, embed, reply }) => {
		if (["aç", "open"].includes(args[0])) {
			if (global.confdb.get("coinSystem")) return reply({ embeds: [embed.setDescription("Coin sistemi zaten açık!")] });
			global.confdb.set("coinSystem", true);
			reply({ embeds: [embed.setDescription("Coin sistemi başarıyla açıldı!")] });
		} else if (["kapat", "close"].includes(args[0])) {
			if (!global.confdb.get("coinSystem")) return reply({ embeds: [embed.setDescription("Coin sistemi zaten kapalı!")] });
			showModal(
				new Modal()
					.setCustomId("close-coin-system")
					.setTitle("Onay")
					.addComponents(
						new TextInputComponent()
							.setCustomId("sure")
							.setLabel("Sistemi kapatmak istediğine emin misin?")
							.setStyle("SHORT")
							.setPlaceholder("evet / hayır")
							.setRequired(true)
					),
				{
					client,
					interaction
				}
			);
		} else reply({ embeds: [embed.setDescription(`Coin sistemi: \`${global.confdb.get("coinSystem") ? "açık" : "kapalı"}\``)] });
	}
};
