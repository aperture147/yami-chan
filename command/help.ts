import {Message, MessageEmbed} from "discord.js";
import {help as copypastaHelp} from "./copypasta"
import {help as factHelp} from "./fact"
import {help as imageHelp} from "./image"
import {help as pingHelp} from "./ping"

const re = /[\s]+/

export interface HelpInfo {
    name: string,
    description: string,
    commands: HelpCommandInfo[],
}

interface HelpCommandInfo {
    command: string,
    alias?: string[],
    description: string,
    examples?: string[]
}

const info: { [id: string]: HelpInfo } = {
    help: {
        name: "Help",
        description: "Show help of commands",
        commands: [
            {
                command: "t$help {command}",
                alias: ["t$h"],
                description: "Get help of a specific commands (case insensitive)",
                examples: [
                    "t$h copypasta",
                    "t$c Copypasta"
                ]
            }
        ]
    },
    copypasta: copypastaHelp,
    fact: factHelp,
    image: imageHelp,
    ping: pingHelp,
}

export function sendHelp(msg: Message) {
    const content = msg.content.split(re, 2)

    if (content[1]) {
        if (content[1] in info) {
            const helpInfo: HelpInfo = info[content[1]]
            const msgContent = new MessageEmbed()
                .setTitle(helpInfo.name)
                .setDescription(helpInfo.description)
            for (const command in helpInfo.commands) {
                const cmdInfo: HelpCommandInfo = helpInfo.commands[command]
                let value =
                    `***Command:*** \`${cmdInfo.command}\`\n` +
                    `***Alias:*** \`${cmdInfo.alias}\n\``

                if (cmdInfo.examples) {
                    value += `***Example:***\n`
                    for (const i in cmdInfo.examples)
                        value += `\`${cmdInfo.examples[i]}\`\n`
                }

                msgContent.addField(cmdInfo.description, value)
            }
            msg.channel.send(msgContent).then(() => msg.delete())
        } else msg.channel.send(`Command \`${content[1]}\` not existed`)
    } else {
        const msgContent = new MessageEmbed()
            .setTitle("Help")
            .setDescription("Available commands (use `t$help {command (case insensitive)}` to show):")

        for (const command in info) {
            msgContent.addField(info[command].name, info[command].description)
        }
        msg.channel.send(msgContent).then(() => msg.delete())
    }
}