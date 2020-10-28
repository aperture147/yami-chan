import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";
import {HelpInfo} from "./help";

export const help: HelpInfo = {
    name: "Ping",
    description: "Display ping info",
    commands: [
        {
            command: "t$ping",
            alias: ["t$p"],
            description: "Get ping information from server",
        }
    ]
}

export function ping(msg: Message): void {
    const now = Date.now()
    const discordLatency = Date.now() - msg.createdTimestamp
    client.db("yami").admin().ping().then(() => {
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor(0xff0000)
            .setDescription(
                `Discord: \`${discordLatency}ms\`\n` +
                `Database: \`${Date.now() - now}ms\``)
        msg.channel.send(embed).then(() => msg.delete())
    }).catch(err => {
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor(0xff0000)
            .setDescription(
                `Discord: \`${discordLatency}ms\`\n` +
                `Database: \`${err}\``)
        msg.channel.send(embed).then(() => msg.delete())
    })

}