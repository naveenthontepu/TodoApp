/**
 * Created by mac on 5/13/17.
 */
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/Todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test Todo'
}, {
    _id: new ObjectID(),
    text: 'Second test Todo'
}];

beforeEach((done)=> {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todos', ()=> {
    it('should create a new todo', (done)=> {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=> {
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos)=> {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e=> done(e));
            })
    });
    it('should not create a todo with invalid data', (done)=> {
        request(app)
            .post('/todos')
            .expect(400)
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos)=> {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e=> done(e));
            });
    })
});

describe('Get /todos', ()=> {
    it('should get all the todos', (done)=> {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=> {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id', ()=> {
    it('should get the correct todo', (done)=> {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end(done);
    });

    it('should return 404 if object id is invalid',(done)=>{
        request(app)
            .get('/todos/12312312')
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id in not there',(done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});