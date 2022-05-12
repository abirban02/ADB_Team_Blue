const express = require('express');
const axios = require('axios');
const RedisClient = require('redis').createClient();
const mongoose = require('mongoose');
const Location = require("./models/location")

let i = 0;
// (()=>console.log('Hello World'))();
const app = express();
const DBurl = 'mongodb+srv://thanamibk:nfsprostreet1@telemetry.pdcud.mongodb.net/Location_tracking?retryWrites=true&w=majority';
mongoose.connect(DBurl,{useNewURLParser:true, useUnifiedTopology:true})
.then(function(result){console.log('connected to DB')})
.catch(function(err){
    console.log(err)
})

// async function getData(){
//     const reply = await axios.get('http://api.open-notify.org/iss-now.json');
//     const data = JSON.stringify(reply.data);
//   return data;
// }

app.get('/emitLocation',function(req,res){
      


})
















// app.use(express.json());
// app.use(express.static('www'));
// async function fetchData() {
//     const reply = await axios.get('https://ap-south-1.aws.data.mongodb-api.com/app/locationemitter-edgtz/endpoint/locationEmitterAPI');
//     const data = JSON.stringify(reply);
//     console.log(reply)
//     // redisStore(data);
// }

// async function redisStore(data) {
//     await RedisClient.connect();
//     await RedisClient.set(`pos${i}`, data);
//     RedisClient.disconnect();
//     console.log('Data written');
//     i++;
// }

// async function redisGet() {
//     await RedisClient.connect();
//     const reply = await RedisClient.get('pos0');
//     const data = JSON.parse(reply);
//     console.log(data);
//     RedisClient.disconnect();
// }
// setInterval(fetchData, 2000);

// app.get('/loc', async (req, res) => {
//     await RedisClient.connect();
//     const posStack = [];
//     let len = 0;
//     const response = await RedisClient.keys('*');
//     len = response.length;
//     for (let x = 0; x < response.length; x++) {
//         const position = JSON.parse(await RedisClient.get(`pos${x}`));
//         posStack.push(position)
//     }
//     const positionData = { startend: [{ lat: posStack[0].latitude, lon: posStack[0].longitude }, { lat: posStack[len - 1].latitude, lon: posStack[len - 1].longitude }] };
//     res.json(positionData);
//     RedisClient.disconnect();
// }
// )

// app.get('/pos', (req, res) => {
//     getCurrentStatus();
//     async function getCurrentStatus() {
//         const posStack = [];
//         await RedisClient.connect();
//         const response = await RedisClient.keys('*');
//         for (let x = 0; x < response.length; x++) {
//             const position = JSON.parse(await RedisClient.get(`pos${x}`));
//             console.log(`position${x} = lat: ${position.latitude}, long: ${position.longitude}`);
//             posStack.push(position)
//         }
//         res.send(posStack);
//         RedisClient.disconnect();
//     }
// });



app.listen(3000);


















var fs = require('fs');
var Promise = require("bluebird");
var location = require('./models/loc');

Promise.promisifyAll(fs);

// read file
fs.readFileAsync('latlong.json', 'utf8')
.then(function (resolve, reject) {
    var locs = JSON.parse(resolve);

    locs.forEach(function(loc){
        // first entries have no date
            var newLoc= new location(loc);
            newLoc.longitude = loc.latitude;
            newLoc.latitude = loc.longitude;
            
            // console.log(newShow);
            newLoc.save(function(err, s){
                console.log(s);

            });

        

    });

});