
const mongoose=require('mongoose')
const marked=require('marked')
const slugify=require('slugify')
const quizSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true

    },
    description: {
        type: String
    },
    Active: {
        type:Boolean
    },
    Started: {
        type:Boolean
    },
    markdown:{
        type: String,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    quizDB:{
        type: Array
    
    },
    students_scores:{
        type:Array
    }

})

quizSchema.pre('validate',function(){
    if(this.title){
        this.slug=slugify(this.title,{lower:true,strict:true})
        this.Active=true
        this.Started=false
    }
})
module.exports=mongoose.model('Quiz',quizSchema)