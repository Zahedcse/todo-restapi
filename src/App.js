import {useState,useEffect} from 'react'
import './App.css';
import 'bulma/css/bulma.min.css';
import { FaTimes } from "react-icons/fa";
import {GrEdit,GrAdd ,GrUpdate } from "react-icons/gr";
import { isEditable } from '@testing-library/user-event/dist/utils';




function App() {
  const [todoTitle, setTodoTitle] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const addTodo = (e) => {
    e.preventDefault();
    if (todoTitle) {
      const newTodo = {
      id: Date.now(),
      title: todoTitle,
      }
      fetch('http://localhost:3000/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),        //To Save data in the database
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(res => res.json()
        .then(() => {
          fetch('http://localhost:3000/todos')
            .then(res => res.json())          //To get data from the database
            .then(data => setTodoList(data))
        } )
      )
      setTodoTitle('');
    
    } else {
      alert('Please enter a todo')
    }
  }
  const deleteTodo = (id) => {
    // setTodoList(todoList.filter(todo => todo.id !== id))
    const todo = todoList.find(todo => todo.id === id);
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: 'DELETE',
    }).then(() => {
      fetch('http://localhost:3000/todos')
      .then(res => res.json())
      .then(data => setTodoList(data))
    }
    )
  }
  const editTodo = (id) => {
    const editTodo = todoList.find(todo => todo.id === id)
    setEditMode(true)
    setEditItem(editTodo)
    setTodoTitle(editTodo.title)

  }
  const updateTodo = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/todos/${editItem.id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: todoTitle }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json()
      .then(() => {
        fetch('http://localhost:3000/todos')
          .then(res => res.json())
          .then(data => {
            setTodoList(data)
            setEditMode(false)
            setEditItem(null)
            setTodoTitle('')
          })
      })
    )
    
  }
  
  
  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(res => res.json())
      .then(data => setTodoList(data))
  }, []);

  
  return (
    <div className="App">
      
      <div class="container box column is-5 mt-5">
        <h1 className='title'>Todo App</h1>
        <input type="text" className="input is-success" value={todoTitle}
        onChange={(e) => setTodoTitle(e.target.value)} />
        <button className="button mt-2 is-primary"
          onClick={(e)=> editMode===true? updateTodo(e):addTodo(e) }>{editMode===true ?<GrUpdate/>:<GrAdd/>}</button>
        <ul className="list-group mt-2">{
          todoList.map(todo => (
            <li className="list-group-item">
              <hr />
            <input type="checkbox" />
              <span>{todo.title}</span>
              <button className="button is-small ml-2 is-primary"
              onClick={(id)=>editTodo(todo.id)}  ><GrEdit /></button>
              <button className="button is-small ml-2 is-danger"
              onClick={(id)=>deleteTodo(todo.id) }><FaTimes /></button>
              <hr />
          </li>
          ))}
          </ul>
      </div>
    </div>
  );
}

export default App;
