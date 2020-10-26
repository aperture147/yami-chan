const MongoClient = require('mongodb').MongoClient;
export const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {
    if (err) console.log("Cannot connect to Mongo, some function might not be available")
    else console.log("Connected to Mongo")
});