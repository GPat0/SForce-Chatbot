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
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell><Moment format="YYYY-MM-DD">{project.startDate}</Moment></TableCell>
                                        <TableCell><Moment format="YYYY-MM-DD">{project.endDate}</Moment></TableCell>
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
                                        <TableCell>{task.description}</TableCell>
                                        <TableCell><Moment format="YYYY-MM-DD">{task.dueDate}</Moment></TableCell>
                                        <TableCell>{task.status}</TableCell>
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
