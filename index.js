var express = require('express') //используем пакет express
var app = express() //создаем прототип express
var bodyParser = require('body-parser') //для пост-запросов
var dirty = require('dirty')
var db = dirty('bpmn.db') //база данных

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

// main page
app.get('/', function(req, res) {
  res.sendFile(__dirname+'/public/open.html')
})

app.get("/edit", function(req, res) {
  res.sendFile(__dirname+"/public/edit.html")
})

app.get("/diff", function(req, res) {
  res.sendFile(__dirname+"/public/diff.html")
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
  let data;
  if (name && name !== "") {
    data = db.get(name)
  } else {
    data = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn2:process id="Process_1" isExecutable="false">
        <bpmn2:startEvent id="StartEvent_1"/>
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>`;
  }
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
