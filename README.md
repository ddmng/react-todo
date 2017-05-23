A simple TODO list to learn React
---
### Features
It runs only on client-side, so no queries to servers are issued.
* add a new item
* filter existing items

### Structure
Global `const elements = []`.

Components hierarchy:
* FilterableTodoPage
  * *state*: `{ filterText: '', newTodoText: '' }`
  * TodoFilterBox
    * *event* `handleFilterTextInputChange`
  * TodoElements
    * TodoItem
  * TodoAdd
    * *event* `handleNewTodoChange`
    * *event* `handleAddButtonClick`
