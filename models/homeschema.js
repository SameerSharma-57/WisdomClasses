const mongoose = require('mongoose');
const schema = mongoose.Schema;
const slugify=require('slugify')

const userSchema = new schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        required:true
    },
    role : {
        type : String,
        required:true
    },
    slug: {
        type:String,
        required: true,
        unique: true
    }
})

userSchema.pre('validate',function(){
    if(this.name){
        this.slug=slugify(this.name,{lower:true})
    }
})

module.exports = mongoose.model('Registeruser',userSchema)