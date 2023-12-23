import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdAddCircle } from "react-icons/io";
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function TodoCompo() {
    const [list, setList] = useState([]);
    const [isEdit, setEdit] = useState({ id: null, title: "", isediting: false });
    const [sortBy, setSortBy] = useState('all');
    const [sortByTitle, setSortByTitle] = useState('default');
    const [addnew, setadd] = useState(false);
    const [newTask, setNewTask] = useState('');
    // const [isCompleted, setstatus] = useState(false);

    const handleComplete = (taskid) => {
        setList((prevList) =>
            prevList.map((item) =>
                item.id === taskid ? { ...item, completed: true } : item
            )
        )
    }
    const handleundo = (taskid) => {
        setList((prevList) =>
            prevList.map((item) =>
                item.id === taskid ? { ...item, completed: false } : item
            )
        )
    }
    const handleupdate = (taskid) => {
        setList((prevList) =>
            prevList.map((item) =>
                item.id === taskid ? { ...item, completed: !item.completed } : item
            )
        )
    }
    const handleDelete = (taskId) => {
        setList((prevList) => prevList.filter((item) => item.id !== taskId));
    };
    const handleEdit = (taskid, tasktitle) => {
        setEdit({ id: taskid, title: tasktitle, isediting: true });
    }
    const handlesubmit = (taskid, newTitle) => {
        if (newTitle.length > 0) {
            setList((prevList) =>
                prevList.map((item) =>
                    item.id === taskid ? { ...item, title: newTitle } : item
                )
            );
            setEdit({ id: null, title: '', isEditing: false });
        }
        else {
            alert("ENter Valid Data!")
        }
    }
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };
    const handleaddnew = () => {
        if (newTask.length > 0) {
            const newTaskItem = {
                id: list.length > 0 ? list[list.length - 1].id + 1 : 1, // Incrementing order
                title: newTask,
                completed: false,
            };

            setList((prevList) => [newTaskItem, ...prevList]);

            setNewTask('');
            setadd(false);
        }
        else {
            alert("Enter valid data!")
        }

    }
    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/users/1/todos")
                console.log(response);
                setList(response.data);
            }
            catch (err) {
                console.log("Error:", err);
            }
        }
        fetchList();
    }, [])
    const getFilteredList = () => {
        let filteredList = [...list];
        switch (sortBy) {
            case 'completed':
                filteredList = list.filter((item) => item.completed);
                break;
            case 'uncompleted':
                filteredList = list.filter((item) => !item.completed);
                break;
            default:
                break;
        }
        filteredList.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            // return sortByTitle === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
            if (sortByTitle === "asc") {
                return titleA.localeCompare(titleB)
            }
            else if (sortByTitle === "desc") {
                return titleB.localeCompare(titleA)
            }
            return 0;
        });

        return filteredList;
    };
    const filteredList = getFilteredList();
    return (
        <div className='cardParent' >
            <h1><span className='strike'>ToDO</span> - LIST</h1>
            <div className='flexy'>
                <h2 className='cursor' onClick={() => setadd(true)}><IoMdAddCircle size={"1.2em"} /></h2>
                <h2 className='cursor' onClick={() => setadd(true)}>Add new Task</h2>
            </div>
            {addnew && (
                <div className='textboxadd'>
                    <input placeholder='Enter New Task' value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <button onClick={() => handleaddnew()}>ADD</button>
                </div>
            )}
            <div className='sortdiv'>
                <div>
                    <span className='textsort'>Filter by:</span>
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value='all'>All</option>
                        <option value='completed'>Completed</option>
                        <option value='uncompleted'>Uncompleted</option>
                    </select>
                </div>
                <div>
                    <span className='textsort'>Sort by title:</span>
                    <select value={sortByTitle} onChange={(e) => setSortByTitle(e.target.value)}>
                        <option value="default">default</option>
                        <option value='asc'>A-Z</option>
                        <option value='desc'>Z-A</option>
                    </select>
                </div>
            </div>
            <div className='draggablediv'>
                <div className='dropdiv'>
                    {filteredList.map((item, index) => {
                        return (
                            <div className='card' key={index}>
                                <div className='title'>
                                    {isEdit.isediting && isEdit.id === item.id ? (
                                        <h4>
                                            <input value={isEdit.title} onChange={(e) => setEdit({ ...isEdit, title: e.target.value })} />
                                            <button onClick={() => handlesubmit(item.id, isEdit.title)}>Submit</button>
                                        </h4>
                                    ) :
                                        <h4 style={{ color: item.completed ? "red" : "green", textDecoration: item.completed ? "line-through" : "", cursor: "pointer" }} onClick={() => handleupdate(item.id)}>{item.title}</h4>
                                    }
                                </div>
                                <div className='buttons'>
                                    <h4>
                                        {item.completed === false && (
                                            <button onClick={() => handleEdit(item.id, item.title)}>Edit</button>
                                        )}
                                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                                        {item.completed ? (
                                            <button onClick={() => handleundo(item.id)}>Undo</button>
                                        ) : (
                                            <button onClick={() => handleComplete(item.id)}>Complete</button>
                                        )}
                                    </h4>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default TodoCompo