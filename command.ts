import {Message} from "discord.js";
import "./mongo"
import * as fact from "./command/fact"
import * as copypasta from "./command/copypasta"
import * as image from "./command/image"
import {ping} from "./command/ping"
import {sendHelp} from "./command/help";

const re = /[\s]+/

export function handle(msg: Message): void {
    const cmd = msg.content.split(re, 1)[0].toLowerCase()
    switch (cmd) {
        case "t$p":
        case "t$ping":
            ping(msg)
            break

        case "t$f":
        case "t$fact":
            fact.send(msg)
            break

        case "t$af":
        case "t$addfact":
            fact.add(msg)
            break

        case "t$rf":
        case "t$randomfact":
            fact.random(msg)
            break

        case "t$c":
        case "t$copypasta":
            copypasta.send(msg)
            break

        case "t$ac":
        case "t$addcopypasta":
            copypasta.add(msg)
            break

        case "t$rc":
        case "t$randomcopypasta":
            copypasta.random(msg)
            break

        case "t$i":
        case "t$image":
            image.send(msg)
            break

        case "t$ai":
        case "t$addimage":
            image.add(msg)
            break

        case "t$ri":
        case "t$randomimage":
            image.random(msg)
            break

        case "t$help":
        case "t$h":
            sendHelp(msg)
            break
    }
}