const express = require('express')
const mongoose = require('mongoose')
const hbs = require('hbs')
const app=express()
const articleRouter=require('./routes/articles')
const override=require('method-override')
const path  = require('path')
const quizRouter=require('./routes/quiz')
const adminRouter=require('./routes/adminRouter')
const homeRouter=require('./routes/homerouter')
const teacherRouter=require('./routes/teacherRouter')
const bodyParser = require('body-parser');
// mongoose.connect(
//   `mongodb+srv://sharma131:Sa57mongodb@cluster0.9mwoj04.mongodb.net/?retryWrites=true&w=majority`, 
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://sharma131:Sa57mongodb@cluster0.wzw2ndq.mongodb.net/?retryWrites=true&w=majority`,{
    useNewUrlParser: true, useUnifiedTopology: true
  })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))
app.use(override('_method'))
app.use('/articles',articleRouter)
app.use('/quiz',quizRouter)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/' , homeRouter);   
app.use('/admin',adminRouter)
// Use the page where we want to use the router , default i m using at index 
// app.use('/', teacherRouter);


app.use(express.static('public'));

// app.get('/',async (req,res)=>{
//     // const articles=[
//     //     {
//     //         title: 'Test article',
//     //         createdAt: new Date(),
//     //         description: 'test descp'
//     //     },
//     //     {
//     //         title: 'Test article 2',
//     //         createdAt: new Date(),
//     //         description: 'test descp 2'
//     //     }
//     // ]
//     const articles=await Article.find().sort({createdAt: 'desc'})
//     const quizes=await Quiz.find().sort({createdAt: 'desc'})
//     res.render('articles/index',{articles: articles,quizes:quizes})
// })




app.listen(3030)