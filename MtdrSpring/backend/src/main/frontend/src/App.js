import React, { useState, useEffect } from 'react';
import NewItem from './NewItem';
import API_LIST from './API';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TableBody, CircularProgress } from '@mui/material';
import Moment from 'react-moment';

function App() {
    const [isLoading, setLoading] = useState(false);
    const [isInserting, setInserting] = useState(false);
    const [items, setItems] = useState([]);
    const [projects, setProjects] = useState([]); // State for projects
    const [tasks, setTasks] = useState([]); // State for tasks
    const [error, setError] = useState();

    function deleteItem(deleteId) {
      fetch(API_LIST+"/"+deleteId, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(
        (result) => {
          const remainingItems = items.filter(item => item.id !== deleteId);
          setItems(remainingItems);
        },
        (error) => {
          setError(error);
        }
      );
    }
    function toggleDone(event, id, description, done) {
      event.preventDefault();
      modifyItem(id, description, done).then(
        (result) => { reloadOneIteam(id); },
        (error) => { setError(error); }
      );
    }
    function reloadOneIteam(id){
      fetch(API_LIST+"/"+id)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          (result) => {
            const items2 = items.map(
              x => (x.id === id ? {
                 ...x,
                 'description':result.description,
                 'done': result.done
                } : x));
            setItems(items2);
          },
          (error) => {
            setError(error);
          });
    }
    function modifyItem(id, description, done) {
      var data = {"description": description, "done": done};
      return fetch(API_LIST+"/"+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      });
    }
    useEffect(() => {
      setLoading(true);
      Promise.all([
        fetch(API_LIST),  // Existing endpoint for ToDo items
        fetch('/api/proyectos'),  // New endpoint for Projects
        fetch('/api/tareas')  // New endpoint for Tasks
      ]).then(async ([responseItems, responseProjects, responseTasks]) => {
        if (!responseItems.ok || !responseProjects.ok || !responseTasks.ok) {
          throw new Error('Something went wrong ...');
        }
        const itemsResult = await responseItems.json();
        const projectsResult = await responseProjects.json();
        const tasksResult = await responseTasks.json();
        setLoading(false);
        setItems(itemsResult);
        setProjects(projectsResult);
        setTasks(tasksResult);
      }).catch((error) => {
        setLoading(false);
        setError(error);
      });
    }, []);

    function addItem(text){
      console.log("addItem("+text+")")
      setInserting(true);
      var data = {};
      console.log(data);
      data.description = text;
      fetch(API_LIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then((response) => {
        console.log(response);
        console.log();
        console.log(response.headers.location);
        if (response.ok) {
          return response;
        } else {
          throw new Error('Something went wrong ...');
        }
      }).then(
        (result) => {
          var id = result.headers.get('location');
          var newItem = {"id": id, "description": text}
          setItems([newItem, ...items]);
          setInserting(false);
        },
        (error) => {
          setInserting(false);
          setError(error);
        }
      );
    }
    return (
      <div className="App">
        <h1>MY TODO LIST</h1>
        <NewItem addItem={addItem} isInserting={isInserting}/>
        { error &&
          <p>Error: {error.message}</p>
        }
        { isLoading && <CircularProgress /> }
        { !isLoading &&
        <div id="maincontent">
          {/* Existing tables and UI for ToDo items */}
          <h2>Projects</h2>
          <table className="itemlist">
            <TableBody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td><Moment format="YYYY-MM-DD">{project.startDate}</Moment></td>
                <td><Moment format="YYYY-MM-DD">{project.endDate}</Moment></td>
              </tr>
            ))}
            </TableBody>
          </table>

          <h2>Tasks</h2>
          <table className="itemlist">
            <TableBody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.description}</td>
                <td><Moment format="YYYY-MM-DD">{task.dueDate}</Moment></td>
                <td>{task.status}</td>
              </tr>
            ))}
            </TableBody>
          </table>
        </div>
        }
      </div>
    );
}
export default App;