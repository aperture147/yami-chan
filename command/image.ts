import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";
import validator from 'validator';

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/

export function send(msg: Message): void {
    const collection = client.db("yami").collection("images_" + msg.guild.id)
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
                .setImage(result.url)
                .setFooter(`Image ID: ${result._id}`)
        else content = "No image found"
        msg.channel.send(content).then(() => msg.delete())

    })
        .catch(err => console.log(err))
}

export function add(msg: Message): void {
    const collection = client.db("yami").collection("images_" + msg.guild.id)
    const content = msg.content.split(re, 4)
    if (!content[1]) {
        msg.channel.send("No image name provided")
        return
    }
    if (!content[3]) {
        msg.channel.send("No image content provided")
        return
    }
    if (!!content[2] && validator.isURL(content[2])) {
        collection.insertOne({
            "name": content[1],
            "url": content[2],
            "content": msg.content
                .replace("t$ai", "")
                .replace(content[1], "")
                .replace(content[2], "")
                .trim(),
            "author": msg.author.id
        })
            .then(result => msg.channel.send(`New image added with id \`${result.insertedId}\``))
            .catch(err => {
                msg.channel.send("Cannot add new image")
                console.error(err)
            });
    } else msg.channel.send("No valid image Url found")
}

export function random(msg: Message): void {
    const collection = client.db("yami").collection("images_" + msg.guild.id)
    collection.aggregate([{"$sample": {"size": 1}}], (err, cursor) => {
        cursor.next().then(result => {
            msg.channel.send(new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.name)
                .setDescription(result.content)
                .setImage(result.url)
                .setFooter(`Image ID: ${result._id}`)
            ).then(() => msg.delete())
            cursor.close().catch(console.error)
        }).catch(console.error)
    })
}