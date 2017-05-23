import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const elements = [];

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

    this.state = {
      filterText: '',
      newTodoText: ''
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
    var newKey = 1 + Math.max.apply(Math, elements.map( (e) => e.id ) );
    elements.push({id: newKey>0?newKey:1, checked: false, text: this.state.newTodoText});

    this.setState({
      newTodoText: ''
    });
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
              <TodoElements filterText={this.state.filterText}
                            elements={elements}/>
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
  constructor(props) {
      super(props);
  }

  render () {
    console.log("rendering "+ elements.length + " elements")
    elements.forEach( (e) => console.log(e));
    const items = this.props.elements.filter(
      (e) => e.text.includes(this.props.filterText)
    ).map(
      (e) =>
          <li key={e.id}>
            <TodoItem checked={e.checked} text={e.text} />
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
  render() {
    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" checked={this.props.checked === "true"} /> {this.props.text}
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
    e.preventDefault();
    this.props.handleAddButtonClick()
  }


  render() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <input placeholder="New todo text"
                  className="form-control"
                  type="text"
                  value={this.props.newTodoText}
                  onChange={this.handleNewTodoChange}/>
          {' '}
          <input  className="btn btn-default"
                  type="button"
                  value="Add"
                  onClick={this.handleAddButtonClick}
                  />
        </div>
      </form>
    )
  }
}


export default App;
