/**
 * Created by mac on 5/13/17.
 */
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

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

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err) =>{
        res.status(400).send(err);
    })
});

app.get('/todos/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findById(req.params.id).then((todo)=>{
        if (todo){
            return res.send({todo});
        }
        return res.status(404).send();
    },(e)=>{
        res.status(404).send();
    })
});


app.listen(3000, ()=> {
    console.log('Listening on port 3000');
});

module.exports = {app};