const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://cgbd-user:RzRdiyFLDnFWwDXN@cluster0.c5whw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db('cgbd-db');
        const packagesCollection = database.collection('packages');

        //GET API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //POST API
        app.post('/packages', async (req, res) => {
            const package = req.body
            console.log("Hit from the api", package);
            const result = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server...');
});

app.listen(port, () => {
    console.log('Running server on port', port);
});