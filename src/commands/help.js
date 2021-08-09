module.exports = {
	conf: {
		aliases: ["help", "y", "h"],
		name: "yardım",
		enabled: true
	},

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array<string>} args
	 * @param {MessageEmbed} embed
	 * @param {String} prefix
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args, embed, prefix) => {
		const list = client.commands
			.filter((x) => x.conf.help)
			.sort((a, b) => b.conf.help - a.conf.help)
			.map((x) => `\`${prefix}${x.conf.help}\``)
			.join("\n");

		message.channel.send({ embeds: [embed.setDescription(list)] });
	}
};
