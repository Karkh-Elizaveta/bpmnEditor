require('./open.css')
const React = require('react');
const ReactDom = require('react-dom')
const jquery = require('jquery')
const BpmnModeler = require('bpmn-js/lib/Modeler');
const e = React.createElement;

class Content extends React.Component {
  constructor (props) {
    super();
    this.state = {list: props.list}
    //this.list = props.list;
  }
  render() {
    return e("div", {}, e(Buttons, {list: this.state.list/*.filter(e => e.enabled)*/}, null), e(Previews, {list: this.state.list, callback: (name) => {
      this.forceUpdate();
      for(let i = 0; i < this.state.list.length; i++) {
        if (this.state.list[i].name === name) {
          /*let tsl = this.state.list;
          tsl[i].enabled = !tsl[i].enabled;
          this.setState({list: tsl})
          console.log(this.state.list[i].enabled)*/
        }
      }
    }}, null))
  }
}

class Buttons extends React.Component {
  constructor (props) {
    super(props);
    this.state = {list: props.list}
    //this.list = props.list;
  }
  render() {
    return e("div", {}, e(CreateButton, {}, null), e(OpenButton, {list: this.state.list}, null), e(CompareButton, {list: this.state.list}, null))
  }
}

class CreateButton extends React.Component {
  render() {
    return e('button', {onClick: () => { location = "/edit" }}, "Create")
  }
}

class OpenButton extends React.Component {
  constructor(props) {
    super(props);
    //let size = this.props.list.length;
    this.state = {list: props.list/*, enabled: (size === 1) ? true : false*/}
}
  render () {
    return (this.state.list.filter(e => e.enabled).length === 1) ? e('button', {disabled: false, onClick: () => { location = `/edit?name=${this.state.list.filter(e => e.enabled)[0].name}` }}, "Open"): e('button', {disabled: true}, "Open");
  }
}

class CompareButton extends React.Component {
  constructor(props) {
    super(props);
    //let size = this.props.list.length;
    this.state = {list: props.list/*, enabled: (size === 2) ? true : false*/}
  }
  render () {
    return (this.state.list.filter(e => e.enabled).length === 2) ? e('button', {disabled: false,
      onClick: () => { location = `/diff?first=${this.state.list.filter(e => e.enabled)[0].name}&second=${this.state.list.filter(e => e.enabled)[1].name}` }}, "Compare"): e('button', {disabled: true}, "Compare");
  }
}

class Previews extends React.Component {
  constructor (props) {
    super(props)
    this.state = {list: props.list, callback: props.callback}
  }
  render() {
    return e('div', {}, this.state.list.map(elem => e(PreviewElement, {name: elem.name, svg: elem.svg, enabled: elem.enabled, callback: (name) => {
      for(let i = 0; i < this.state.list.length; i++) {
        if (this.state.list[i].name === name) {
          let tsl = this.state.list;
          tsl[i].enabled = !tsl[i].enabled;
          this.setState({list: tsl})
          this.state.callback(name);
        }
      }
    }
  }, null)))
  }
}

class PreviewElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {name: props.name, svg: props.svg, enabled: props.enabled, callback: props.callback}
  }
  render() {
    return e("div", {}, e("div", {title: "куку", onClick: () => {this.state.callback(this.state.name)}, className: "svg-element"}, e("span", {dangerouslySetInnerHTML: {__html: this.state.svg}}, null)))
    //return e('div', {onclick: this.state.callback}, (e('span', {}, this.state.name), e('div', {className: 'svg-element'}, e('span', {dangerouslySetInnerHTML: {__html: this.state.svg}}))))
  }
}

jquery.get('/list', (list) => {
  let elements = list.map(elem => { return {name: elem}});
  for (let i = 0; i < elements.length; i++) {
    jquery.get(`/choosen?name=${elements[i].name}`, data => {
      var mini_modeler = new BpmnModeler({ container: jquery('#preview') });
      mini_modeler.importXML(data, function(err) {
        mini_modeler.saveSVG((err, svg) => {
          elements[i].svg = svg;
          elements[i].enabled = false;
        })
      })
    })
  }
  setTimeout(() => {
    ReactDom.render(e(Content, {list: elements}, null), document.getElementById('preview'));
  }, 1000)
})
