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

Tada 🎉. Artık botun hazır. Dilediğin gibi kullanabilirsin.

# Önemli Bilgiler!
Eğer bir kullanıcıda `config.json` dosyasındaki staffs kısmına ID'sini girdiğin rollerden biri yoksa, bot o kullanıcıya coin eklemez ve yetkisini atlatmaz!

Senkronize komutu ise şu işe yarar; Diyelim siz `client.ranks` kısmına `x, y ve z` rollerini girdiniz ve botu sunucuya eklediniz. Fakat bende botu eklediğiniz zaman halihazırda `z` rolü vardı. Eğer siz benim üstümde senkronize komutunu kullanmazsanız, ben yetki atladığım zaman bot benim `z` rolümü alıp bana `x` rolü verecektir. Fakat eğer senkronize komutunu kullanırsanız, bot benim coinimi, `z` rolüne atadığınız coin ile eşitleyecektir.

Botu Glitch'te kullanmak için `package.json` dosyasını Glitch uyumlu hale getirmeniz gerekmektedir!

# Görseller:
<img src="https://cdn.discordapp.com/attachments/717686233027051612/816195201151270932/unknown.png">

# İletişim
* [Discord Sunucum](https://discord.gg/UEPcFtytcc)
* [Discord Profilim](https://discord.com/users/350976460313329665)
* Herhangi bir hata bulmanız durumunda ya da yardım isteyeceğiniz zaman buralardan bana ulaşabilirsiniz.

### NOT: Botta MIT lisansı bulunmaktadır. Bu botun dosyalarının benden habersiz paylaşılması/satılması durumunda gerekli işlemler yapılacaktır!
