const { Util } = require("discord.js");

module.exports = {
	conf: {
		aliases: [],
		name: "eval",
		owner: true,
		enabled: true
	},

	/**
	 * @param {Client} client
	 * @param {Message} message
	 * @param {Array<string>} args
	 * @param {MessageEmbed} embed
	 * @returns {Promise<void>}
	 */
	run: async (client, message, args, embed) => {
		if (!args[0]) return;
		const code = args.join(" ");

		try {
			const result = clean(await eval(code));
			if (result.includes(client.token))
				return message.channel.send({ content: "Kancık seni .d" });
			Util.splitMessage(`\`\`\`js\n${result}\`\`\``).forEach((x) => message.channel.send({ content: x }));
		} catch (err) {
			Util.splitMessage(`\`\`\`js\n${err}\`\`\``).forEach((x) => message.channel.send({ content: x }));
		}
	}
};

function clean(text) {
	if (typeof text !== "string")
		text = require("util").inspect(text, { depth: 0 });
	text = text
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203));
	return text;
}
