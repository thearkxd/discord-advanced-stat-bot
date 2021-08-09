const { Client, Collection, Intents } = require("discord.js");
const client = (global.client = new Client({
	fetchAllMembers: true,
	intents: [
    Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	]
}));
const settings = require("./src/configs/settings.json");
const { Database } = require("ark.db");
global.confdb = new Database("./src/configs/config.json");
const rankdb = (global.rankdb = new Database("./src/configs/ranks.json"));
client.commands = new Collection();
client.cooldown = new Map();
client.ranks = rankdb.get("ranks")
	? rankdb.get("ranks").sort((a, b) => a.coin - b.coin)
	: [];
client.tasks = rankdb.get("tasks") || [];
require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
	.login(settings.token)
	.then(() => console.log("[BOT] Bot connected!"))
	.catch(() => console.log("[BOT] Bot can't connected!"));
