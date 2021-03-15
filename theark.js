const { Client, Collection } = require("discord.js");
const client = (global.client = new Client());
const settings = require("./src/configs/settings.json");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();
client.ranks = [
  { role: "803544527968534528", coin: 100 },
  { role: "803544527066628106", coin: 100 },
  { role: "803544525950812180", coin: 100 },
  { role: "803544524831850537", coin: 100 },
  { role: "803544523988664341", coin: 100 },
  { role: "803544522697080842", coin: 100 },
  { role: "803544521723478067", coin: 100 },
  { role: "803544521207971871", coin: 100 },
  { role: "803544520474099712", coin: 100 },
  { role: "803544519516618803", coin: 100 },
];
require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");

client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot connected!"))
  .catch(() => console.log("[BOT] Bot can't connected!"));