# Discord Advanced Stat Bot

# Kurulum
* İlk olarak bilgisayarına [Node JS](https://nodejs.org/en/) indir.
* Daha sonra bir [MongoDB](http://mongodb.com) hesabı oluştur ve connection linki al.
  * Eğer bunu yapmayı bilmiyorsan [buraya](https://medium.com/@thearkxd/node-js-projeleri-için-mongodb-atlas-connection-linki-alma-5d955bbe5ae6) tıklayarak medium.com üzerinde yazdığım yazıyı inceleyebilirsin.
* Bu projeyi zip halinde indir.
* Herhangi bir klasöre zipi çıkart.
* Daha sonra src klasörünün içindeki configs klasörünün içine gir `settings.json` ve `config.json` dosyalarının içindeki bilgileri doldur.
* Sonra klasörün içerisinde bir `powershell` ya da `cmd` penceresi aç.
* ```npm install``` yazarak tüm modülleri kur.
* Kurulum bittikten sonra ```npm start``` yaz ve botu başlat.

# Gerekli Ayarlar
`config.json` dosyamıza gelerek botun kaç mesajda kaç coin vereceği gibi bilgileri ayarlıyoruz.
Daha sonra `theark.js` dosyasına gelip, `client.ranks` kısmını;
```js
client.ranks = [
{ role: "rol id", coin: 1 }
]
```
Bu şekilde yaparsanız 1 coine ulaşılınca ID'sini girdiğiniz rolü verecektir.
Bunu istediğiniz gibi arttırabilirsiniz.
Botu 2 günde yazdığımız için rank sistemini ayarlamalı yapmadım. Eğer çok istek gelirse ayarlamalı yaparım.
NOT: Eğer `client.ranks` kısmını doldurmazsanız bot hata verecektir!

Komutlarda girili olan emojileri değiştirmeyi unutmayınız!

Desteklerinden dolayı [Emperor](https://discord.com/users/752513181360062574)'a çok teşekkür ederim.

Tada 🎉. Artık invite botun hazır. Dilediğin gibi kullanabilirsin.

# Görseller:
<img src="https://cdn.discordapp.com/attachments/717686233027051612/816195201151270932/unknown.png">

# İletişim
* [Discord Sunucum](https://discord.gg/UEPcFtytcc)
* [Discord Profilim](https://discord.com/users/350976460313329665)
* Herhangi bir hata bulmanız durumunda ya da yardım isteyeceğiniz zaman buralardan bana ulaşabilirsiniz.

### NOT: Botta MIT lisansı bulunmaktadır. Bu botun dosyalarının benden habersiz paylaşılması/satılması durumunda gerekli işlemler yapılacaktır!
