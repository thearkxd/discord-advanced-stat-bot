const { readdirSync } = require("fs");
const client = global.client;

const files = readdirSync("./src/commands");
files.filter((x) => x.endsWith(".js")).forEach(async (f) => {
	const cmd = require(`../commands/${f}`);
	if (!cmd.conf) return;
	client.commands.set(cmd.conf.name, cmd);
	console.log(`[COMMAND] ${cmd.conf.name} loaded!`);
});
