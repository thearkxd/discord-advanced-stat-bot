const fs = require("fs");
const client = global.client;

fs.readdir("./src/commands", (err, files) => {
	if (err) console.error(err);
	files.forEach((f) => {
		const props = require(`../commands/${f}`);
		console.log(`[COMMAND] ${props.conf.name} loaded!`);
		client.commands.set(props.conf.name, props);
	});
});
