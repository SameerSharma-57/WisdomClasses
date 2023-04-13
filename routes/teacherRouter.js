const express = require('express');
const Router2 = express.Router();
const queSchema = require('../models/queSchema')

Router2.get('/ind',(req,res) =>{
    res.render('./main_pages/dashboard2',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
    res.send('Router Teacher Active')
    console.log("Router act tea")

})
// Router2.get('/ind',(req,res)=>{
//     res.render('main',{title : "tarun raj singh", name: "jai ho", password: 'jaiho jaiho', email: ''})
// })



// QUESTION UPLOAD //


// Router2.post('/questionup',async(req,res)=>{
//     try{
//         const {
//             question,
//             op1,
//             op2,
//             op3,
//             op4,
//             ans
//         } = req.body;

//         const questdata = new queSchema({
//             question : question,
//             op1 : op1 ,
//             op2 : op2 ,
//             op3 : op3 ,
//             op4 : op4 ,
//             ans : ans
//         })
//         questdata.save(err=>{
//             if(err){
//                 console.log("error!!!")
//             }
//             else{
//                 res.render('dashboard2',{title : "", name: "", password: 'Saved Successfully', email: ''})
//             }
//         })    
//     }
//     catch(error){
//         res.render('dashboard2',{title : "error in code", name: "jai ho", password: '', email: ''})
//     }
// })


Router2.post('/questionup',async(req,res)=>{
    try{
        const {
            question,
            op1,
            op2,
            op3,
            op4,
            ans
        } = req.body;
        const questdata = new queSchema({
            question : question,
            op1 : op1 ,
            op2 : op2 ,
            op3 : op3 ,
            op4 : op4 ,
            ans : ans
        })
            const quest_init = await queSchema.findOne({question: question})
            if(question === quest_init.question)
            {
                res.render('./main_pages/dashboard2.hbs',{title : "", name: "", password: 'Question Already exists', email: ''})
            }
            else 
            {
                console.log("error")
            }
    }
    catch(error){

        const {
            question,
            op1,
            op2,
            op3,
            op4,
            ans
        } = req.body;

        const questdata = new queSchema({
            question : question,
            op1 : op1 ,
            op2 : op2 ,
            op3 : op3 ,
            op4 : op4 ,
            ans : ans
        })
        questdata.save(err=>{
            if(err){
                console.log("error!!!")
            }
            else{
                res.render('./main_pages/dashboard2.hbs',{title : "", name: "", password: 'Saved Successfully', email: ''})
            }
        })
    }
})


module.exports = Router2;