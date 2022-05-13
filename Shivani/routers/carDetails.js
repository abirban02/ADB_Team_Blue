const express = require('express')
const router = express.Router()
const CarDetails = require('../models/carDetail')
//const Sequelize = require('sequelize')
const csvtojson = require('csvtojson')
//const op = Sequelize.Op;

var https = require('https');
var fs = require('fs');

router.get('/', async (req, res) => {

    var viewTitle = "Enter your Query"
    res.render("carDetails", {
        viewTitle : viewTitle
    })

})

//search price
router.get('/view_Price', (req, res) => {
    const { term } = req.query;
    const { term2 } = req.query;
    const { term3 } = req.query;

   CarDetails.find({'Full car name': term, 'Generation':term2, 'Model series':term3}, function(err, docs){
        if(err){
            console.log(err);
        }else{  
           res.render("view_Price", {
                view_Price : docs, 
            }); 
        } 
    })
}) 

router.post('/update', async (req, res) => {
    console.log("Hi")
  
// URL of the database
const url = 'https://www.teoalida.com/cardatabase/samples/German-Car-Database-by-Teoalida-full-specs-SAMPLE.csv';
  
    https.get(url,(res) => {
    const path = `${__dirname}/German-Car-Database-by-Teoalida-full-specs-SAMPLE.csv`; 
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
        console.log('Download Completed'); 
    })
})
//Adding values into the database
    csvtojson()
        .fromFile("German-Car-Database-by-Teoalida-full-specs-SAMPLE.csv") 
        .then(csvData => {
           
            CarDetails.insertMany(csvData).then(function () {
                console.log("Data Inserted!");
                res.json({success: 'Data Updated Successfully!' });
                
            }).catch(function(err){
                console.log(err);
            })
        })
})




module.exports = router