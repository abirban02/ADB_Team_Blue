const express = require('express');
const axios = require('axios');
const RedisClient = require('redis').createClient();
let i = 0;


const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
const client = new MongoClient(mongoURI);

// await client.connect();
// const db = client.db('car_tracking');
// const coll = db.collection('location');
// const locations = await coll.find().toArray();























// (()=>console.log('Hello World'))();
const app = express();
app.use(express.json());
app.use(express.static('www'));
async function fetchData() {
    const reply = await axios.get('http://api.open-notify.org/iss-now.json');
    const data = JSON.stringify(reply.data.iss_position);
    redisStore(data); 
}

async function mongoWriteData(data){
var lat = data.latitude;
var lon= data.longitude;
await client.connect();
const db = client.db('car_tracking');
const coll = db.collection('location');
const locations = await coll.insertOne({latitude:lat, longitude:lon});
}


async function redisStore(data) {
    await RedisClient.connect();
    await RedisClient.set(`pos${i}`, data);
    RedisClient.disconnect();
    console.log(`pos${i} Data written`);
    i++;
}

async function redisGet() {
    await RedisClient.connect();
    const reply = await RedisClient.get('pos0');
    const data = JSON.parse(reply);
    console.log(data);
    RedisClient.disconnect();
}
setInterval(fetchData, 1200);

app.get('/loc', async (req, res) => {
    await RedisClient.connect();
    const posStack = [];
    let len = 0;
    const response = await RedisClient.keys('*');
    len = response.length;
    for (let x = 0; x < response.length; x++) {
        const position = JSON.parse(await RedisClient.get(`pos${x}`));
        posStack.push(position)
    }
    const positionData = { startend: [{ lat: posStack[0].latitude, lon: posStack[0].longitude }, { lat: posStack[len - 1].latitude, lon: posStack[len - 1].longitude }] };
    res.json(positionData);
    RedisClient.disconnect();
}
)

// setTimeout(async()=>{await storeToMongo()},10000);
setTimeout(storeToMongo, 100000)

async function storeToMongo() {
    await RedisClient.connect();
    // const reply = await RedisClient.get('pos0');
    // const data = JSON.parse(reply);
    const posStack = [];
    const response = await RedisClient.keys('*');
        for (let x = 0; x < response.length; x++) {
            const position = JSON.parse(await RedisClient.get(`pos${x}`));
            console.log(`position${x} = lat: ${position.latitude}, long: ${position.longitude}`);
            posStack.push(position)
        }
        posStack.forEach((data)=>{
            mongoWriteData(data)
            console.log(data);
        })


  RedisClient.disconnect();
   
}


app.get('/pos', (req, res) => {
    getCurrentStatus();
    async function getCurrentStatus() {
        const posStack = [];
        await RedisClient.connect();
        const response = await RedisClient.keys('*');
        for (let x = 0; x < response.length; x++) {
            const position = JSON.parse(await RedisClient.get(`pos${x}`));
            console.log(`position${x} = lat: ${position.latitude}, long: ${position.longitude}`);
            posStack.push(position)
        }
        res.send(posStack);
        RedisClient.disconnect();
    }
});



app.listen(5000);