const neo4j = require('neo4j-driver');
const { request } = require('express');
const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = '123';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static("www"));
app.listen(3000);
const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoURI);

app.post('/con', async (req, res) => {
    let final=[];
    let cust = [];
    let carColor = req.body.color;
    console.log(req.body);
    async function fetchDates(req) {
        
        let suspectedTrips=[];
        let userLat = req.body.lat;
        let userLon = req.body.lon;

        let userDate = new Date(req.body.date);
        // console.log(userLat,userLon,userDate)
        await client.connect();
        const db = client.db('CarRental');
        const coll = db.collection('TripsNew');
        const allTrips = await coll.find().toArray();
        allTrips.forEach(async (trip) => {
            const tripStart = new Date(trip.trip_startDate);
            const tripEnd = new Date(trip.trip_endDate);
            if (userDate >= tripStart && userDate <= tripEnd){
                suspectedTrips.push(trip);
               // console.log('suspectedTrips');
            }
            
        })

        for(let i=0;i<suspectedTrips.length;i++){
            let path = suspectedTrips[i].path;
            let suspectedCar = false;
            let tripi = suspectedTrips[i];
            for(let i=0; i< path.length; i++){
                let lat = path[i].latitude;
                let lon = path[i].longitude;
               // console.log(suspectedCar);
                const session = driver.session();
                await session.run('MATCH (p) DELETE (p)');
                const create = await session.run(`CREATE(P:path{lat:${lat}, lon:${lon}}) return P`);
                const reply = await session.run(`MATCH (P:path)
                WITH point({latitude:P.lat, longitude:P.lon}) as P1, point({latitude:toFloat(${userLat}),longitude:toFloat(${userLon})}) as P2
                return point.distance(P1, P2)/1000`);
                reply.records.forEach(async record=>{
                    if(record._fields[0]<=2000){
                        suspectedCar = true;
                        
                    }
                })
                if (suspectedCar===true){
                    if(final.indexOf(tripi.car_id)===-1){
                        let cust_id = tripi.cust_id;
                        final.push(tripi.car_id);
                        cust.push(tripi.customer_ID);
                    }
                }

            }
        }

        // console.log(final);
        return true;
    }
    await fetchDates(req);
    console.log(final);
    let data = [];
    const db = client.db('CarRental');
    const carColl = db.collection('Cars');
    const custColl = db.collection('Customers');
    for(let i=0;i<final.length;i++){
        const car_id = final[i];
        const cust_id = cust[i];
        
        if (carColor==''){
        const customer = await custColl.findOne({id:cust_id});
        const car_dets = await carColl.findOne({id:car_id});
        data.push(await car_dets) ;
        data.push(await customer);
    }
    else{
        const car_dets = await carColl.findOne({id:car_id,color:carColor});
        const customer = await custColl.findOne({id:cust_id});
        console.log(car_dets);
        if(car_dets!=null){
        data.push(await car_dets) ;
        data.push(await customer);
        } 
    }
        
    }
    res.send(data);
})