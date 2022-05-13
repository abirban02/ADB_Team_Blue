const express = require('express')
const router = express.Router()
const Query = require('../models/query')


router.get('/', async(req, res) => {
    res.render("add_query") 
})

router.post('/', async(req,res) => {
    const query = new Query({
         
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    comment: req.body.comment

})

try{
    const q1 = await query.save()  
}catch(err){
    console.log("Error" + err);
}
}) 

router.get('/list', (req, res) => {

    Query.find((err, docs) => {
        if (!err) {
            res.render("list", {
                list: docs
            });
            

        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

//search by id
router.get('/view_Query/:id', (req, res) => {
    try{
        Query.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.render("view_Query", {
                    query: doc
                    
                })
            }
        })
        
    }catch(err){
        res.send('Error' + err)
    }
})

router.post('/view_Query/:id' , async (req, res) => {
    console.log(req.params.id)
    console.log(req.body.response)
    await Query.updateOne({ _id: req.params.id }, {
        response: req.body.response
      });
})


module.exports = router