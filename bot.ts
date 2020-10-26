import {Client} from "discord.js";

const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

});

client.login('NzY5MDk4NDk0Njg1MjE2Nzg5.X5KEyg.08jKSX86dGkfeh1mS5VaunHbO1c');