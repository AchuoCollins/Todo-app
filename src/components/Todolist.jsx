
// import AiFillDelete from "react-icons/ai"

import React, { useEffect } from 'react'

function Todolist() {

    const[tasks, setTasks] = React.useState(() => {
      const saved = localStorage.getItem('appState');
      return saved ? JSON.parse(saved).tasks : []
    });

    const [newTask, setNewTask] = React.useState(() => {
      const saved = localStorage.getItem('appState');
      return saved ? JSON.parse(saved).newTask : ''
    });

    const [complete, setComplete] = React.useState(() => {
      const saved = localStorage.getItem('appState');
      return saved ? JSON.parse(saved).complete : []
    });

    useEffect(() =>{
        localStorage.setItem('appState', JSON.stringify({tasks, newTask, complete}));
    }, [tasks, newTask, complete])

    
    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    }

   const handleEnterPress = (e) =>{
    if (e.key == 'Enter'){
        addTask()
    }
   } 

    function addTask() {if (newTask.trim() !== '') {
        setTasks( t => [...t, newTask]);
        setNewTask('');}


    }
    function Completed(indexs, index){
        setComplete(c => [...c, indexs]);
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks)
        
        
    }

     function abandonTask(index) {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    }

    function deleteTask(index) {
        const updatedTasks = complete.filter((_, i) => i !== index);
        setComplete(updatedTasks);
    }

    
    return (
        <div className="todolist-wrapper">
            <h1>To Do List</h1>
            <div className='input-wrapper'>
                <input type="text" placeholder='Enter a text'
                value={newTask}
                onChange={handleInputChange}
                onKeyDown={handleEnterPress} />

                <button className='add-button' onClick={addTask}>
                    Add Task
                </button>
            </div>

            <h1>Task to complete</h1>

            <ol>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <span className='text'>{task}</span>
                        <div className='actions'>
                            <input type="checkbox" name="" id="" />
                            <button style={{backgroundColor: 'gray'}} onClick={() => abandonTask(index)}>Abandon</button>
                            <button style={{backgroundColor: 'green'}} onClick={() => Completed(task, index)}>Complete</button>
                        </div>
                    </li>
                ))}
            </ol>
            {/* Add your input, button, and list rendering here */}


            <h1>Completed Tasks</h1>

            <ol>
                {complete.map((completed, index) => (
                    <li key={index}>
                        <span className='text'>{completed}</span>
                        <div className='actions'>
                            <input type="checkbox" name="" id="" />
                            <button onClick={() => deleteTask(index)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ol>
            {/* Add your input, button, and list rendering here */}
        </div>
    );
}

export default Todolist;