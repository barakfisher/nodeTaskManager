const mongoose = require("mongoose");


// const connectionURL = "mongodb://127.0.0.1:27017";
// const databaseName = "task-manager-api";
// const connectionStr =`${connectionURL}/${databaseName}`;
const connectionStr = process.env.CONNECTION_URL ;

mongoose.connect(connectionStr, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});







