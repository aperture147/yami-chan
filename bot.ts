import {Client} from "discord.js";
import {handle} from "./command";

const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activity: {
            name: 'Ylang Ylang EP (FKJ)',
            url: 'https://www.youtube.com/watch?v=pfU0QORkRpY',
            type: 'STREAMING'
        },
        status: 'online'
    }).then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
});

client.on('message', msg => {
    handle(msg)
});

client.login(process.env.DISCORD_TOKEN);