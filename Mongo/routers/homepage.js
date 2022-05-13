const express = require('express')
const router = express.Router()
//const Query = require('../models/query')

router.get('/', async(req, res) => {
    var viewTitle = "Car Rental Service"
    res.render("homepage", {
        viewTitle : viewTitle
    }); 
})

module.exports = router