const { readdirSync } = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const settings = require("../../configs/settings.json");
const client = global.client;
const rest = new REST({ version: "9" }).setToken(settings.token);

const dirs = readdirSync("./src/commands/");
dirs
	.filter((cmd) => cmd.endsWith(".js"))
	.forEach((cmd) => {
		const command = require(`../../commands/${cmd}`);
		if (!command.run || !command.conf.enabled) return;
		client.commands.set(command.conf.name, command);
		console.log(`[COMMAND] ${command.conf.name} loaded!`);
	});

const body = [...client.commands.values()].filter((x) => x.conf.slash && x.conf.enabled).map((x) => x.slashOptions.toJSON());
rest
	.put(Routes.applicationCommands(client.user.id), { body })
	.then(() => console.log("[SLASH] Slash commands are loaded!"))
	.catch(console.error);
