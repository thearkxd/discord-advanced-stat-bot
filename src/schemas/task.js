const { Schema, model } = require("mongoose");

const schema = Schema({
	guildID: { type: String, default: "" },
	userID: { type: String, default: "" },
	id: { type: Number, default: 0 },
	type: { type: String, default: "" },
	count: { type: Number, default: 0 },
	prizeCount: { type: Number, default: 0 },
	active: { type: Boolean, default: true },
	finishDate: { type: Number, default: Date.now() },
	date: { type: Number, default: Date.now() },
	completed: { type: Boolean, default: false },
	completedCount: { type: Number, default: 0 },
	channels: { type: Array, default: null },
	message: { type: String, default: "" }
});

module.exports = model("task", schema);
