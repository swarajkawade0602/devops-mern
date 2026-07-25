import { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/todos';

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8.5L6 11.5L13 4" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M5.5 4V2.5C5.5 2.22 5.72 2 6 2H10C10.28 2 10.5 2.22 10.5 2.5V4M6.5 7.5V11.5M9.5 7.5V11.5M3.5 4L4 13C4 13.55 4.45 14 5 14H11C11.55 14 12 13.55 12 13L12.5 4"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const fetchTodos = async () => {
    const res = await axios.get(API);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    await axios.post(API, { text });
    setText('');
    fetchTodos();
  };

  const toggleTodo = async (id) => {
    await axios.put(`${API}/${id}`);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTodos();
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <p className="app__eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <h1 className="app__title">Today's List</h1>
      <p className="app__subtitle">
        {todos.length === 0
          ? 'Nothing planned yet — add your first task.'
          : remaining === 0
            ? 'All done. Nice work.'
            : `${remaining} task${remaining === 1 ? '' : 's'} left`}
      </p>

      <div className="composer">
        <input
          className="composer__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
        />
        <button className="composer__button" onClick={addTodo}>Add</button>
      </div>

      {todos.length === 0 ? (
        <div className="empty">
          <p className="empty__title">A blank page</p>
          <p className="empty__hint">Write down what's on your mind.</p>
        </div>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <li key={todo._id} className={`task ${todo.completed ? 'task--done' : ''}`}>
              <button className="task__check" onClick={() => toggleTodo(todo._id)} aria-label="Toggle complete">
                <CheckIcon />
              </button>
              <span className="task__text" onClick={() => toggleTodo(todo._id)}>{todo.text}</span>
              <button className="task__delete" onClick={() => deleteTodo(todo._id)} aria-label="Delete task">
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="footer">MERN Todo · stored in MongoDB</p>
    </div>
  );
}

export default App;
