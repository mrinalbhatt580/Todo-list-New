const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Todo = require("./models/Todo");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/todos", async (req, res) => {             //get all todos from the database and send them as a response

  const todos = await Todo.find();

  res.json(todos);

});

app.post("/todos", async (req, res) => {           //create a new todo and save it to the database, then send the saved todo as a response

  const newTodo = new Todo({
    name: req.body.name
  });

  const savedTodo = await newTodo.save();

  res.json(savedTodo);

});

app.delete("/todos/:id", async (req, res) => {    //delete a todo by id from the database, then send a success message as a response

  await Todo.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted successfully" });

});

app.put("/todos/:id", async (req, res) => {      //toggle the status of a todo by id in the database, then send the updated todo as a response

  const todo = await Todo.findById(req.params.id);

  todo.status = !todo.status;

  const updated = await todo.save();

  res.json(updated);

});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});