import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";

export function ping(msg: Message): void {
    const now = Date.now()
    const discordLatency = Date.now() - msg.createdTimestamp
    client.db("yami").admin().ping().then(() => {
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor(0xff0000)
            .setDescription(
                `🗿: \`${discordLatency}ms\`\n` +
                `🗄: \`${Date.now() - now}ms\``)
        msg.channel.send(embed).then(() => msg.delete())
    }).catch(err => {
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor(0xff0000)
            .setDescription(
                `🗿: \`${discordLatency}ms\`\n` +
                `🗄: \`${err}\``)
        msg.channel.send(embed).then(() => msg.delete())
    })

}