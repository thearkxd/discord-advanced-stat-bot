module.exports = async (modal) => {
	if (modal.customId === "close-coin-system") {
        if (modal.getTextInputValue("sure") === "evet") {
            global.confdb.set("coinSystem", false);
            modal.reply({ content: "Coin sistemi başarıyla kapatıldı!" });
        } else modal.reply({ content: "İşlem iptal edildi!" })
	}
};

module.exports.conf = {
	name: "modalSubmit"
};
