const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const homeschema = require("../models/homeschema");

module.exports = router;
router.get("/", (req, res) => {
  res.send("hi articles");
});

router.get("teacher/:slug/new", (req, res) => {
  const user = homeschema.findOne({ slug: req.params.slug });
  res.render("extra_pages/teacher_quiz_db", {
    article: new Quiz(),
    result: user,
  });
});

router.get("/teacher/:te_slug/:slug", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  const user = await homeschema.findOne({slug: req.params.te_slug})
  if (article == null) {
    res.redirect("/");
  }
  var quiz_status="Start Quiz"
  if(article.Active==false){
    quiz_status="Archived"
  }
  else if(article.Started){
    quiz_status="End Quiz"
  }
  res.render("extra_pages/teacher_quiz_db", { articles: article.quizDB ,slug: req.params.slug,te_slug:req.params.te_slug ,name:user.name,quiz_name:article.title,quiz_status: quiz_status});
});

router.get("/teacher/:te_slug/:slug/add", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  const user = await homeschema.findOne({slug: req.params.te_slug})
  if (article == null) {
    res.redirect("/");
  }
  res.render("./extra_pages/add_quest", { article: article,te_slug: req.params.te_slug,slug: req.params.slug,name: user.name });
});

router.post('/teacher/:te_slug/:slug/add',async(req,res)=>{
  let ques = {
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    correctAns: req.body.correctAns,
  };
  {
    console.log(req.body.correctAns);
  }
  try {
    await Quiz.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { quizDB: ques } }
    );
    res.redirect(`/quiz/teacher/${req.params.te_slug}/${req.params.slug}`);
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
})

// router.get("/:slug/add", async (req, res) => {
//   const article = await Quiz.findOne({ slug: req.params.slug });
//   if (article == null) {
//     res.redirect("/articles");
//   }
//   res.render("question/new", { article: article });
// });
// router.get('/')

// router.post("/:slug/add", async (req, res) => {
//   let ques = {
//     question: req.body.question,
//     option1: req.body.option1,
//     option2: req.body.option2,
//     option3: req.body.option3,
//     option4: req.body.option4,
//     correctAns: req.body.correctAns,
//   };
//   {
//     console.log(req.body.correctAns);
//   }
//   try {
//     await Quiz.findOneAndUpdate(
//       { slug: req.params.slug },
//       { $push: { quizDB: ques } }
//     );
//     res.redirect(`/quiz/${req.params.slug}`);
//   } catch (e) {
//     console.log(e);
//     res.redirect("/");
//   }
  // console.log(checkAnswer())
// });

// router.post("/", async (req, res) => {
//   let article = new Quiz({
//     title: req.body.title,
//     description: req.body.description,
//     markdown: req.body.markdown,
//     createdBy: req.body.CreatedBy,
//   });
//   try {
//     article = await article.save();
//     res.redirect("/");
//     {
//       console.log("Saved");
//     }
//   } catch (e) {
//     console.log(e);

//     res.render("quiz/new", { article: article });
//   }
// });

router.delete("/:id", async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.redirect("/articles");
});

router.get("/:slug/:st_slug/attempt_quiz/:question_no", async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug });
  if (req.params.question_no >= quiz.quizDB.length) {
    store_score(req.params.slug, req.params.st_slug);
    res.redirect(`/${req.params.st_slug}`);
  } else {
    const ques = quiz.quizDB[req.params.question_no];
    // console.log(req.params.st_slug)
    res.render("attempt_quiz/show", {
      ques: ques,
      question_no: req.params.question_no,
      slug: req.params.slug,
      st_slug: req.params.st_slug,
    });
  }
});

router.get("/:slug/attempt_quiz", async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug });
  res.render("attempt_quiz/show", { quizDB: quiz.quizDB });
});

router.post("/:slug/:st_slug/attempt_quiz/:question_no", async (req, res) => {
  store_answer(
    req.params.slug,
    req.params.st_slug,
    req.params.question_no,
    req.body.answer
  );
  res.redirect(
    `/quiz/${req.params.slug}/${req.params.st_slug}/attempt_quiz/${
      Number(req.params.question_no) + 1
    }`
  );
});

async function store_answer(slug, st_slug, question_no, checked_answer) {
  const quiz = await Quiz.findOne({ slug: slug });
  function check_student_slug(element) {
    return element.student_slug == st_slug;
  }

  var students_scores = quiz.students_scores;
  var student_index = students_scores.findIndex(check_student_slug);

  if (student_index == -1) {
    var answer_arr = new Array(quiz.quizDB.length).fill(0);
    answer_arr[0] = checked_answer;
    const new_student_score = {
      student_slug: st_slug,
      answers: answer_arr,
      attempted: 0,
      score: 0,
    };
    try {
      await Quiz.findOneAndUpdate(
        { slug: slug },
        { $push: { students_scores: new_student_score } }
      );
    } catch (e) {
      console.log(e);
    }
  }
  // console.log(student_index)
  else {
    students_scores[student_index].answers[question_no] = checked_answer;

    // answer_arr[req.params.question_no]=req.body.answer
    await Quiz.findOneAndUpdate(
      { slug: slug },
      { students_scores: students_scores }
    );
  }
}

router.post("/:slug/:st_slug/submit_quiz", async (req, res) => {
  store_score(req.params.slug, req.params.st_slug);
  res.redirect(`/${req.params.st_slug}`);
});

function calculate_score(answers, quizDB) {
  var score = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] == quizDB[i].correctAns) {
      score += 4;
    } else if (answers[i] != "0") {
      score -= 1;
    }
  }
  return score;
}

async function store_score(slug, st_slug) {
  const quiz = await Quiz.findOne({ slug: slug });
  function check_student_slug(element) {
    return element.student_slug == st_slug;
  }

  var students_scores = quiz.students_scores;
  var student_index = students_scores.findIndex(check_student_slug);
  students_scores[student_index].score = calculate_score(
    students_scores[student_index].answers,
    quiz.quizDB
  );
  students_scores[student_index].attempted = 1;
  await Quiz.findOneAndUpdate(
    { slug: slug },
    { students_scores: students_scores }
  );
}

router.post("/teacher/:te_slug/:slug/start",async(req,res)=>{
  var quiz= await Quiz.findOne({slug:req.params.slug})
  if(quiz.Active==true && quiz.Started==false){
    quiz.Started=true
  }
  else if(quiz.Active==true){
    quiz.Started=false
    quiz.Active=false
  }
  res.redirect(`/teacher/${req.params.te_slug}/${req.params.slug}`)
})
module.exports = router;
