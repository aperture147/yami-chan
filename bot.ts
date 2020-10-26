import {Client} from "discord.js";
import {handle} from "./command";

const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    handle(msg)
});

client.login(process.env.DISCORD_TOKEN);