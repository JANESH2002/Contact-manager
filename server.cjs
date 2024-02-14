const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')
const app = express()
const {connectToDb, getDb} = require('./dbconnection.cjs')
app.use(bodyParser.json())



let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    }else{
        const port = process.env.PORT || 7000
        app.listen(port)
        db = getDb()
        console.log(`running in the port ${port}`)
    }
})

app.post('/signup', function(request,response){
    db.collection('database').insertOne(request.body).then(function() {
        response.status(202).json({
            "status" : "Entry added successfully"
        })
    }).catch(function() {
        response.status(404).json({
            "status" : "Entry not added"
        })
    })
})

app.get('/get-entries', function(request,response){
    const entries = []
    db.collection('database').find()
    .forEach(entry => entries.push(entry))
    .then(function(){
        response.status(202).json(entries)
    }).catch(function(){
        response.status(500).json({
            "status" : "Could not fetch documents"
        })
    })
})

app.delete('/delete-entry',function(request,response){
    if(ObjectId.isValid(request.query.id)){
        db.collection('database').deleteone({
            _id : new ObjectId(request.query.id)
        }).then(function(){
            response.status(202).json({
                "status" : "Entry successfully deleted"
            })
        })
    }else{
        response.status(300).json({
            "status" : "Objected not valid"
        })
    }
})

app.post('/login',(request,response) => {
    let checker = []
    db.collection('database').find(request.body).forEach(element => {
        checker.push(element)
    }).then(() => {
        if(checker == 0){
        response.json({
            "auth":"Invalid Login"
        })}
        else{
            response.json({
                "auth" : "Successfully Login"
            })
        }
    }).catch(() => {
        response.status(500).send("Something went wrong")
    })
})