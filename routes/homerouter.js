const express = require('express');
const Router = express.Router();
const homeschema = require('../models/homeschema')
const Quiz= require('../models/quiz')

Router.get('',(req,res) =>{
    res.render('./main_pages/logreg.hbs',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
})
Router.get('/ind',(req,res)=>{
    res.render('./main_pages/main.hbs',{title : "tarun raj singh", name: "jai ho", password: 'jaiho jaiho', email: ''})
})

// Router.get('/download',(req,res)=>{
//     res.render('view')
// })
// REGISTRATION //


Router.post('/registeruser',async(req,res)=>{
    try{
        const {
            UserName,
            EmailId,
            password,
            cpassword
        } = req.body;

        if(password === cpassword){
            const Userdata = new homeschema({
                name: UserName,
                email: EmailId,
                password: password,
                role:"student"
            })
            // Userdata.save(err=>{
            //     if(err){
            //         console.log("error!!!")
            //     }
            //     else{
            //         res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Registered Successfully', email: ''})
            //     }
            // })
            const useremail = await homeschema.findOne({email: EmailId})
            if(useremail)
            {
                res.render('./main_pages/logreg.hbs',{title : "", name: "", password: '', email: 'Email Already Exists! try another!'})
            }
            else 
            {
                await Userdata.save()
                res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Registered Successfully', email: ''})
            }
        }
        else{
            res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'Password do not match', email: ''})
        }
    }
    catch(error){
        res.render('./main_pages/logreg.hbs',{title : "error in code", name: "jai ho", password: '', email: ''})
    }
})




//  SIGN IN // 

// Router.post('/login',(req,res)=>{
//     const {
//         EmailId,
//         UserName,
//         password,
//     } = req.body;
//     try{
//     homeschema.findOne({email:EmailId},(err,result)=>{
//         // console.log(result);
//         // if (err)    
//         //     {
//         //         res.render('logreg',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
//         //     }
//         if(EmailId === result.email && password === result.password)
//             {
//                 // console.log("success");
//                 res.render('dashboard1',{name : result.name})
//             }
//         else{
//             if(password != result.password)
//                 {
//                     res.render('logreg',{title : "", name: "", password: 'wrong password', email: ''})
//                 }
//             console.log(err);
//         }
//     })
//     }
//     catch(err){
//         res.render('logreg',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
//         console.log("error caught")
//     }
// })




Router.post('/login',async(req,res)=>{
    const quizes=await Quiz.find().sort({createdAt: 'desc'})
    const {
        EmailId,
        UserName,
        password,
        role,
    } = req.body;

    homeschema.findOne({email:EmailId})

    .then((result)=>{
        if(EmailId === result.email && password === result.password)
            {
                // console.log("success");
                if(role == result.role && role == "teacher")
                    {
                        res.redirect("/articles")
                    }
                else if (role == result.role && role == "student")
                    {
                        
                        res.render('./main_pages/dashboard1',{name : result.name , result : result,quizes:quizes})
                    }
            }
        else{
            if(password != result.password)
                {
                    res.render('./main_pages/logreg.hbs',{title : "", name: "", password: 'wrong password', email: ''})
                }
            console.log(err);
        }
    })
    .catch((err)=>{
        res.render('./main_pages/logreg.hbs',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
    })
    // ,(err,result)=>{
    //     // console.log(result);
    //     // if (err)    
    //     //     {
    //     //         res.render('logreg',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
    //     //     }
    //     if(EmailId === result.email && password === result.password)
    //         {
    //             // console.log("success");
    //             res.render('dashboard1',{name : result.name})
    //         }
    //     else{
    //         if(password != result.password)
    //             {
    //                 res.render('logreg',{title : "", name: "", password: 'wrong password', email: ''})
    //             }
    //         console.log(err);
    //     }
    // })
    // // catch(err){
    // //     res.render('logreg',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
    // //     console.log("error caught")
    // // }
})


module.exports = Router;