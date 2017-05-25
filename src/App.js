import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire'
import reactMixin from 'react-mixin'
import Autosuggest, { ListAdapter } from 'react-bootstrap-autosuggest'
import { Button, FormGroup, FormControl } from 'react-bootstrap';

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
var carBrands = []
carsRef = firebase.database().ref('automotive/cars');
carsRef.orderByKey().on("child_added",
  (snapshot) => {
    carBrands.push(  snapshot.key  )
  })


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
      <form>
        <FormGroup>
          <FormControl
            id="filtertext"
            type="text"
            placeholder="Enter filter text"
            value={this.props.filterText}
            onChange={this.handleFilterTextInputChange}
          />

        </FormGroup>
      </form>
    )
  }
}

class TodoElements extends React.Component {
  render () {
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
          <Button bsStyle="warning"
                  id={this.props.id}
                  onClick={this.handleDelete}
                  ><i className="fa fa-trash" aria-hidden="true"></i></Button>
                  {' '}
                  {this.props.text}
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
    //this.props.handleNewTodoChange(e.target.value)
    this.props.handleNewTodoChange(e)
  }

  handleAddButtonClick(e) {
    this.props.handleAddButtonClick()
    e.preventDefault();
  }

  render() {
    return (
      <form >
        <FormGroup>
          <Autosuggest inline
            datalist={ carBrands }
            value={this.props.newTodoText}
            onChange={this.handleNewTodoChange}
            placeholder="Enter a car brand"
          />
          {' '}
          <Autosuggest inline
            datalist={ brandModels }
            value={this.props.carModel}
            onChange={this.handleCarModelChange}
            placeholder="Enter a car model"
          />
          {' '}
          <Button inline type="submit"
                  bsStyle="primary"
                  onClick={this.handleAddButtonClick}>Add</Button>

        </FormGroup>
      </form>
    )
  }
}


reactMixin(FilterableTodoPage.prototype, ReactFireMixin)

export default App;
