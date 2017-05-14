/**
 * Created by mac on 5/13/17.
 */
const config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=> {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=> {
        // console.log(JSON.stringify(doc, undefined, 2));
        res.send(doc);
    }, (e)=> {
        // console.log('Unable to save', e);
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res)=> {
    Todo.find().then((todos)=> {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    })
});

app.get('/todos/:id', (req, res)=> {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(404).send();
    }
    Todo.findById(req.params.id).then((todo)=> {
        if (todo) {
            return res.send({todo});
        }
        return res.status(404).send();
    }, (e)=> {
        res.status(404).send();
    })
});

app.patch('/todos/:id', (req, res)=> {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    var body = _.pick(req.body, ['text', 'completed']);
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=> {
        if (todo) {
            return res.send({todo});
        }
        return res.status(404).send();
    }).catch(e=> res.status(400).send());
});


app.listen(process.env.PORT, ()=> {
    console.log('Listening on port 3000');
});

module.exports = {app};