import {Message} from "discord.js";
const re = /[\s]+/

function handle(msg: Message) {
    const cmd = msg.content.split(re, 1)[0]
    switch (cmd) {
        case "!p":
        case "!ping":
            msg.reply('Pong!').then(console.log).catch(console.error);
    }
}