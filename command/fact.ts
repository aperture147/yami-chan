import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/

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
        let content
        if (result)
            content = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.content)
                .setFooter(`Fact ID: ${result._id}`)
        else content = "No fact found"
        msg.channel.send(content)
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
        "content": content[2],
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
                .setFooter(`Fact ID: ${result._id}`))
            cursor.close().catch(console.error)
        }).catch(console.error)
    })
}