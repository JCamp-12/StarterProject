import React, { Component } from 'react';
import axios from 'axios';
import {Appbar, Container, Button} from 'muicss/react';
import './App.css';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

class App extends Component {
  constructor(){
    super();
    this.state = {
      tasks: []
    }
  }

componentWillMount(){
  this.getTasks();
}

getTasks(){
  axios.request({
    method:'get',
    url:'https://api.mlab.com/api/1/databases/lambdatasks/collections/Tasks?apiKey=l6_6r7-Qq_oYkMTA5Brl_UtmbcPci3P9'
  }).then((response) => {
    this.setState({tasks: response.data}, () => {
      console.log(this.state);
    });
  }).catch((error) => {
    console.log(error);
  });
}

editState(task, checked){
  axios.request({
    method:'put',
    url:'https://api.mlab.com/api/1/databases/lambdatasks/collections/Tasks/'+task._id.$oid+'?apiKey=l6_6r7-Qq_oYkMTA5Brl_UtmbcPci3P9',
    data: {
      text: task.text,
      completed: checked
    }
  }).then((response) => {
    let tasks = this.state.tasks;
    for(let i=0; i < tasks.length; i++){
      if(tasks[i]._id.$oid === response.data._id.$oid){
       tasks[i].completed = checked;
      }
    }
    this.setState({tasks: tasks});
  }).catch((error) => {
    console.log(error);
  });
}

addTask(text){
  axios.request({
    method:'post',
    url:'https://api.mlab.com/api/1/databases/lambdatasks/collections/Tasks?apiKey=l6_6r7-Qq_oYkMTA5Brl_UtmbcPci3P9',
    data: {
      text: text,
      completed: false
    }
  }).then((response) => {
    let tasks = this.state.tasks;
    tasks.push({
      _id: response.data._id,
      text: text,
      completed: false
    })
    this.setState({tasks: tasks});
  }).catch((error) => {
    console.log(error);
  });
}

clearTasks(){
  let tasks = this.state.tasks;
  let i = tasks.length;

  while(i--) {
    if(tasks[i].completed === true) {
      let id = tasks[i]._id.$oid;
      tasks.splice(i, 1);
      axios.request({
        method: 'delete',
        url: 'https://api.mlab.com/api/1/databases/lambdatasks/collections/Tasks/'+id+'?apiKey=l6_6r7-Qq_oYkMTA5Brl_UtmbcPci3P9'
      }).then((response) => {

      }).catch((error) => {
        console.log(error);
      });
    }
  }

  this.setState({tasks: tasks});
}


  render() {
    return (
      <div className="App">
        <Appbar>
        <table width="100%">
         <tbody>
           <tr>
             <td className="mui--appbar-height"><h2>Get Your Tasks Here</h2></td>
           </tr>
         </tbody>
       </table>
        </Appbar>
        <br />
        <Container>
          <AddTask onAddTask={this.addTask.bind(this)} />
          <Tasks onEditState={this.editState.bind(this)} tasks={this.state.tasks} />
          <Button color="danger" onClick={this.clearTasks.bind(this)}>Clear Task</Button>
        </Container>
      </div>
    );
  }
}

export default App;

