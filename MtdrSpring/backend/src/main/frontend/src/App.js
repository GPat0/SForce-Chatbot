import React, { useState, useEffect } from 'react';
import { CircularProgress, TableBody, Table, TableRow, TableCell, TableContainer, Paper, Typography } from '@mui/material';
import Moment from 'react-moment';

function App() {
    const [isLoading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]); // State for projects
    const [tasks, setTasks] = useState([]); // State for tasks
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/proyectos'),  // Endpoint for Projects
            fetch('/api/tareas')     // Endpoint for Tasks
        ]).then(async ([responseProjects, responseTasks]) => {
            if (!responseProjects.ok || !responseTasks.ok) {
                throw new Error('Failed to fetch data');
            }
            const projectsResult = await responseProjects.json();
            const tasksResult = await responseTasks.json();
            setProjects(projectsResult);
            setTasks(tasksResult);
            setLoading(false);
        }).catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    return (
        <div className="App">
            <Typography variant="h4" component="h1" gutterBottom>
                Project and Task Management
            </Typography>
            {error && <Typography color="error">Error: {error.message}</Typography>}
            {isLoading ? <CircularProgress /> : (
                <div id="maincontent">
                    <Typography variant="h6" gutterBottom>
                        Projects
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                {projects.map((project) => (
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h6" style={{ marginTop: 20 }} gutterBottom>
                        Tasks
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>Description: {task.descripcion}</TableCell>
                                        <TableCell>Status: {task.estatus}</TableCell>
                                        <TableCell>Due Date: <Moment format="YYYY-MM-DD">{task.fechaFinalizacion}</Moment></TableCell>
                                        <TableCell>Quality Score: {task.puntuacionCalidad}</TableCell>
                                        <TableCell>Efficiency: {task.eficienciaTarea}%</TableCell>
                                        <TableCell>Productivity: {task.productividadTarea}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
}

export default App;
