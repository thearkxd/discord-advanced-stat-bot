const { readdirSync } = require("fs");
const client = global.client;

const files = readdirSync("./src/events");
files
	.filter((x) => x.endsWith(".js"))
	.forEach((file) => {
		const event = require(`../events/${file}`);
		if (!event.conf) return;
		client.on(event.conf.name, event);
		console.log(`[EVENT] ${event.conf.name} loaded!`);
	});
