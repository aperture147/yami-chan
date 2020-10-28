import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";
import {HelpInfo} from "./help";

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/
export const help: HelpInfo = {
    name: "Copypasta",
    description: "Show copypasta saved from members",
    commands: [
        {
            command: "t$copypasta {copypasta name | copypasta ID}",
            alias: ["t$c"],
            description: "Get a specific copypasta",
            examples: [
                "t$c yami",
                "t$c 5f97f7844b83e2000fe6102c"
            ]
        },
        {
            command: "t$addcopypasta {copypasta name} {copypasta content}",
            alias: ["t$ac"],
            description: "Add a copypasta",
            examples: ["t$ac khuyen Xin chào bạn, tôi là nhà tuyển dụng của tập đoàn giải trí Rạp xiếc Trung Ưng Group..."]
        },
        {
            command: "t$randomcopypasta",
            alias: ["t$rc"],
            description: "Get a random copypasta",
        },
    ]
}

export function send(msg: Message): void {
    const collection = client.db("yami").collection("copypasta_" + msg.guild.id)
    const content = msg.content.split(re, 2)
    let promise
    // If the input is a mongo objectId
    if (ObjectID.isValid(content[1]))
        promise = collection.findOne({"_id": ObjectID.createFromHexString(content[1])})
    else
        promise = collection.findOne({"name": content[1]})
    promise.then(result => {
        let content
        if (result)
            content = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.name)
                .setDescription(result.content)
                .setFooter(`Copypasta ID: ${result._id}`)
        else content = "No copypasta found"
        msg.channel.send(content).then(() => msg.delete())
    })
        .catch(err => console.log(err))
}

export function add(msg: Message): void {
    const collection = client.db("yami").collection("copypasta_" + msg.guild.id)
    const content = msg.content.split(re, 3)
    if (!content[1]) {
        msg.channel.send("No copypasta name provided")
        return
    }
    if (!content[2]) {
        msg.channel.send("No copypasta content provided")
        return
    }
    collection.updateOne(
        {"name": content[1]},
        {
            $set: {
                "content": msg.content.replace("t$ac", "").replace(content[1], "").trim(),
                "author": msg.author.id
            }
        },
        {upsert: true})
        .then(result => {
            if (result.upsertedId)
                msg.channel.send(`New copypasta added with id \`${result.upsertedId._id}\``)
            else msg.channel.send(`\`${content[1]}\` copypasta has been updated`)
        })
        .catch(err => {
            msg.channel.send(`Cannot add new copypasta`)
            console.error(err)
        });
}

export function random(msg: Message): void {
    const collection = client.db("yami").collection("copypasta_" + msg.guild.id)
    collection.aggregate([{"$sample": {"size": 1}}], (err, cursor) => {
        cursor.next().then(result => {
            msg.channel.send(new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.name)
                .setDescription(result.content)
                .setFooter(`Copypasta ID: ${result._id}`)
            ).then(() => msg.delete())
            cursor.close().catch(console.error)
        }).catch(console.error)
    })
}