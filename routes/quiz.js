const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");
const homeschema = require("../models/homeschema");

module.exports = router;
router.get("/", (req, res) => {
  res.send("hi articles");
});

// router.get("teacher/:slug/new", (req, res) => {
//   const user = homeschema.findOne({ slug: req.params.slug });
//   res.render("extra_pages/teacher_quiz_db", {
//     article: new Quiz(),
//     result: user,
//   });
// });


router.get("/teacher/:te_slug/:slug", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  const user = await homeschema.findOne({ slug: req.params.te_slug });
  if (article == null) {
    res.redirect("/");
  }
  var quiz_status = "Start Quiz";
  if (article.Active == false) {
    quiz_status = "Unarchive";
  } else if (article.Started) {
    quiz_status = "End Quiz";
  }
  res.render("extra_pages/teacher_quiz_db", {
    articles: article.quizDB,
    slug: req.params.slug,
    te_slug: req.params.te_slug,
    name: user.name,
    quiz_name: article.title,
    quiz_status: quiz_status,
  });
});

router.get("/teacher/:te_slug/:slug/add", async (req, res) => {
  const article = await Quiz.findOne({ slug: req.params.slug });
  const user = await homeschema.findOne({ slug: req.params.te_slug });
  if (article == null) {
    res.redirect("/");
  }
  res.render("./extra_pages/add_quest", {
    article: article,
    te_slug: req.params.te_slug,
    slug: req.params.slug,
    name: user.name,
  });
});

router.get("/teacher/:te_slug/:slug/leaderboard",async(req,res)=>{
  const quiz=await Quiz.findOne({slug:req.params.slug})
  const student_scores=quiz.students_scores.sort(function(a,b){return b.score-a.score})
  const total_score=Number(quiz.quizDB.length)*4
  const teacher=await homeschema.findOne({slug:req.params.te_slug})
  res.render("./extra_pages/leaderboard",{total_score:total_score, student_scores:student_scores,name:quiz.title,teacher_name:teacher.name})
})

router.post("/teacher/:te_slug/:slug/add", async (req, res) => {
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
});

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

router.post("/teacher/:slug/new", async (req, res) => {
  const user=await homeschema.findOne({slug:req.params.slug})
  let article = new Quiz({
    title: req.body.title,
    description: req.body.description,
    markdown: req.body.markdown,
    createdBy: user.name
  });
  try {
    article = await article.save();
    res.redirect(`/teacher/${req.params.slug}`);
    {
      console.log("Saved");
    }
  } catch (e) {
    console.log(e);

    res.render("/", { article: article });
  }
});

router.delete("/:te_slug/:id", async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.redirect(`/teacher/${req.params.te_slug}`);
});

router.get("/:slug/:st_slug/attempt_quiz/:question_no", async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug });
  if (quiz.Active == true && quiz.Started == false) {
    console.log("quiz is not started yet");
    res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/not/started`);
  } 
  
  else if (quiz.Active == false) {
    console.log("quiz is archived");
    if (
      quiz.students_scores.some(
        element => element.student_slug == req.params.st_slug && element.attempted==0
      )
    ){
      console.log('calculating score')
      await store_score(req.params.slug,req.params.st_slug)
      res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/score`);
    }

    if(quiz.students_scores.some(element=>element.student_slug==req.params.st_slug))
    res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/score`);

    else{
      res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/not_attempted`)
    }
  } 
  
  else if (
    quiz.students_scores.some(
      element => element.student_slug == req.params.st_slug
    ) && (quiz.students_scores.find(
      (element) => element.student_slug == req.params.st_slug
    ).attempted == 1)
  ) {
    // if (
    //   quiz.students_scores.find(
    //     (element) => element.student_slug == req.params.st_slug
    //   ).attempted == 1
    // ) {
      console.log("You have attempted the quiz");
      res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/score`);
    // }
  // else {
  //   console.log("displaying question");
  //   let checked_ans="none";
  //   try{
  //     checked_ans=quiz.students_scores.find(element=>element.student_slug==req.params.st_slug).answers[req.params.question_no]
  //     console.log("checked_ans",checked_ans)
  //   }
  //   catch(e){
  //     console.log("checked_ans",e)
  //   }
  //   let isLastQuestion=0;
  //   if(req.params.question_no==quiz.quizDB.length-1){
  //     isLastQuestion=1;
  //   }
  //   if (req.params.question_no >= quiz.quizDB.length) {
  //     await store_score(req.params.slug, req.params.st_slug);
  //     res.redirect(`/${req.params.st_slug}`);
  //   } else {
  //     const ques = quiz.quizDB[req.params.question_no];
  //     // console.log(req.params.st_slug)
  //     res.render("./extra_pages/question_paper", {
  //       quiz_title: quiz.title,
  //       ques: ques,
  //       question_no: req.params.question_no,
  //       slug: req.params.slug,
  //       st_slug: req.params.st_slug,
  //       isLastQuestion: isLastQuestion
  //     });
  //   }
  // }
}

else {
  // console.log("displaying question");
  let checked_ans="none";
  try{
    checked_ans=quiz.students_scores.find(element=>element.student_slug==req.params.st_slug).answers[req.params.question_no]
    console.log("checked_ans",checked_ans)
  }
  catch(e){
    console.log("checked_ans",e)
  }
  let isLastQuestion=0;
    if(req.params.question_no==quiz.quizDB.length-1){
      isLastQuestion=1;
    }
  if (req.params.question_no >= quiz.quizDB.length) {
    await store_score(req.params.slug, req.params.st_slug);
    res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/score`);
  } else {
    const ques = quiz.quizDB[req.params.question_no];
    const student=await homeschema.findOne({slug:req.params.st_slug})
    // console.log(req.params.st_slug)
    res.render("./extra_pages/question_paper", {
      quiz_title: quiz.title,
      ques: ques,
      question_no: req.params.question_no,
      slug: req.params.slug,
      st_slug: req.params.st_slug,
      isLastQuestion: isLastQuestion,
      checked_ans:checked_ans,
      student_name:student.name
    });
  }
}
});

