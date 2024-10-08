import React, { useState, useEffect } from 'react';
import { CircularProgress, TableBody, Table, TableRow, TableCell, TableContainer, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Moment from 'react-moment';

function App() {
    const [isLoading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);
    const [isProjectDialog, setIsProjectDialog] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/proyectos'),  // Endpoint for Projects
            fetch('/api/tareas')     // Endpoint for Tasks
        ]).then(async ([responseProjects, responseTasks]) => {
            if (!responseProjects.ok || !responseTasks.ok) {
                throw new Error('Failed to fetch data');
            }
            const projectsData = await responseProjects.json();
            const tasksData = await responseTasks.json();
            setProjects(projectsData);
            setTasks(tasksData);
            setLoading(false);
        }).catch(error => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    const handleOpenDialog = (project = null, task = null) => {
        setIsProjectDialog(!task); // Determine if this is for projects or tasks
        setCurrentProject(project);
        setCurrentTask(task);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentProject(null);
        setCurrentTask(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (isProjectDialog) {
            setCurrentProject({ ...currentProject, [name]: value });
        } else {
            setCurrentTask({ ...currentTask, [name]: value });
        }
    };

    const handleSubmit = () => {
        const url = isProjectDialog ? '/api/proyectos' : '/api/tareas';
        const method = (isProjectDialog ? currentProject : currentTask) ? 'PUT' : 'POST';
        const payload = isProjectDialog ? currentProject : currentTask;
        const id = payload && payload.id ? `/${payload.id}` : '';

        fetch(`${url}${id}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            if (method === 'POST') {
                if (isProjectDialog) {
                    setProjects([...projects, data]);
                } else {
                    setTasks([...tasks, data]);
                }
            } else {
                if (isProjectDialog) {
                    setProjects(projects.map(p => p.id === data.id ? data : p));
                } else {
                    setTasks(tasks.map(t => t.id === data.id ? data : t));
                }
            }
            handleCloseDialog();
        })
        .catch(error => setError(error.message));
    };

    const handleDelete = (id, isProject = true) => {
        const url = isProject ? '/api/proyectos' : '/api/tareas';
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            if (isProject) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                setTasks(tasks.filter(t => t.id !== id));
            }
        })
        .catch(error => setError(error.message));
    };

    return (
        <div className="App">
            <Typography variant="h4" component="h1" gutterBottom>
                Project and Task Management
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {isLoading ? <CircularProgress /> : (
                <div id="maincontent">
                    <Button onClick={() => handleOpenDialog()}>Add New Project</Button>
                    <TableContainer component={Paper}>
                        <Table aria-label="Projects Table">
                            <TableBody>
                                {projects.map(project => (
                                    <TableRow key={project.id}>
                                        <TableCell>Name: {project.nombre}</TableCell>
                                        <TableCell>Status: {project.estatus}</TableCell>
                                        <TableCell>Start Date: <Moment format="YYYY-MM-DD">{project.fechaInicio}</Moment></TableCell>
                                        <TableCell>End Date: <Moment format="YYYY-MM-DD">{project.fechaFin}</Moment></TableCell>
                                        <TableCell>Tasks: {project.tareas.map(task => (
                                            <div key={task.id}>
                                                Task: {task.descripcion}, Status: {task.estatus}
                                            </div>
                                        ))}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleOpenDialog(project)}>Edit</Button>
                                            <Button onClick={() => handleDelete(project.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={() => handleOpenDialog(null, {})}>Add New Task</Button>
                    <TableContainer component={Paper}>
                        <Table aria-label="Tasks Table">
                            <TableBody>
                                {tasks.map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell>Description: {task.descripcion}</TableCell>
                                        <TableCell>Status: {task.estatus}</TableCell>
                                        <TableCell>Due Date: <Moment format="YYYY-MM-DD">{task.fechaFinalizacion}</Moment></TableCell>
                                        <TableCell>Quality Score: {task.puntuacionCalidad}</TableCell>
                                        <TableCell>Efficiency: {task.eficienciaTarea}%</TableCell>
                                        <TableCell>Productivity: {task.productividadTarea}%</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleOpenDialog(null, task)}>Edit</Button>
                                            <Button onClick={() => handleDelete(task.id, false)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                  </div>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>{isProjectDialog ? 'Project Details' : 'Task Details'}</DialogTitle>
    <DialogContent>
        {isProjectDialog ? (
            <>
                <TextField
                    autoFocus
                    margin="dense"
                    name="nombre"
                    label="Project Name"
                    type="text"
                    fullWidth
                    value={currentProject?.nombre || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="estatus"
                    label="Status"
                    type="text"
                    fullWidth
                    value={currentProject?.estatus || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="fechaInicio"
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={currentProject?.fechaInicio || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="fechaFin"
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={currentProject?.fechaFin || ''}
                    onChange={handleChange}
                />
            </>
        ) : (
            <>
                <TextField
                    autoFocus
                    margin="dense"
                    name="descripcion"
                    label="Task Description"
                    type="text"
                    fullWidth
                    value={currentTask?.descripcion || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="estatus"
                    label="Status"
                    type="text"
                    fullWidth
                    value={currentTask?.estatus || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="tiempoEstimado"
                    label="Estimated Time"
                    type="number"
                    fullWidth
                    value={currentTask?.tiempoEstimado || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="tiempoReal"
                    label="Actual Time"
                    type="number"
                    fullWidth
                    value={currentTask?.tiempoReal || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="fechaFinalizacion"
                    label="Completion Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={currentTask?.fechaFinalizacion || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="puntuacionCalidad"
                    label="Quality Score"
                    type="number"
                    fullWidth
                    value={currentTask?.puntuacionCalidad || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="eficienciaTarea"
                    label="Task Efficiency"
                    type="number"
                    fullWidth
                    value={currentTask?.eficienciaTarea || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="productividadTarea"
                    label="Task Productivity"
                    type="number"
                    fullWidth
                    value={currentTask?.productividadTarea || ''}
                    onChange={handleChange}
                />
            </>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
    </DialogActions>
</Dialog>

        </div>
    );
}

export default App;
