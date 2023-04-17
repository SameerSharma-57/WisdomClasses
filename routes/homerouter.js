const express = require('express');
const Router = express.Router();
const homeschema = require('../models/homeschema')
const Quiz= require('../models/quiz')
const Article = require('../models/article')

Router.get('/ind',(req,res) =>{
    res.render('./main_pages/logreg.hbs',{title : "tarun raj singh", name: "jai ho", password: '', email: ''})
})
Router.get('',(req,res)=>{
    res.render('./main_pages/main.hbs',{title : "tarun raj singh", name: "jai ho", password: 'jaiho jaiho', email: ''})
})

Router.get('/faq',(req,res)=>{
    res.render('./extra_pages/FAQ_page')
})

Router.get('/contact',(req,res)=>{
    res.render('./extra_pages/Contact_us_page')
})
// Router.get('/admin',(req,res)=>{
//     res.render('./extra_pages/Admin_DashBoard')
// })
Router.get('/:slug',async(req,res)=>{
    if(req.params.slug!=''){
        // console.log(req.params.slug)
        
        
        const result=await homeschema.findOne({slug:req.params.slug})
        
        if(result){
            
            const quizes=await Quiz.find({Active:true,Started:true}).sort({createdAt: 'desc'})
            const articles=await Article.find().sort({createdAt:'desc'})

            const archived_quizes=await Quiz.find({Active:false})
            res.render('./main_pages/dashboard1',{name:result.name , result : result,quizes:quizes,archived_quizes:archived_quizes,articles:articles })
        }
    }
})

Router.get('/:slug/home',(req,res)=>{
    res.render('./main_pages/home.hbs',{slug:req.params.slug})
})

Router.get('/teacher/:slug',async(req,res)=>{
    if(req.params.slug!=''){
        // console.log(req.params.slug)
        
        
        const result=await homeschema.findOne({slug:req.params.slug})
        if(result){
            // const articles=await Article.find().sort({createdAt: 'desc'})
            const articles=await Article.find({$or:[{createdBy:result.name},{createdBy:"admin"}]})
             const quizes=await Quiz.find().sort({createdAt: 'desc'})

            res.render('./extra_pages/teacher_dashboard',{articles: articles , result : result,quizes:quizes})
        }
    }
})

Router.get('/teacher/:slug/home',async(req,res)=>{
    res.render('./main_pages/home_teacher.hbs',{slug:req.params.slug})
})

// Router.get('/teacher/dashboard_2/sameer/tarun/hehe',(req,res)=>{
//     res.render('./extra_pages/teacher_dashboard_2')
// })

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
                        res.redirect(`teacher/${result.slug}`)
                    }

                
                else if(role == result.role && role=='admin'){
                    res.redirect(`/admin/dashboard`)
                }
                else if (role == result.role && role == "student")
                    {
                        
                        // res.render('./main_pages/dashboard1',{name : result.name , result : result,quizes:quizes})
                        res.redirect(`/${result.slug}`)
                        // res.redirect("/")
                    }
                    else{
                        res.render('./main_pages/logreg.hbs',{title : "", name: "", password: `You are not a ${role}`, email: ''})

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
