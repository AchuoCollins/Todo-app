import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, createContext, useContext, useReducer } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

// Create Context
const TodoContext = createContext();

// Reducer function for state management
function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_NEW_TASK':
      return { ...state, newTask: action.payload };
    case 'SET_COMPLETE':
      return { ...state, complete: action.payload };
    case 'SET_CHECKED_TASKS':
      return { ...state, checkedItemsTask: action.payload };
    case 'SET_CHECKED_COMPLETE':
      return { ...state, checkedItemsComplete: action.payload };
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload],
        newTask: '' 
      };
    case 'COMPLETE_TASK':
      const taskToComplete = state.tasks[action.payload];
      return {
        ...state,
        tasks: state.tasks.filter((_, i) => i !== action.payload),
        complete: [...state.complete, taskToComplete]
      };
    case 'ABANDON_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((_, i) => i !== action.payload)
      };
    case 'DELETE_TASK':
      return {
        ...state,
        complete: state.complete.filter((_, i) => i !== action.payload)
      };
    case 'TOGGLE_TASK_CHECKBOX':
      return {
        ...state,
        checkedItemsTask: {
          ...state.checkedItemsTask,
          [action.payload]: !state.checkedItemsTask[action.payload]
        }
      };
    case 'TOGGLE_COMPLETE_CHECKBOX':
      return {
        ...state,
        checkedItemsComplete: {
          ...state.checkedItemsComplete,
          [action.payload]: !state.checkedItemsComplete[action.payload]
        }
      };
    case 'BULK_ABANDON':
      return {
        ...state,
        tasks: state.tasks.filter((_, i) => !state.checkedItemsTask[i]),
        checkedItemsTask: {}
      };
    case 'BULK_COMPLETE':
      const tasksToComplete = state.tasks.filter((_, i) => state.checkedItemsTask[i]);
      return {
        ...state,
        tasks: state.tasks.filter((_, i) => !state.checkedItemsTask[i]),
        complete: [...state.complete, ...tasksToComplete],
        checkedItemsTask: {}
      };
    case 'BULK_DELETE':
      return {
        ...state,
        complete: state.complete.filter((_, i) => !state.checkedItemsComplete[i]),
        checkedItemsComplete: {}
      };
    default:
      return state;
  }
}

// Initial state
const getInitialState = () => {
  try {
    const saved = localStorage.getItem('appState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required properties exist
      return {
        tasks: parsed.tasks || [],
        newTask: parsed.newTask || '',
        complete: parsed.complete || [],
        checkedItemsTask: parsed.checkedItemsTask || {},
        checkedItemsComplete: parsed.checkedItemsComplete || {}
      };
    }
  } catch (error) {
    console.error('Error loading saved state:', error);
  }
  
  return {
    tasks: [],
    newTask: '',
    complete: [],
    checkedItemsTask: {},
    checkedItemsComplete: {}
  };
};

// Context Provider Component
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook to use the context
function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}

// Todo Component
function Todo() {
  const { state, dispatch } = useTodo();
  const { tasks, newTask, complete, checkedItemsTask, checkedItemsComplete } = state;

  const handleInputChange = (e) => {
    dispatch({ type: 'SET_NEW_TASK', payload: e.target.value });
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  function addTask() {
    if (newTask.trim() !== '') {
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
  }

  function handleCheckboxChangeTasks(index) {
    dispatch({ type: 'TOGGLE_TASK_CHECKBOX', payload: index });
  }

  function handleCheckboxChangeComplete(index) {
    dispatch({ type: 'TOGGLE_COMPLETE_CHECKBOX', payload: index });
  }

  function handleCheckAbandon() {
    dispatch({ type: 'BULK_ABANDON' });
  }

  function handleCheckComplete() {
    dispatch({ type: 'BULK_COMPLETE' });
  }

  function handleCheckDelete() {
    dispatch({ type: 'BULK_DELETE' });
  }

  function handleCompleteTask(task, index) {
    dispatch({ type: 'COMPLETE_TASK', payload: index });
  }

  function handleAbandonTask(index) {
    dispatch({ type: 'ABANDON_TASK', payload: index });
  }

  function handleDeleteTask(index) {
    dispatch({ type: 'DELETE_TASK', payload: index });
  }

  return (
    <div className="todolist-wrapper">
      <h1>To Do List</h1>
      <div className='input-wrapper'>
        <input 
          type="text" 
          placeholder='Enter a text'
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleEnterPress} 
        />

        <button className='add-button' onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="tasks">
        <div className="task">
          <div className="heading">
            <h1>Task to Complete: {tasks.length}</h1>
            <div className="btn">
              <button style={{ backgroundColor: 'gray' }} onClick={handleCheckAbandon}>Abandon</button>
              <button style={{ backgroundColor: 'Green' }} onClick={handleCheckComplete}>Completed</button>
            </div>
          </div>

          <ol>
            {tasks.map((task, index) => (
              <li key={index}>
                <span className='text'>{task}</span>
                <div className='actions'>
                  <input 
                    type="checkbox" 
                    checked={checkedItemsTask[index] || false} 
                    onChange={() => handleCheckboxChangeTasks(index)} 
                  />
                  <button style={{ backgroundColor: 'gray' }} onClick={() => handleAbandonTask(index)}>Abandon</button>
                  <button style={{ backgroundColor: 'green' }} onClick={() => handleCompleteTask(task, index)}>Complete</button>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="complete">
          <div className="heading">
            <h1>Completed Tasks: {complete.length}</h1>
            <button onClick={handleCheckDelete}><FontAwesomeIcon icon={faTrash}/></button>
          </div>
          <ol>
            {complete.map((completed, index) => (
              <li key={index}>
                <span className='text'>{completed}</span>
                <div className='actions'>
                  <input 
                    type="checkbox" 
                    checked={checkedItemsComplete[index] || false} 
                    onChange={() => handleCheckboxChangeComplete(index)} 
                  />
                  <button onClick={() => handleDeleteTask(index)}><FontAwesomeIcon icon={faTrash}/></button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// Wrap the Todo with the Provider
export default function TodoApp() {
  return (
    <TodoProvider>
      <Todo />
    </TodoProvider>
  );
}