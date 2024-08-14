const mongoose= require("mongoose");


const EmployeeSchema = new mongoose.Schema({

  name:String,
  email:String,
  password:String,
  employeename:String,
  employeeemail:String,
  age:Number

})

const EmployeeModel= mongoose.model("employee",EmployeeSchema)

module.exports = EmployeeModel;
