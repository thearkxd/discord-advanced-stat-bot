# Discord Advanced Stat Bot

Discord sunucularınızda kullanabileceğiniz gelişmiş ve sade bir istatistik botu.

[![GitHub license](https://img.shields.io/github/license/thearkxd/discord-advanced-stat-bot)](https://github.com/thearkxd/discord-advanced-stat-bot/blob/master/LICENSE.md)
[![Actions Status](https://github.com/thearkxd/discord-advanced-stat-bot/actions/workflows/test.yml/badge.svg)](https://github.com/thearkxd/discord-advanced-stat-bot/actions)
[![GitHub issues](https://img.shields.io/github/issues/thearkxd/discord-advanced-stat-bot)](https://github.com/thearkxd/discord-advanced-stat-bot/issues)

- [Discord Advanced Stat Bot](#discord-advanced-stat-bot)
    - [İçerikler](#içerik)
    - [Kurulum](#kurulum)
    - [SSS (Sıkça Sorulan Sorular)](#sss-sıkça-sorulan-sorular)
    - [Görseller](#görseller)
    - [İletişim](#iletişim)

### 🌏 [English](https://github.com/thearkxd/discord-advanced-stat-bot/blob/master/README.en.md)

# İçerik
Botun içinde bulunan özellikler bunlardır. Eğer yanında tik işareti varsa eklenmiş, yoksa eklenecek anlamına gelmektedir.

- [x] **İstatistik sistemi**
	* Sunucudaki bütün üyelerin ses ve mesaj verilerini gösterir.
		* `stat`, `rol`, `top`

- [x] **Yetkili istatistik sistemi**
	* Sunucudaki yetkililerin ses ve mesaj verilerini gösterir, ayrıca onlara puan ekleyerek yetki atlamalarını sağlar.
		* `ystat`

- [x] **Görev sistemi**
	* Sunucudaki yetkililere görev verip daha çok puan kazanmalarını sağlar.
		* `görev`

- [ ] **Rozet sistemi**
	* Üyelere belirli ses ve mesaj hedefleri belirleyip o hedefe ulaştıklarında belirlenen rolleri verir.

# Kurulum

- İlk olarak bilgisayarına [Node JS](https://nodejs.org/en/) indir.

- Daha sonra bir [MongoDB](http://mongodb.com) hesabı oluştur ve connection linki al.

	- Eğer bunu yapmayı bilmiyorsan [buraya](https://medium.com/@thearkxd/node-js-projeleri-için-mongodb-atlas-connection-linki-alma-5d955bbe5ae6) tıklayarak medium.com üzerinde yazdığım yazıyı inceleyebilirsin.

- Bu projeyi zip halinde indir ve projeyi zipten çıkart.

- Daha sonra `src` klasörünün içindeki `configs` klasörünün içine gir ve öncelikle `settings.json` dosyasının içindeki bilgileri doldur.

	-  `token`: Botunuzun tokeni.

	-  `prefix`: Botunuzun prefixi.

	-  `mongoUrl`: Mongo connection linkiniz.

	-  `owners`: Bot sahiplerinin Discord ID'leri.

- Şimdi aynı klasördeki `config.json` dosyasının içindeki bilgileri doldur.

	-  `​publicParents:`​ Sunucunun public ses kategorisi.

	-  `​registerParents:`​ Sunucunun kayıt ses kategorisi.

	-  `​solvingParents:`​ Sunucunun sorun çözme ses kategorisi.

	-  `​privateParents:`​ Sunucunun private ses kategorisi.

	-  `​aloneParents:`​ Sunucunun alone ses kategorisi.

	-  `ignoreChannels:` Coin verilmesini istemediğiniz kanallar.

	-  `coinSystem:`  **true** değeri coin sistemini açar, **false** değeri ise kapatır.

	-  `​rankLog:`​ Rank log kanalı.

	-  `​tag:`​ Sunucu tag sembolünüz.

	-  `​staffs:`​ Coin eklenip yetkisi arttırılacak yetkili rolü.

	-  `​messageCount:`​ Kaç mesajda coin verileceği.

	-  `​messageCoin:`​ messageCount adet mesaj atılınca kaç coin verileceği.

	-  `​voiceCount:`​ Seste kaç dakika durunca coin verileceği.

	-  `​voiceCoin:`​ voiceCount dakika seste durunca kaç coin verileceği.

	-  `​publicCoin:`​ Public kanallarda voiceCount dakika seste durunca kaç coin verileceği.

	-  `​taggedCoin:`​ Birisine "tagaldır" komutu ile tag aldırınca kaç coin verileceği

	-  `​emojis:`​ Komutlarda kullanılan emojiler. (emojileri aşağıdaki sunucumda bulabilirsiniz)

	- **Önemli bilgi!**: Eğer config dosyalarında `[]` şeklinde bir değer varsa, demektir ki oraya birden fazla değer girebiliyorsun. Örneğin; `["theark", "stat", "bot"]`.

- `ranks.json` dosyasını doldurmanıza gerek yok, o dosyayı komutlar kullanacak.

- Sonra klasörün içerisinde bir `powershell` ya da `cmd` penceresi aç ve `npm install` yazarak tüm modülleri kur.

- Kurulum bittikten sonra `npm start` yaz ve botu başlat.


# SSS (Sıkça Sorulan Sorular)

## Bu görev şeması ne??? Ben vereceğim her görev için şema mı oluşturacağım!

Görev şeması, `görev al` komutu için hazırlanmış bir sistemdir. `görev al` komutunda, bot rastgele bir görev verdiğinden dolayı, karmaşıklık oluşmaması için şema sistemi ekledim. Bot, rastgele görev vereceği zaman, sizin belirlediğiniz şemalardan birini rastgele seçiyor ve kişiye o görevi veriyor. Ayrıca şema ekleyerek direk `görev şema ver @kullanıcı şema-id` ile de hızlıca görev verebilirsiniz. :yum:

## Ya ben herkese tek tek görev mi vereceğim, yok mu bunun bir kısayolu?! 🤬

Tabii ki var :). Görev verirken kişi yerine rol etiketlerseniz, bot otomatik olarak o roldeki **yetkili olan** herkese görevlerini dağıtacaktır. 😉
	
## Şimdi de başımıza `ranks.json` çıktı yav bu ne?

`ranks.json` dosyası içindeki "ranks" kısmı, sizin yetkilerinizin bulunduğu kısımdır. Yani kısacası komutla rank ekleyebilmeniz için ranks kısmı bir json dosyasına taşındı. "tasks" ise görev şemalarının bulunduğu yerdir. Komutla rank ya da görev şeması eklemek istemiyorsanız, **formata uygun şekilde** o kısımlara yazabilirsiniz.

## Eeee? Ben bu botu yetki yükseltme botu olarak indirmiştim, coin kısmı görünmüyor???

Coin kısmının görünmemesinin 3 nedeni vardır;

- Kişide, `config.json` dosyasında `staffs` içine ID'sini girdiğiniz roller yoktur. 
- Botunuza yetki eklememişsinizdir. 
- Coin sistemi kapalıdır.

Bunları kontrol ettikten sonra hâlâ görünmüyorsa sunucumdaki yardım kanalına yazabilirsiniz.

## Nedir bu senkronize komutu?

Senkronize komutu ise şu işe yarar; Diyelim siz `ranks` kısmına `x, y ve z` rollerini girdiniz ve botu sunucuya eklediniz. Fakat bende botu eklediğiniz zaman `z` rolü vardı. Eğer siz benim üstümde senkronize komutunu kullanmazsanız, ben yetki atladığım zaman bot benim `z` rolümü alıp bana `x` rolü verecektir. Fakat eğer senkronize komutunu kullanırsanız, bot benim coin sayımı, `z` rolüne atadığınız coin ile eşitleyecektir.

## Ben bu botta görev sistemi var diye indirmiştim, davet ve kayıt görevleri çalışmıyor?? 🤬🤬

Davet görevlerinin çalışabilmesi için, [buradan](https://github.com/thearkxd/discord-supervisor-bot) benim kayıt botumu indirip kurmanız, bu botun bulunduğu sunucuya eklemeniz gerekmektedir. Kayıt görevlerinin çalışabilmesi için ise sunucuya gelen kişilerin kaydını o bot üzerinden yapmanız gerekmektedir. :blush:

## Botu sunucuma ekledim, kurdum fakat slash komutları görünmüyor?

Slash komutların görünmesi için botu sunucunuza eklerken application commands izni vermeniz gerekiyor.

- Öncelikle [Developer Portal](https://discord.com/developers/applications)'dan bot sayfamıza giriyoruz.
- Daha sonra soldaki menüden `OAuth2` sekmesinin altından `URL Generator`'a tıklıyoruz.
- Sağ taraftan `applications.commands` tikine tıklıyoruz ve aşağıdaki linki kopyalıyoruz.
- Linke girip botumuza izni verdikten sonra slash komutlarınız görünecektir.

<img src="https://cdn.discordapp.com/attachments/770738442744627261/964659371638423552/unknown.png">

### Başka bir hata almanız ya da botta bir sorun bulmanız dahilinde aşağıda linkini verdiğim Discord sunucuma gelip bana yazabilirsiniz. :blush: 

# Görseller:

<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965017292977078372/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965019089380708412/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965021715526713384/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022085229477928/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022213839405086/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022328712994876/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022484946649178/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022770880708638/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965023300826824795/unknown.png">

  

# İletişim

- [Discord Sunucum](https://discord.gg/UEPcFtytcc)

- [Discord Profilim](https://discord.com/users/350976460313329665)

- Herhangi bir hata bulmanız durumunda ya da yardım isteyeceğiniz zaman buralardan bana ulaşabilirsiniz.
