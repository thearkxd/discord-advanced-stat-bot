const { Client, Collection, Intents } = require("discord.js");
const client = (global.client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS
	]
}));
const settings = require("./configs/settings.json");
const { Database } = require("ark.db");
global.confdb = new Database("./configs/config.json");
const rankdb = (global.rankdb = new Database("./configs/ranks.json"));
client.commands = new Collection();
client.cooldown = new Map();
client.ranks = rankdb.get("ranks") ? rankdb.get("ranks").sort((a, b) => a.coin - b.coin) : [];
client.tasks = rankdb.get("tasks") || [];
const discordModals = require("discord-modals");
discordModals(client);
require("./util/helpers/eventHandler");
require("./util/helpers/mongoHandler");

client.on("ready", () => {
	require("./util/helpers/commandHandler");
	require("./util/util")(client);
});

client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));