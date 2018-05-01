require('./app.css');
require('./bpmn-js.css')
require('./bpmn-embedded.css')

var $ = require('jquery'),
    BpmnModeler = require('bpmn-js/lib/Modeler');

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var modeler = new BpmnModeler({ container: canvas });

function openDiagram(xml) {

  modeler.importXML(xml, function(err) {

    if (err) {
      container
        .removeClass('with-diagram')``
        .addClass('with-error');

      container.find('.error pre').text(err.message);

      console.error(err);
    } else {
      container
        .removeClass('with-error')
        .addClass('with-diagram');
    }


  });
}

function saveSVG(done) {
  modeler.saveSVG(done);
}

function saveDiagram(done) {

  modeler.saveXML({ format: true }, function(err, xml) {
    done(err, xml);
  });
}

function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {

      var xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function() {

  $.get('/list', (data) => {
    data.forEach(name => {$('#listBPMN').append(`<option value="${name}">${name}</option>`)})
  })

  $('#js-download-diagram').click(e => {
    e.preventDefault();
    let name = prompt('Сохранение диаграммы', 'Введите название диаграммы');
    $.get('/choosen', {name: name}, (data) => {
      if (data) {
        if (confirm("Уже существует. Перезаписать?")) {
          saveDiagram(function(err, xml) {
            $.post('/save', { name: name, data: xml}, (data) => {})
          })
        }
      } else {
        saveDiagram(function(err, xml) {
          $.post('/save', { name: name, data: xml}, (data) => {})
        })
      }
    });
  })

  $('#listBPMN').change(() => {
    if (confirm("Сохранить изменения?")) {
      $.get('/choosen', {name: $('#listBPMN').val()}, (data) => {
        openDiagram(data);
      })
    }
  })

});

$.get('/choosen', {name: window.location.search.substr(1).split("=")[1]}, (data) => {
  openDiagram(data);
})
