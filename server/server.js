/**
 * Created by mac on 5/13/17.
 */
var express = require('express');
var bodyParser = require('body-parser');

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
        console.log(JSON.stringify(doc, undefined, 2));
        res.send(doc);
    }, (e)=> {
        console.log('Unable to save', e);
        res.status(400).send(e);
    })
});

app.listen(3000, ()=> {
    console.log('Listening on port 3000');
});

module.exports = {app};