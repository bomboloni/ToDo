console.log("hellooooooooo!");
const { key } = require("./config.js");
const express = require("express");
const path = require("path");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 3000;

let db,
  dbConnectionStr = `mongodb+srv://James:${key}@cluster0.y0oqp.mongodb.net/test?retryWrites=true&w=majority`,
  dbName = "todo";

MongoClient.connect(dbConnectionStr, {
  useUnifiedTopology: true,
}).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
});

app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  //          ^async is also new
  // NEWER VERSION:

  const todoItems = await db.collection("todo").find().toArray();
  // const itemsLeft = await db.collection('todo').countDocuments({completed: false})
  response.render("index.ejs", { info: todoItems });

  // OLDER VERSION:
  /*    db.collection('todo').find().toArray()
        .then(data => {
            response.render('index.ejs', { info: data })
        })
        .catch(error => console.error(error))
        */
});

app.post("/addTask", (request, response) => {
  db.collection("todo")
    .insertOne({ taskName: request.body.task })
    .then((result) => {
      console.log("Task Added To List");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteTask", (request, response) => {
  db.collection("todo")
    .deleteOne({ taskName: request.body.task })
    .then((result) => {
      console.log("Task Deleted");
      response.json("Task Deleted");
    })
    .catch((error) => console.error(error));
});

app.put("/updateTask", (req, res) => {
  const task = req.body.task;
  const completed = req.body.completed;
  db.collection("todo")
    .updateOne({ taskName: task }, { $set: { completed } })
    .then((result) => {
      console.log("Task Updated");
      res.json("Task Updated");
    })
    .catch((error) => console.error(error));
});

app.get("/completed", async (req, res) => {
  const completed = await db
    .collection("todo")
    .find({ $or: [{ donzo: true }, { completed: true }] })
    .toArray();
  res.json(completed);
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
