const { Util } = require("discord.js");

module.exports = {
	conf: {
		aliases: [],
		name: "eval",
		owner: true,
		enabled: true,
		slash: false,
		options: [
			{
				name: "komut",
				description: "Çalıştırılacak komut.",
				type: 3,
				required: true
			}
		]
	},

	/**
	 * @returns {Promise<void>}
	 */
	run: async ({ client, message, args, reply }) => {
		if (!args[0]) return;
		const code = args.join(" ");

		try {
			const result = clean(await eval(code));
			if (result.includes(client.token)) return reply({ content: "Kancık seni .d" });
			Util.splitMessage(`\`\`\`js\n${result}\`\`\``).forEach((x) => reply({ content: x }));
		} catch (err) {
			Util.splitMessage(`\`\`\`js\n${err}\`\`\``).forEach((x) => reply({ content: x }));
		}
	}
};

function clean(text) {
	if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
	text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	return text;
}
