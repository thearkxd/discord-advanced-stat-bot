module.exports = {
  conf: {
    aliases: ["coin-system", "coinsistem", "coinsistemi", "coin-sistem", "coin-sistemi"],
    name: "coinsystem",
    help: "coinsistem [aç/kapat]",
    enabled: true
  },

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {Array<string>} args
   * @param {MessageEmbed} embed
   * @returns {Promise<void>}
   */
  run: async (client, message, args, embed) => {
    if (["aç", "open"].includes(args[0])) {
      if (global.confdb.get("coinSystem")) return message.channel.error(message, "Coin sistemi zaten açık!");
      global.confdb.set("coinSystem", true);
      message.channel.send({ embeds: [embed.setDescription("Coin sistemi başarıyla açıldı!")] });
    } else if (["kapat", "close"].includes(args[0])) {
      if (!global.confdb.get("coinSystem")) return message.channel.error(message, "Coin sistemi zaten kapalı!");
      global.confdb.set("coinSystem", false);
      message.channel.send({ embeds: [embed.setDescription("Coin sistemi başarıyla kapatıldı!")] });
    } else message.channel.send({ embeds: [embed.setDescription(`Coin sistemi: \`${global.confdb.get("coinSystem") ? "açık" : "kapalı"}\``)] });
  }
};