var express = require('express') //используем пакет express
var app = express() //создаем прототип express
var bodyParser = require('body-parser') //для пост-запросов
var dirty = require('dirty')
var db = dirty('bpmn.db') //база данных

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

// main page
app.get('/', function(req, res) {
  res.sendFile('index.html')
})

// list of diagrams
app.get('/list', function(req, res) {
  var list = []
  db.forEach((key, value) => list.push(key))
  res.send(list)
})

// choose diagram
app.get('/choosen', function(req, res) {
  let name = req.query.name
  let data = db.get(name)
  res.send(data)
})

// save diagram
app.post('/save', function(req, res) {
  db.set(req.body.name, req.body.data, () => {
    res.end()
  })
})

// run server after database loading
db.on('load', () => {
  app.listen(3000);
  console.log("server is running")
})
