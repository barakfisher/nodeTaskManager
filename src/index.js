const express = require("express");
//connect to server
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT ;

// Middlewere
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     return res.send("Get requests are disabled");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   return res.status(503).send("Site is currently down, check back soon");
// });
app.use((req,res,next)=>{
  console.log("Middlewere here (events before routing)")
  next();
})

//Auto parse incoming objects to json
app.use(express.json());
// ROUTES
app.use(userRouter);
app.use(taskRouter);

//
//  Without middlewere : request => run route handler
//
//With middlewere : requesr => do something => run route handler
//

app.listen(port, () => {
  console.log("running on port ", port);
});

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
// const myFunction = async () => {
//   const tokenData = { _id: "ASDASDASD" };
//   const secret = "stringToEncodeJWT";
//   const options = { expiresIn: "7 days" };
//   const token = jwt.sign(tokenData, secret, options);
//   const data = jwt.verify(token, secret);
//   console.log(data);
// };

// myFunction();
