const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');


const employeeSchema = new mongoose.Schema({
    _id:{type:String,default:uuidv4,required:true},
    userId:{type:String,ref:'User',required:true},
    department:{type:String,required:true},
    joiningDate:{type:Date,required:true},
    projects:{type:Array,default:[]},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
});

const Employee=mongoose.model('Employee',employeeSchema);

module.exports = Employee