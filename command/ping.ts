import {Message, MessageEmbed} from "discord.js";

export function ping(msg: Message): void {
    const sentTs = msg.createdTimestamp
    const now = Date.now()

    const embed = new MessageEmbed()
        .setTitle("Pong!")
        .setColor(0xff0000)
        .setDescription(`Latency: \`${now - sentTs}ms\``)
    msg.channel.send(embed)
}