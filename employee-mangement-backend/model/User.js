const mongoose = require("mongoose");
const {v4:uuidv4}=require("uuid");

const userSchema=new mongoose.Schema({
    _id:{type:String,default:uuidv4,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["manager","employee",'hr'],required:true},
    isDeleted:{type:Boolean,default:false},
    leavingDate:{type:Date,default:null},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
});

userSchema.index({ name: 1 });
userSchema.index({ email: 1 });

const User=mongoose.model('User',userSchema);

module.exports=User;