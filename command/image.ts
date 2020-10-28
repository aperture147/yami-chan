import {Message, MessageEmbed} from "discord.js";
import {client} from "../mongo";
import validator from 'validator';
import {HelpInfo} from "./help";

const ObjectID = require('mongodb').ObjectID
const re = /[\s]+/
export const help: HelpInfo = {
    name: "Image",
    description: "Show images",
    commands: [
        {
            command: "t$image {image name | image ID}",
            alias: ["t$i"],
            description: "Get a specific image",
            examples: [
                "t$i yami",
                "t$i 5f97f7844b83e2000fe6102c"
            ]
        },
        {
            command: "t$addimage {image name} {image url} [image content]",
            alias: ["t$ai"],
            description: "Add an image",
            examples: ["t$af yami The quick brown fox jumps over a lazy dog"]
        },
        {
            command: "t$randomimage",
            alias: ["t$r"],
            description: "Get a random image",
        },
    ]
}

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
        if (result) {
            msg.channel.send(new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(result.name)
                .setDescription(result.content)
                .setImage(result.url)
                .setFooter(`Image ID: ${result._id}`)).then(() => msg.delete())
        } else msg.channel.send("No image found")
    })
        .catch(err => console.log(err))
}

export function add(msg: Message): void {
    const collection = client.db("yami").collection("images_" + msg.guild.id)
    const content = msg.content.split(re, 4)
    let contentUrl = content[2]
    if (!content[1]) {
        msg.channel.send("No image name provided")
        return
    }

    if (msg.attachments.size > 0) {
        const attachments = msg.attachments.array()[0]
        if (attachments.url) {
            contentUrl = attachments.url
        }
    }

    if (!contentUrl || !validator.isURL(contentUrl))
        msg.channel.send("No valid image Url found")
    collection.insertOne({
        "name": content[1],
        "url": contentUrl,
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