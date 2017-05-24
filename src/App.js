import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'

var th = jQuery(".typeahead");


class App extends Component {
  render() {
    return (
        <div className="container">
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <FilterableTodoPage />
            </div>
            <div className="col-md-4"></div>
          </div>
        </div>
    );
  }
}

var config = {
  apiKey: "AIzaSyA_1_h0pf6c-nie41ct-rE1oQ5g-TKH-zU",
  authDomain: "todo-94247.firebaseapp.com",
  databaseURL: "https://todo-94247.firebaseio.com",
  projectId: "todo-94247",
  storageBucket: "todo-94247.appspot.com",
  messagingSenderId: "305703722979"
  // apiKey: "AIzaSyCdxGmqWURL8YUfGPK3OVANsyvsE0cHV5s",
  // authDomain: "reactfiretodoapp.firebaseapp.com",
  // databaseURL: "https://reactfiretodoapp.firebaseio.com"
};
firebase.initializeApp(config);

var carsRef;


class FilterableTodoPage extends React.Component {

  constructor(props) {
    super(props);

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      filterText: '',
      newTodoText: '',
      elements: [],
      cars: []
    };
  }
  componentWillMount() {
    var firebaseRef = firebase.database().ref('todoApp/items');
    this.bindAsArray(firebaseRef.limitToLast(25), 'elements');

    carsRef = firebase.database().ref('automotive/cars');
    // this.bindAsArray(carsRef.limitToLast(25), 'cars');
    carsRef.orderByKey().on("child_added",
      (snapshot) => {
        this.state.cars.push( {
          brand: snapshot.key,
          models: snapshot.val()
        })
      })
  }

  handleFilterTextInput(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleNewTodoChange(newTodoText) {
    this.setState({
      newTodoText: newTodoText
    });

    var sugg = newTodoText.trim().length > 0 && this.suggestCarBrand(newTodoText);
    console.dir(sugg)
  }

  suggestCarBrand(s) {
    console.log("Requested suggest for " + s);
    var els = this.state.cars.filter( e => e.brand.toLowerCase().startsWith(s.toLowerCase()) ).map( e => e.brand)

    return els.length > 0 && els
    // if(els[0]) {
    //   var models = els[0].models
    //   var dummy = models[Object.keys(models)[0]]
    //   var makes = dummy[Object.keys(dummy)[0]]
    //   return makes
    // } else { return  false }
  }

  handleAddButtonClick() {
    var newKey = 1 + Math.max.apply(Math, this.state.elements.map( (e) => e.id ) );
    //this.state.elements.push({id: newKey>0?newKey:1, checked: false, text: this.state.newTodoText});
    if (this.state.newTodoText && this.state.newTodoText.trim().length !== 0) {
      this.firebaseRefs['elements'].push({
        text: this.state.newTodoText
      });
    }
    this.setState({
      newTodoText: ''
    });
  }

  handleDelete(key) {
    console.log("delete: " + key);
    var firebaseRef = firebase.database().ref('todoApp/items');
    firebaseRef.child(key).remove();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h2>Welcome to my ToDo list</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            {' '}
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <TodoFilterBox
                          filterText={this.state.filterText}
                          onFilterTextInput={this.handleFilterTextInput}
                          />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <TodoElements handleDelete={this.handleDelete}
                            filterText={this.state.filterText}
                            elements={this.state.elements}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <TodoAdd newTodoText={this.state.newTodoText}
                     handleNewTodoChange={this.handleNewTodoChange}
                     handleAddButtonClick={this.handleAddButtonClick} />
          </div>
        </div>
      </div>
    )
  }
}

class TodoFilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
  }

  handleFilterTextInputChange(e) {
    this.props.onFilterTextInput(e.target.value);
  }

  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <label className="sr-only" htmlFor="filtertext">Enter filter text...</label>
          <input  id="filtertext"
                  placeholder="Enter filter text..."
                  name="filter"
                  className="form-control"
                  type="text"
                  value={this.props.filterText}
                  onChange={this.handleFilterTextInputChange}
                  />
        </div>
      </form>
    )
  }
}

class TodoElements extends React.Component {
  render () {
    //console.log("rendering "+ this.props.elements.length + " elements")
    //this.props.elements.forEach( (e) => console.log(e));
    const items = this.props.elements.filter(
      (e) => e.text.includes(this.props.filterText)
    ).map(
      (e) =>
          <li key={e['.key']}>
            <TodoItem id={e['.key']} handleDelete={this.props.handleDelete} text={e.text} />
          </li>
    );

    return (
        <ul className="list-unstyled">
          {items}
        </ul>
    )
  }
}

class TodoItem extends React.Component {
  constructor(props) {
      super(props);
      this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(e) {
    this.props.handleDelete(e.target.id)
  }

  render() {
    return (
      <div className="checkbox">
        <label>
          <input  type="button"
                  id={this.props.id}
                  onClick={this.handleDelete}
                  value="X"
                  /> {this.props.text}
        </label>
      </div>
    )
  }

}

class TodoAdd extends React.Component {
  constructor(props) {
      super(props);
      this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
      this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
  }

  handleNewTodoChange(e) {
    this.props.handleNewTodoChange(e.target.value)
  }

  handleAddButtonClick(e) {
    this.props.handleAddButtonClick()
    e.preventDefault();
  }

  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <input placeholder="Enter text for a new todo..."
                  className="form-control"
                  type="text"
                  value={this.props.newTodoText}
                  onChange={this.handleNewTodoChange}/>
          {' '}
          <input  className="btn btn-default"
                  type="submit"
                  value="Add"
                  onClick={this.handleAddButtonClick}
                  />
        </div>
      </form>
    )
  }
}

reactMixin(FilterableTodoPage.prototype, ReactFireMixin)

export default App;
