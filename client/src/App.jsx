import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {

  const [todolist, setToDoList] = useState([]);

  // READ - Fetch tasks
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => setToDoList(data));
  }, []);

  // CREATE - Add task
  const saveToDoList = async (event) => {
    event.preventDefault();

    const toname = event.target.toname.value.trim();

    if (toname === "") return;

    const response = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: toname })
    });

    const newTodo = await response.json();

    setToDoList([...todolist, newTodo]);

    event.target.toname.value = "";
  };

  // DELETE
  const deleteRow = async (id) => {

    await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE"
    });

    const updatedList = todolist.filter((todo) => todo._id !== id);

    setToDoList(updatedList);
  };

  // UPDATE - Toggle status
  const toggleStatus = async (id) => {

    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: "PUT"
    });

    const updatedTodo = await response.json();

    const updatedList = todolist.map((todo) =>
      todo._id === id ? updatedTodo : todo
    );

    setToDoList(updatedList);
  };

  return (
    <div className="App">

      <h1>ToDo List</h1>

      <form onSubmit={saveToDoList}>
        <input
          type="text"
          name="toname"
          placeholder="Enter a new task..."
        />
        <button>Save</button>
      </form>

      <ul>
        {todolist.map((value) => (
          <li
            key={value._id}
            style={{
              textDecoration: value.status ? "line-through" : "none"
            }}
          >
            <span
              onClick={() => toggleStatus(value._id)}
              className="tick"
            >
              {value.status ? "✅" : "✔️"}
            </span>

            {value.name}

            <span
              onClick={() => deleteRow(value._id)}
              className="delete"
            >
              ❌
            </span>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;