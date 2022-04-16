# Discord Advanced Stat Bot

An advanced and simple statistics bot that you can use on Discord servers.

[![GitHub license](https://img.shields.io/github/license/thearkxd/discord-advanced-stat-bot)](https://github.com/thearkxd/discord-advanced-stat-bot/blob/master/LICENSE.md)
[![Actions Status](https://github.com/thearkxd/discord-advanced-stat-bot/actions/workflows/test.yml/badge.svg)](https://github.com/thearkxd/discord-advanced-stat-bot/actions)
[![GitHub issues](https://img.shields.io/github/issues/thearkxd/discord-advanced-stat-bot)](https://github.com/thearkxd/discord-advanced-stat-bot/issues)

- [Discord Advanced Stat Bot](#discord-advanced-stat-bot)
    - [Content](#content)
    - [Setup](#setup)
    - [FAQ (Frequently Asked Questions)](#faq-frequently-asked-questions)
    - [Images](#images)
    - [Contact](#contact)

### 🌏 [Turkish](https://github.com/thearkxd/discord-advanced-stat-bot/blob/master/README.md)

# Content
These are the features of the bot. If there is a tick next to it, it means it has been added, otherwise it means it will be added.

- [x] **Statistics system**
    * Shows voice and message data of all members on the server.
        * `stat`, `role`, `top`
    
- [x] **Authorized statistics system**
    * Shows the voice and message data of the authorities on the server, and also allows them to bypass the authority by adding points.
        * `ystat`

- [x] **Quest system**
    * It allows them to give tasks to the officials on the server and earn more points.
        * `task`

- [ ] **Badge system**
    * Gives members the roles that are determined when they set specific voice and message goals and reach that goal.

# Setup

- First, download the [Node JS](https://nodejs.org/en/).
- Then, create a [MongoDB](http://mongodb.com) account and get the connection url.
- Download this project and extract.
- Then go into the `configs` folder in the `src` folder and first fill in the information in the `settings.json` file.

    - `token`: Your bot's token.

    - `prefix`: The prefix of your bot.

    - `mongoUrl`: Your Mongo connection link.

    - `owners`: Discord IDs of bot owners.

- Now fill the information inside the `config.json` file in the same folder.

    - `​publicParents:`​ The public voice category of the server.

    - `​registerParents:`​ The recording voice category of the server.

    - `​solvingParents:`​ The server's problem-solving sound category.

    - `​privateParents:`​ The private voice category of the server.

    - `​aloneParents:`​ The solo voice category of the server.

    - `ignoreChannels:` Channels that you do not want coins to be issued.

    - `coinSystem:` Value **true** turns the coin system on, value **false** turns it off.

    - `​rankLog:`​ Rank log channel.

    - `​tag:`​ Your server's tag symbol.

    - `​staffs:`​ Authorized role to be added and increased authority.

    - `​messageCount:`​ How many messages will receive coins.

    - `​messageCoin:`​ messageCount How many coins will be given when messages are sent.

    - `​voiceCount:`​ How many minutes will be given coins after the sound is stopped.

    - `​voiceCoin:`​ How many coins will be issued when the voiceCount stops at the sound for a minute.

    - `​publicCoin:`​ How many coins will be issued when the voiceCount stops at sound in public channels.

    - `​taggedCoin:`​ How many coins will be given when you tag someone with the "tagaldir" command

    - `​emojis:`​ Emojis used in commands. (you can find emojis on my server below)

- **Important information!**: If there is a value like `[]` in the config files, it means you can enter more than one value there. For example; `["theark", "stat", "bot"]`.

- You don't need to fill the `ranks.json` file, commands will use that file.
- Open a `cmd` or a `powershell` window and type `npm install` to install all modules.
- Finally to start the bot, type `npm start`.

# FAQ (Frequently Asked Questions)

## What is this task schema??? Will I create a schema for every task I give!

The task schema is a system prepared for the 'take task' command. In the `task take` command, I added a schema system to avoid complexity, since the bot gives a random task. When the bot will randomly give a task, it randomly chooses one of the schemes you have determined and gives that task to the person. In addition, you can quickly assign a task by adding a schema directly with `task schema give @user schema-id`. :yum:

## What if I'm going to give everyone one task or is there a shortcut for it?! 🤬

Of course there is :). If you tag a role instead of a person while giving a task, the bot will automatically distribute their tasks to **authorized** everyone in that role. 😉

## Now we have `ranks.json` on our heads, what is this?

The "ranks" part in the `ranks.json` file is the part where your privileges are. In short, the ranks section has been moved to a json file so that you can add rank with the command. "tasks" is where the task diagrams are located. If you do not want to add a rank or mission chart with the command, you can write **in accordance with the format** in those parts.

## Well? I downloaded this bot as an authorization booster bot, the coin part is not visible???

There are 3 reasons why the coin section is not visible;

- The person does not have roles that you enter the ID in `staffs` in the `config.json` file.
- You have not added authorization to your bot.
- The coin system is closed.

If it still doesn't appear after checking them, you can write to the help channel on my server.

## What is this sync command?

The synchronize command works as follows; Let's say you entered the 'x, y and z' roles in the 'ranks' section and added the bot to the server. But when you added the bot, I had the 'z' role. If you don't use sync command on me, when I bypass the bot will take my `z` role and give me `x` role. But if you use the synchronize command, the bot will sync my coin count with the coin you assigned to the `z` role.

## I downloaded this bot because there is a task system, invite and registration tasks do not work?? 🤬🤬

In order for the invite tasks to work, you need to download and install my registration bot [here](https://github.com/thearkxd/discord-supervisor-bot) and add it to the server where this bot is located. In order for the registration tasks to work, you need to register the people coming to the server through that bot. :blush:

## I added the bot to my server, I installed it, but the slash commands do not appear?

For Slash commands to appear, you need to grant application commands permission when adding the bot to your server.

- First of all, we enter our bot page from the [Developer Portal](https://discord.com/developers/applications).
- Then, under the 'OAuth2' tab, we click on 'URL Generator' from the left menu.
- Click on `applications.commands` from the right side and copy the link below.
- After you enter the link and give permission to our bot, your slash commands will appear.

<img src="https://cdn.discordapp.com/attachments/770738442744627261/964659371638423552/unknown.png">

### If you get another error or find a problem with the bot, you can come to my Discord server, which I have given the link below, and write to me. :blush:

## Images:

<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965017292977078372/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965019089380708412/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965021715526713384/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022085229477928/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022213839405086/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022328712994876/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022484946649178/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965022770880708638/unknown.png">
<img  src="https://cdn.discordapp.com/attachments/770738442744627261/965023300826824795/unknown.png">

## Contact

- [My Discord Server](https://discord.gg/UEPcFtytcc)
- [My Discord Profile](https://discord.com/users/350976460313329665)
- You can contact me here if you find any mistakes or when you need help.
