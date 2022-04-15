const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	conf: {
		aliases: ["help", "y", "h"],
		name: "yardım",
		enabled: true,
		slash: true
	},

	slashOptions: new SlashCommandBuilder()
		.setName("yardım")
		.setDescription("Komutlar hakkında bilgi verir."),

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, reply, embed, prefix }) => {
		const list = client.commands
			.filter((x) => x.conf.help)
			.sort((a, b) => b.conf.help - a.conf.help)
			.map((x) => `\`${prefix}${x.conf.help}\``)
			.join("\n");

		reply({ embeds: [embed.setDescription(list)] });
	}
};
