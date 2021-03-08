const Task = require("../models/task");
const express = require("express");
const auth = require("../middlewere/auth");


const router = new express.Router();


const isValidUpdate = (allowedUpdates, updateData) => {
  const updateFields = Object.keys(updateData);
  const isValidOperation = updateFields.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return false;
  }
  return true;
};

// Set new Task
router.post("/tasks", auth, async (req, res) => {
  //Create task with req data
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  //save task to db
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all tasks
// GET tasks?completed=bool && limit=int && skip=int && sortBy=string_desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const isCompleted = req.query.completed;
  if (isCompleted) {
    match.completed = isCompleted === "true";
  }
  const sort = {};
  const sortBy = req.query.sortBy;
  if (sortBy) {
    const sortParts = sortBy.split("_");
    const field = sortParts[0];
    const order = sortParts[1] === "desc" ? -1 : 1;
    sort[field] = order;
    console.log(sort)

  }

  try {
    const user = req.user;
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          //max amount of documents to return
          limit: parseInt(req.query.limit),
          //will skip X entries
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Get single task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const authUserId = req.user._id;
  try {
    const task = await Task.findOne({ _id, owner: authUserId });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

// Update single task by id
router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["completed", "description"];
  if (!isValidUpdate(allowedUpdates, req.body)) {
    return res.status(400).send("error:invalid update");
  }
  const _id = req.params.id;
  console.log(req.user);
  const authUserId = req.user._id;
  const updateData = req.body;
  const updateFields = Object.keys(updateData);

  try {
    const task = await Task.findOne({ _id, owner: authUserId });

    if (!task) {
      return res.status(404).send("task not found");
    }
    updateFields.map((update) => {
      task[update] = updateData[update];
    });
    task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const authUserId = req.user._id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: authUserId });
    if (!task) {
      return res.status(404).send("task not found");
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
