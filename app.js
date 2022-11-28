const express = require('express')
const app = express()
const mongoose = require("mongoose");

const List = require('./models/list.model')
const Task = require('./models/task.model')

mongoose.connect('mongodb://localhost:27018/task_manager').then(() => {
    console.log('mongodb connected to the database')

    const bodyParser = require('body-parser')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    // app.use(express.bodyParser());

    app.get('/lists', (req, res) => {
        List.find({}).then(lists => {
            res.send(lists)
        })
    })

    app.post('/lists', (req, res) => {
        let title = req.body.title
        newList = new List({
            title
        })
        newList.save().then(listDoc => {
            res.send(listDoc)
        })
    })

    app.post("", (req, res, next) => {
        console.log(req.body)
        res.json(req.body)
    });

    app.patch('/lists/:id', (req, res) => {
        List.findOneAndUpdate({ _id: req.params.id }, {
            $set: req.body
        }).then(() => {
            res.sendStatus(200)
        })
    })

    app.delete('/lists/:id', (req, res) => {
        List.findOneAndRemove({ _id: req.params.id }).then((removedDoc) => {
            res.send(removedDoc)
        })
    })

    app.get('/lists/:listId/tasks', (req, res) => {
        Task.find({
            _listId: req.params.listId
        }).then(tasks => {
            res.send(tasks)
        })
    })

    app.post('/lists/:listId/tasks', (req, res) => {
        newTask = new Task({
            title: req.body.title,
            _listId: req.params.listId
        });
        newTask.save().then(newTask => {
            res.send(newTask)
        })
    })

    app.listen(3000, () => {
        console.log('This was serve on port 3000');
    })
}).catch(e => {
    console.log('mongodb failed to connect to the database')
    console.log(e)
})

