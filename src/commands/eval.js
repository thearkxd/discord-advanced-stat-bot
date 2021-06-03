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
				return message.channel.send("Kancık seni .d");
			message.channel.send(result, {
				code: "js",
				split: true
			});
		} catch (err) {
			message.channel.send(err, { code: "js", split: true });
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
