import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";
import {HelpInfo} from "./help";

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/

export const help: HelpInfo = {
    name: "Fact",
    description: "Show facts",
    commands: [
        {
            command: "t$fact {fact name | fact ID}",
            alias: ["t$f"],
            description: "Get a specific fact",
            examples: [
                "t$f chemgio",
                "t$f 5f97f7844b83e2000fe6102c"
            ]
        },
        {
            command: "t$addfact {fact name} {fact content}",
            alias: ["t$af"],
            description: "Add a fact",
            examples: ["t$af chemgio The quick brown fox jumps over a lazy dog"]
        },
        {
            command: "t$randomfact",
            alias: ["t$rf"],
            description: "Get a random fact",
        },
    ]
}


export function send(msg: Message): void {
    const collection = client.db("yami").collection("facts_" + msg.guild.id)
    const content = msg.content.split(re, 2)
    let promise
    // If the input is a mongo objectId
    if (ObjectID.isValid(content[1]))
        promise = collection.findOne({"_id": ObjectID.createFromHexString(content[1])})
    else
        promise = collection.findOne({"name": content[1]})
    promise.then(result => {
        if (result) {
            msg.channel.send(new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.content)
                .setFooter(`Fact ID: ${result._id}`)
            ).then(() => msg.delete())
        } else msg.channel.send("No fact found")
    })
        .catch(err => console.log(err))
}

export function add(msg: Message): void {
    const collection = client.db("yami").collection("facts_" + msg.guild.id)
    const content = msg.content.split(re, 3)
    if (!content[1]) {
        msg.channel.send("No fact name provided")
        return
    }
    if (!content[2]) {
        msg.channel.send("No fact content provided")
        return
    }
    collection.insertOne({
        "name": content[1],
        "content": msg.content.replace("t$af", "").replace(content[1], "").trim(),
        "author": msg.author.id
    })
        .then(result => msg.channel.send(`New fact added with id \`${result.insertedId}\``))
        .catch(err => {
            msg.channel.send(`Cannot add new fact`)
            console.error(err)
        });
}

export function random(msg: Message): void {
    const collection = client.db("yami").collection("facts_" + msg.guild.id)
    collection.aggregate([{"$sample": {"size": 1}}], (err, cursor) => {
        cursor.next().then(result => {
            msg.channel.send(new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.content)
                .setFooter(`Fact ID: ${result._id}`)
            ).then(() => msg.delete())
            cursor.close().catch(console.error)
        }).catch(console.error)
    })
}