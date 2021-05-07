const { GuildMember } = require("discord.js");

/**
 * @param { Client } client
 */

module.exports = async (client) => {
  GuildMember.prototype.hasRole = (role, every = true) => (Array.isArray(role) && (every && role.every((x) => this.roles.cache.has(x)) || !every && role.some((x) => this.roles.cache.has(x))) || !Array.isArray(role) && this.roles.cache.has(role));
};