require('../src/db/mongoose');
const Task = require("../src/models/task");
console.log("Asdasdas")
 Task.findByIdAndRemove("600ed97e1f527b4760f3fdc2").then((task)=>{
   return Task.countDocuments({})
 }).then((count)=>{
 console.log(count);
 }).catch((e)=>{
   console.log(e)
 })