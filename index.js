const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./Models/Employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose.connect("mongodb+srv://abdulazizkhan107925:XQE86VPcCx02a1Wd@internee.suxvxnv.mongodb.net/?retryWrites=true&w=majority&appName=internee");

const verifyuser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.json("the token is not available");
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) return res.json("Invalid token or token has expired");
      next();
    });
  }
  console.log(token);
};

app.get("/home", verifyuser, (req, res) => {
  res.json("Success");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            res.json("Success");
          } else {
            res.json("This password is incorrect");
          }
        });
      } else {
        res.json("No record exists");
      }
    })
    .catch((err) => res.json(err));
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      EmployeeModel.create({ name, email, password: hash })
        .then((employees) => res.json(employees))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.post("/create", (req, res) => {
  EmployeeModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/users", (req, res) => {
  EmployeeModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  EmployeeModel.findById({ _id: id })
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.put("/updateUser/:id", (req, res) => {
  const id = req.params.id;
  EmployeeModel.findByIdAndUpdate(
    { _id: id },
    {
      employeename: req.body.employeename,
      employeeemail: req.body.employeeemail,
      age: req.body.age,
    }
  )
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});
app.delete("/deleteUser/:id",(req,res)=>{
  const id = req.params.id;
  EmployeeModel.findByIdAndDelete({_id: id})
  .then((res) => res.json(res))
  .catch((err) => res.json(err));
})
app.listen(3001, () => {
  console.log("listening on Server 3001");
});
