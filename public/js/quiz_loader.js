// header('Content-Type: text/javascript');


const quizDB =[
    {
        question:"Mark the Capital of India",
        a:"Jaipur",
        b:"Delhi",
        c:"Mumbai",
        d:"Chennai",
        ans:"option2"
    },
    {
        question:"Apple is a ?",
        a:"Fruit",
        b:"Vegetable",
        c:"animal",
        d:"Furniture",
        ans:"option1"
    },
    {
        question:"Mark the Capital of Uttar Pradesh",
        a:"Jaipur",
        b:"Delhi",
        c:"Mumbai",
        d:"Lucknow",
        ans:"option4"
    },
    {
        question:"Prime minister of India?",
        a:"Rahul Gandhi",
        b:"Arvind Kejriwal",
        c:"Narendra Modi",
        d:"Yogi Adityanath",
        ans:"option3"
    },
    {
        question:"Mark the Capital of Tamil Nadu",
        a:"Jaipur",
        b:"Delhi",
        c:"Mumbai",
        d:"Chennai",
        ans:"option4"
    }
]

const question = document.querySelector("#question");
const a = document.querySelector("#text1");
const b = document.querySelector("#text2");
const c = document.querySelector("#text3");
const d = document.querySelector("#text4");
// const submit = document.querySelector("#submit");
const submit = document.getElementById("submit");
const prev = document.querySelector("#prev");

const answers=document.querySelectorAll(".answer");
const showscore=document.querySelector("#showscore");
let question_count=0;
let score=0;

const deselectAll=()=>{
    answers.forEach(element=>{
        element.checked=false;
    })
}

const loadQuestion = ()=>{
    // console.log(a.innerHTML)
    deselectAll();
    question.innerHTML=quizDB[question_count].question;
    a.innerHTML=quizDB[question_count].a;
    b.innerHTML=quizDB[question_count].b;
    c.innerHTML=quizDB[question_count].c;
    d.innerHTML=quizDB[question_count].d;
    
}

const checkAnswer=()=>{
    let answer;
    answers.forEach(element => {
        if(element.checked){
            answer=element.id;
        }
    });
    return answer;
}

loadQuestion();


submit.addEventListener('click',()=>{
    const checkedAnswer=checkAnswer();
    // const page =  window.open('test.html');
    // document.getElementById('my').innerHTML='hello';
    // window.location.replace('test.html');

    // console.log(checkedAnswer)
    if(checkedAnswer == quizDB[question_count].ans){
        score+=4;
    }    

    //
    //
    else if(checkedAnswer != quizDB[question_count].ans && checkedAnswer!=null){
        score-=1;
        // console.log(checkedAnswer);
    }


    // console.log(checkedAnswer,quizDB[question_count].ans)
    question_count+=1;
    if(question_count<quizDB.length){
        loadQuestion();
    }
    else{
        // console.log(score);
        submit.innerHTML="Completed!!";
        showscore.innerHTML=`
        <h3> You scored ${score}/${quizDB.length*4}</h3>
        <button class="btn" onclick="location.reload()">Re-attempt</button>
        `
        showscore.classList.remove('scoreArea');
    

        
        

    }
    if(question_count==(quizDB.length-1)){
        submit.innerHTML='submit'
    }
    
})

// prev.addEventListener('click',()=>{
    
// })

