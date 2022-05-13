const express = require('express');
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/CarRentalService'

//test 
const PORT = process.env.PORT || 27017
const bodyparser = require("body-parser");
const path = require('path');
const app = express();

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log("Connected...")
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())



const queriesRouter = require('./routers/queries')
app.use('/queries', queriesRouter)

const carDetailsRouter = require('./routers/carDetails')
app.use('/carDetails', carDetailsRouter)

const homepageRouter = require('./routers/homepage')
app.use('/homepage', homepageRouter)


//set view engine
app.set("view engine", "ejs")
app.set('layout', 'layouts/index');
//app.set("views", path.resolve(__dirname, "views/query"))

//loading css
//app.use('/css', express.static(path.resolve(__dirname, "views/css")))

app.listen(3000, () => {
    console.log(`server started at http:localhost:${3000}`)
})

app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())


 