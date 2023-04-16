const express = require('express');
const Router = express.Router();
const homeschema = require('../models/homeschema')
const Article=require('../models/article')

Router.get('/dashboard',async(req,res) =>{
    const articles=await Article.find().sort({createdAt: 'desc'})
    res.render('./extra_pages/Admin_DashBoard',{articles:articles})

})
Router.get('/createTeacher',(req,res)=>{
    res.render('./extra_pages/create_teacher_account',{popup:""})
})

Router.post('/registerteacher',async(req,res)=>{
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
                role:"teacher"
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
                res.render('./extra_pages/create_teacher_account',{popup: 'Email Already Exists! try another!'})
            }
            else 
            {
                await Userdata.save()
                res.render('./extra_pages/create_teacher_account',{popup: 'Registered Successfully'})
            }
        }
        else{
            res.render('./extra_pages/create_teacher_account',{popup: 'Password do not match'})
        }
    }
    catch(error){
        res.render('./extra_pages/create_teacher_account',{popup: 'error in code'})
        console.log(error)
    }
})

Router.get('/admin_home',(req,res)=>{
    res.render('./main_pages/home_admin.hbs')
})

Router.get('/new_announcement',(req,res)=>{
    res.render('./extra_pages/new_announcement_admin')
})

Router.post('/new_announcement',async(req,res)=>{
    // const poster=await homeschema.findOne({slug:req.params.slug})
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: "admin"

    })
    // article=await article.save()
    // res.redirect('/teacher/:slug')
    try{
        article=await article.save()
        res.redirect(`/admin/dashboard`)
        {console.log('Saved')}
    }
    catch(e){
        console.log(e)
        res.render('/',{article: article})
    }
})

module.exports = Router;