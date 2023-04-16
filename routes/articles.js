const express = require('express')
const router= express.Router()
const Article = require('./../models/article')
const homeschema = require('../models/homeschema')

const Quiz=require('./../models/quiz')

module.exports=router
router.get('/',async(req,res)=>{
    const articles=await Article.find().sort({createdAt: 'desc'})
    const quizes=await Quiz.find().sort({createdAt: 'desc'})
    res.render('articles/index',{articles: articles,quizes:quizes})
})

router.get('/:slug/new',async(req,res)=>{
    const user=await homeschema.findOne({slug:req.params.slug})
    res.render('./extra_pages/new_announcement',{article: new Article(),result:user})
})

// router.get('/:slug',async(req,res)=>{
//     if(req.params.slug!=''){
//         // console.log(req.params.slug)
//         const quizes=await Quiz.find().sort({createdAt: 'desc'})
        
//         const result=await homeschema.findOne({slug:req.params.slug})
//         if(result){

//             res.render('./extra_pages/teacher_dashboard',{name : result.name , result : result,quizes:quizes})
//         }
//     }
// })

// router.get('/')

router.post('/:slug/new_announcement',async (req,res)=>{
    const poster=await homeschema.findOne({slug:req.params.slug})
    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: poster.name

    })
    // article=await article.save()
    // res.redirect('/teacher/:slug')
    try{
        article=await article.save()
        res.redirect(`/teacher/${req.params.slug}`)
        {console.log('Saved')}
    }
    catch(e){
        console.log(e)
        res.render('articles/new',{article: article})
    }
})


router.delete('/:id',async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/articles')
})  
module.exports=router