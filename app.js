const express = require('express')
const app = express()
const mongoose = require("mongoose");

const List = require('./models/list.model')
const Task = require('./models/task.model')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

    app.get('/lists/:listId/tasks/:taskId', (req, res) => {
        Task.find({
            _id: req.params.taskId,
            _listId: req.params.listId
        }).then(task => {
            res.send(task)
        })
    })

    app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
        Task.findOneAndUpdate({
            _id: req.params.taskId,
            _listId: req.params.listId
        }, {
            $set: req.body
        }).then(() => {
            res.sendStatus(200)
        })
    })

    app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
        Task.findOneAndRemove({
            _id: req.params.taskId,
            _listId: req.params.listId
        }).then((removedTask) => {
            res.send(removedTask)
        })
    })


    app.listen(3000, () => {
        console.log('This was serve on port 3000');
    })
}).catch(e => {
    console.log('mongodb failed to connect to the database')
    console.log(e)
})

