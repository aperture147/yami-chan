import {Message} from "discord.js";
import "./mongo"
import * as fact from "./command/fact"
import * as copypasta from "./command/copypasta"
import * as image from "./command/image"
import {ping} from "./command/ping"

const re = /[\s]+/

export function handle(msg: Message): void {
    const cmd = msg.content.split(re, 1)[0].toLowerCase()
    switch (cmd) {
        case "$p":
        case "$ping":
            ping(msg)
            break

        case "$f":
        case "$fact":
            fact.send(msg)
            break

        case "$af":
        case "$addfact":
            fact.add(msg)
            break

        case "$rf":
        case "$randomfact":
            fact.random(msg)
            break

        case "$c":
        case "$copypasta":
            copypasta.send(msg)
            break

        case "$ac":
        case "$addcopypasta":
            copypasta.add(msg)
            break

        case "$rc":
        case "$randomcopypasta":
            copypasta.random(msg)
            break

        case "$i":
        case "$image":
            image.send(msg)
            break

        case "$ai":
        case "$addimage":
            image.add(msg)
            break

        case "$ri":
        case "randomimage":
            image.random(msg)
            break
    }
}