
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import React, { useEffect } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

function Todolist() {

    const [tasks, setTasks] = React.useState(() => {
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

    const [CheckedItemsTask, setCheckedItemsTask] = React.useState(() => {
        const saved = localStorage.getItem('appState');
        return saved ? JSON.parse(saved).complete : ({});
    });

    const [CheckedItemsComplete, setCheckedItemsComplete] = React.useState(() => {
        const saved = localStorage.getItem('appState');
        return saved ? JSON.parse(saved).complete : ({});
    });

    useEffect(() => {
        localStorage.setItem('appState', JSON.stringify({ tasks, newTask, complete }));
    }, [tasks, newTask, complete])


    const handleCheckboxChangeTasks = (index) => {
        setCheckedItemsTask(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleCheckboxChangeComplete = (index) => {
        setCheckedItemsComplete(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleCheckDelete = () => {
        setComplete(complete.filter((_, i) => !CheckedItemsComplete[i]));
        setCheckedItemsComplete({});
    }

    const handleCheckAbandon = () => {
        setTasks(tasks.filter((_, i) => !CheckedItemsTask[i]));
        setCheckedItemsTask({});
    }

    const handleCheckComplete = () => {
        setTasks(tasks.filter((_, i) => !CheckedItemsComplete[i]));
        setComplete(prev => [...prev, ...tasks.filter((_, i) => CheckedItemsComplete[i])]);
        setCheckedItemsComplete({});
    }



    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    }

    const handleEnterPress = (e) => {
        if (e.key == 'Enter') {
            addTask()
        }
    }

    function addTask() {
        if (newTask.trim() !== '') {
            setTasks(t => [...t, newTask]);
            setNewTask('');
        }


    }
    function Completed(indexs, index) {
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

            <div className="tasks">

                <div className="task">

                    <div className="heading">
                        <h1>Task to complete</h1>
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
                                    <input type="checkbox" checked={CheckedItemsTask[index] || false} onChange={() => handleCheckboxChangeTasks(index)} name="" id="" />
                                    <button style={{ backgroundColor: 'gray' }} onClick={() => abandonTask(index)}>Abandon</button>
                                    <button style={{ backgroundColor: 'green' }} onClick={() => Completed(task, index)}>Complete</button>
                                </div>
                            </li>
                        ))}
                    </ol>
                    {/* Add your input, button, and list rendering here */}
                </div>

                <div className="complete">
                    <div className="heading">
                        <h1>Completed Tasks</h1>
                        <button onClick={handleCheckDelete}><FontAwesomeIcon icon={faTrash}/></button>
                    </div>
                    <ol>
                        {complete.map((completed, index) => (
                            <li key={index}>
                                <span className='text'>{completed}</span>
                                <div className='actions'>
                                    <input type="checkbox" checked={CheckedItemsComplete[index] || false} onChange={() => handleCheckboxChangeComplete(index)} name="" id="" />
                                    <button onClick={() => deleteTask(index)}><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            </li>
                        ))}
                    </ol>
                    {/* Add your input, button, and list rendering here */}
                </div>
            </div>
        </div>
    );
}

export default Todolist;