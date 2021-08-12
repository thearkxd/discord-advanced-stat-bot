const coin = require("../schemas/coin");
const taggeds = require("../schemas/taggeds");
const conf = require("../configs/config.json");
const tasks = require("../schemas/task");

module.exports = {
  conf: {
    aliases: ["tag-aldır", "taglıaldır"],
    name: "tagaldır",
    help: "tagaldır [kullanıcı]",
    enabled: conf.coinSystem
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<string>} args
   * @param {MessageEmbed} embed
   * @returns {Promise<void>}
   */
  run: async (client, message, args, embed) => {
    if (!conf.staffs.some(x => message.member.roles.cache.has(x))) return;
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({ embeds: [embed.setDescription("Bir üye belirtmelisin!")] });
    if (!member.user.username.includes(conf.tag)) return message.channel.send({ embeds: [embed.setDescription("Bu üye taglı değil!")] });
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (taggedData && taggedData.taggeds.includes(member.user.id)) return message.channel.send({ embeds: [embed.setDescription("Bu üyeye zaten daha önce tag aldırmışsın!")] });

    embed.setDescription(`${message.member.toString()} üyesi sana tag aldırmak istiyor. Kabul ediyor musun?`);
    const msg = await message.channel.send({ content: member.toString(), embeds: [embed] });
    msg.react("✅");
    msg.react("❌");

    msg.awaitReactions({ filter: (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === member.user.id, max: 1, time: 30000, errors: ["time"] }).then(async collected => {
      const reaction = collected.first();
      if (reaction.emoji.name === "✅") {
        await coin.findOneAndUpdate({ guildID: member.guild.id, userID: message.author.id }, { $inc: { coin: conf.taggedCoin } }, { upsert: true });
        embed.setColor("GREEN");
        msg.edit(embed.setDescription(`${member.toString()} üyesine başarıyla tag aldırıldı!`));
        await taggeds.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $push: { taggeds: member.user.id } }, { upsert: true });

        message.member.updateTask(message.guild.id, "taglı", 1, message.channel);
      } else {
        embed.setColor("RED");
        msg.edit(embed.setDescription(`${member.toString()} üyesi, tag aldırma teklifini reddetti!`));
      }
    }).catch(() => msg.edit(embed.setDescription("Tag aldırma işlemi iptal edildi!")));
  }
};
