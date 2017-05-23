import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';



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

class FilterableTodoPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);

    this.state = {
      filterText: '',
      newTodoText: '',
      elements: []
    };
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
    this.state.elements.push({id: newKey>0?newKey:1, checked: false, text: this.state.newTodoText});

    this.setState({
      newTodoText: ''
    });
  }

  handleCheckChange(key, newValue) {
    var ind = this.state.elements.findIndex( (e) => e.id == key )
    console.log("ind " + ind + " new value " + newValue);

    var els = this.state.elements

    if(ind >= 0)
      els[ind].checked = newValue

    this.setState({elements: els})
    console.dir(this.state.elements)
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
              <TodoElements handleCheckChange={this.handleCheckChange}
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
    console.log("rendering "+ this.props.elements.length + " elements")
    this.props.elements.forEach( (e) => console.log(e));
    const items = this.props.elements.filter(
      (e) => e.text.includes(this.props.filterText)
    ).map(
      (e) =>
          <li key={e.id}>
            <TodoItem id={e.id} handleCheckChange={this.props.handleCheckChange} checked={e.checked} text={e.text} />
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
      this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleCheckChange(e) {
    this.props.handleCheckChange(e.target.id, e.target.checked)
  }

  render() {
    var canceled = this.props.checked?"strike":""
    return (
      <div className="checkbox">
        <label>
          <input  type="checkbox"
                  id={this.props.id}
                  onChange={this.handleCheckChange}
                  value={this.props.checked}
                  /> <span className={canceled}>
                    {this.props.text}
                  </span>
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


export default App;
