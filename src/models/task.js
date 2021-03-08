const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Set relationship between Task and user
    // as actual field on Task
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    // Will add "createdAt" and "updatedAt" fields
    timestamps:true,
  }
);
 const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

// const task = new Task({
//   description: "finish day2",
// });
// task
//   .save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