router.get("/:slug/attempt_quiz", async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug });
  res.render("attempt_quiz/show", { quizDB: quiz.quizDB });
});

router.post("/:slug/:st_slug/attempt_quiz/:question_no", async (req, res) => {
  console.log('storing answer')
  await store_answer(
    req.params.slug,
    req.params.st_slug,
    req.params.question_no,
    req.body.answer
  );

  if(req.body.vote=="next"){
    res.redirect(
    `/quiz/${req.params.slug}/${req.params.st_slug}/attempt_quiz/${
      Number(req.params.question_no) + 1
    }`
  );
  }
  else if(req.body.vote=="prev"){
    res.redirect(
    `/quiz/${req.params.slug}/${req.params.st_slug}/attempt_quiz/${
      Number(req.params.question_no) - 1
    }`
  );
  }
  else if(req.body.vote=="submit"){
    await store_score(req.params.slug, req.params.st_slug);
    res.redirect(`/quiz/${req.params.slug}/${req.params.st_slug}/score`);
  }
  // res.redirect(
  //   `/quiz/${req.params.slug}/${req.params.st_slug}/attempt_quiz/${
  //     Number(req.params.question_no) + 1
  //   }`
  // );
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
      correct:-1,
      incorrect:-1,
      not_attempted: -1,
    };
    try {
      await Quiz.findOneAndUpdate(
        { slug: slug },
        { $push: { students_scores: new_student_score } }
      );
      console.log('answer saved')
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
    console.log('answer saved')
  }
}

router.post("/:slug/:st_slug/submit_quiz", async (req, res) => {
  store_score(req.params.slug, req.params.st_slug);
  res.redirect(`/${req.params.st_slug}`);
});

async function calculate_score(answers, quizDB) {
  var score = 0;
  var correct = 0;
  var incorrect = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] == quizDB[i].correctAns) {
      score += 4;correct++;
    } else if (answers[i] != "0" && answers[i]!=null) {
      score -= 1;incorrect++;
    }
  }
  var skipped=quizDB.length-correct-incorrect;
  return [score,correct,incorrect,skipped];
}

async function store_score(slug, st_slug) {
  const quiz = await Quiz.findOne({ slug: slug });
  function check_student_slug(element) {
    return element.student_slug == st_slug;
  }

  var students_scores = quiz.students_scores;
  var student_index = students_scores.findIndex(check_student_slug);
  [students_scores[student_index].score,students_scores[student_index].correct,students_scores[student_index].incorrect,students_scores[student_index].not_attempted] = await calculate_score(
    students_scores[student_index].answers,
    quiz.quizDB
  );
  students_scores[student_index].attempted = 1;
  await Quiz.findOneAndUpdate(
    { slug: slug },
    { students_scores: students_scores }
  );
}

router.post("/teacher/:te_slug/:slug/start", async (req, res) => {
  console.log("entered");
  var quiz = await Quiz.findOne({ slug: req.params.slug });
  if (quiz.Active == true && quiz.Started == false) {
    await Quiz.findOneAndUpdate({ slug: req.params.slug }, { Started: true });
  } else if (quiz.Active == true) {
    await Quiz.findOneAndUpdate(
      { slug: req.params.slug },
      { Active: false, Started: false }
    );
  } else {
    await Quiz.findOneAndUpdate(
      { slug: req.params.slug },
      { Active: true, Started: false }
    );
    await Quiz.findOneAndUpdate(
      { slug: req.params.slug },
      { $unset: { students_scores: 1 } }
    );
  }
  res.redirect(`/quiz/teacher/${req.params.te_slug}/${req.params.slug}`);
});

router.get("/:slug/:st_slug/score",async(req,res)=>{
  const quiz=await Quiz.findOne({slug:req.params.slug})
  const student=await homeschema.findOne({slug:req.params.st_slug})
  const st_performance=quiz.students_scores.find(function(element){return element.student_slug==req.params.st_slug})
  var total_score=Number(quiz.quizDB.length)*4
  res.render("./extra_pages/Score_page",{score:st_performance.score,correct:st_performance.correct,incorrect:st_performance.incorrect,not_attempted:st_performance.not_attempted,
  total_score:total_score,
  st_slug:req.params.st_slug,
  name:student.name,
  quiz_name:quiz.title

  
  
  })
})

router.get("/:slug/:st_slug/not/started",(req,res)=>{
  res.render('./extra_pages/QUiz_status',{slug:req.params.slug,st_slug: req.params.st_slug})
})

router.delete("/teacher/:te_slug/:slug/:question_no",async(req,res)=>{
  var quizDB=await Quiz.findOne({slug:req.params.slug})
  quizDB=quizDB.quizDB
  quizDB.splice(Number(req.params.question_no),1)
  await Quiz.findOneAndUpdate({slug:req.params.slug},{quizDB:quizDB})
  res.redirect(`/quiz/teacher/${req.params.te_slug}/${req.params.slug}`)
})

router.get("/:slug/:st_slug/not_attempted",async(req,res)=>{
  student=await homeschema.findOne({slug:req.params.st_slug})
  res.render('./extra_pages/Quiz_status',{st_slug:req.params.st_slug,name:student.name})
})
module.exports = router;
