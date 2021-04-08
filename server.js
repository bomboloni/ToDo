console.log('hellooooooooo!')

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 3000
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {
    useUnifiedTopology: true //,
})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public')) //app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',async (request, response) => {

    const todoItems = await db.collection('tasks').find().toArray()
   // const itemsLeft = await db.collection('tasks').countDocuments({completed: false})
    response.render('index.ejs', {info: todoItems})
})

app.post('/addTask', (request, response) => {
    db.collection('tasks').insertOne(
        { 
            taskName: request.body.task, 
            completed: false 
        }
        )
        .then(result => {
            console.log('Task Added To List')
            response.redirect('/')
        })
        .catch(error => console.error(error))
})
/*
app.put('/updateTask', (request, response) => {
    const task = request.body.task;
    const completed = request.body.completed;

    db.collection('tasks').updateOne(
        { taskName: task }, 
        { set: { completed: completed } }
        )
    .then((result) => {
        console.log('Task Marked Completed');
        response.json('Task Marked Completed');
    })
    .catch(error => console.error(error))
})
*/
////////
app.put("/updateTask", (req, res) => {
      const task = req.body.task;
      const completed = req.body.completed;
      db.collection("tasks")
        .updateOne({ taskName: task }, { $set: { completed: true } })
        .then((result) => {
          console.log("Task Updated");
          res.json("Task Updated");
        })
        .catch((error) => console.error(error));
    });
//////

app.delete('/deleteTask', (request, response) => {
    db.collection('tasks').deleteOne({ taskName: request.body.task })
        .then(result => {
            console.log('Task Marked Completed')
            response.json('Task Marked Completed')
        })
        .catch(error => console.error(error))
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})