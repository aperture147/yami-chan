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
    const now: number = Date.now()
    const discordLatency: number = Math.abs(Date.now() - msg.createdTimestamp)
    client.db("yami").admin().ping().then(() => {
        const embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor(0xff0000)
            .setDescription(
                `Discord: \`${discordLatency}ms\`\n` +
                `Database: \`${Math.abs(Date.now() - now)}ms\``)
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