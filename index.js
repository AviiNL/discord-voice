const Discord = require("discord.js");
const Bot     = require('./bot');

if(process.env.path) {
    let paths, explode_char;
    if (/^win/.test(process.platform)) {
        explode_char = ';';
    } else {
        explode_char = ':';
    }

    paths = process.env.path.split(explode_char);
    paths.push(__dirname + '/bin');

    process.env.path = paths.join(explode_char);
}

// Make a client to add events to
const client = new Discord.Client();

client.on("ready", function () {

    const bot = new Bot(client.user.username, "Ruben");

    let voice_channel, text_channel;
    for (let c of client.channels) {

        if (c[1] instanceof Discord.VoiceChannel) {
            if (c[1].name === 'Anduru Dignun') { //Anduru Dignun
                voice_channel = c[1];
            }
        }

        if (c[1] instanceof Discord.TextChannel) {
            if (c[1].name === 'chatbot') {
                text_channel = c[1];
            }
        }
    }

    console.log(bot.getName());
    text_channel.members.get(client.user.id).setNickname(bot.getName());

    voice_channel.join()
        .then((conn) => {

            const receiver = conn.createReceiver();

            conn.on('speaking', (user, speaking) => {

                if (speaking && voice_channel.members.has(user.id)) {

                    let speaker    = voice_channel.members.find(val => val.id === user.id).displayName;

                    bot.listen(receiver.createOpusStream(user), speaker)
                        .then((data) => {

                            if (data.hasOwnProperty('filename')) {
                                conn.playFile(data.filename);
                            }
                            if (data.hasOwnProperty('text')) {
                                text_channel.send(data.text);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });

                }
            });


        })
        .catch((err) => console.error(err));

});

client.login("MzA3MjEwMDMyODY3NTczNzcw.DCL_JA.LVXusbGTb52kV3OgzN8AIIBuILI");

