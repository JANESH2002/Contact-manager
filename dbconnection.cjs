const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callback) {
    MongoClient. connect('mongodb+srv://janesh:2002@cluster0.zuh3waq.mongodb.net/Project1?retryWrites=true&w=majority').then(function(client) {
        dbConnection = client.db()
        callback()
    }).catch(function(error){
        callback(error)
    })  
}
function getDb() {
    return dbConnection
}

module.exports = {connectToDb, getDb}