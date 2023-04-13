const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

module.exports = router;
router.get("/", (req, res) => {
  res.send("hi articles");
});

router.get("/new", (req, res) => {
  res.render("quizes/new", { article: new Quiz() });
});

router.get("/:slug", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  if (article == null) {
    res.redirect("/");
  }
  res.render("quizes/show", { article: article });
});

router.get("/:slug/add", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  if (article == null) {
    res.redirect("/");
  }
  res.render("question/new", { article: article });
});
// router.get('/')

router.post("/:slug/add", async (req, res) => {
  let ques = {
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    correctAns: req.body.correctAns,
  };
  {console.log(req.body.correctAns)}
  try {
    await Quiz.findOneAndUpdate({ slug: req.params.slug }, { $push: {quizDB: ques} });
    res.redirect(`/quiz/${req.params.slug}`)
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
  // console.log(checkAnswer())
});

router.post("/", async (req, res) => {
  
  let article = new Quiz({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    createdBy: req.body.CreatedBy,
  });
  try {
    article = await article.save();
    res.redirect('/');
    {
      console.log("Saved");
    }
  } catch (e) {
    console.log(e);

    res.render("quiz/new", { article: article });
  }
});

router.delete("/:id", async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

router.get("/:slug/attempt_quiz/:question_no",async (req,res) =>{
  const quiz=await Quiz.findOne({slug:req.params.slug})
  if(req.params.question_no>=quiz.quizDB.length){
    res.redirect("/")
  }
  else{

    const ques=quiz.quizDB[req.params.question_no]
    res.render("attempt_quiz/show",{ques:ques, question_no:req.params.question_no,slug:req.params.slug})
  }
})

router.get("/:slug/attempt_quiz",async(req,res)=>{
  const quiz=await Quiz.findOne({slug:req.params.slug})
  res.render("attempt_quiz/show",{quizDB:quiz.quizDB})
})




module.exports = router;
