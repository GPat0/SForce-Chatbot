import React, { useState, useEffect } from 'react';
import { CircularProgress, TableBody, Table, TableRow, TableCell, TableContainer, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Moment from 'react-moment';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from '@mui/icons-material/Logout';

function App() {
    const [isLoading, setLoading] = useState(true);
    const [activeTareas, setActiveTareas] = useState([]);
    const [completedTareas, setCompletedTareas] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTarea, setCurrentTarea] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const isTaskCompleted = (status) => status.toLowerCase() === 'done';

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        fetch('/api/user/info', {
            credentials: 'include',
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            }
        })
            .then(response => response.json())
            .then(data => {
                setIsAuthenticated(data.isAuthenticated);
                setUserRole(data.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER');
                if (data.isAuthenticated) {
                    fetchData();
                } else {
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Error checking auth status:', error);
                setIsAuthenticated(false);
                setLoading(false);
            });
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchData = () => {
        Promise.all([
            fetch('/api/tareas', {
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                }
            }).then(response => response.json()),
            fetch('/api/proyectos', {
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
                }
            }).then(response => response.json())
        ])
            .then(([tareasData, projectsData]) => {
                const active = tareasData.filter(tarea => !isTaskCompleted(tarea.estatus));
                const completed = tareasData.filter(tarea => isTaskCompleted(tarea.estatus));
                setActiveTareas(active);
                setCompletedTareas(completed);
                setProjects(projectsData);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    const handleOpenDialog = (tarea = null) => {
        if (userRole === 'ADMIN') {
            setCurrentTarea(tarea || { proyectoId: '' });
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentTarea(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCurrentTarea({ ...currentTarea, [name]: value });
    };

    const handleSubmit = () => {
        if (userRole !== 'ADMIN') return;

        const url = '/api/tareas';
        const method = currentTarea && currentTarea.id ? 'PUT' : 'POST';
        const id = currentTarea && currentTarea.id ? `/${currentTarea.id}` : '';

        fetch(`${url}${id}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            body: JSON.stringify(currentTarea),
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                const isCompleted = isTaskCompleted(data.estatus);
                if (method === 'POST') {
                    if (isCompleted) {
                        setCompletedTareas(prev => [...prev, data]);
                    } else {
                        setActiveTareas(prev => [...prev, data]);
                    }
                } else {
                    setActiveTareas(prev => prev.filter(t => t.id !== data.id));
                    setCompletedTareas(prev => prev.filter(t => t.id !== data.id));
                    if (isCompleted) {
                        setCompletedTareas(prev => [...prev, data]);
                    } else {
                        setActiveTareas(prev => [...prev, data]);
                    }
                }
                handleCloseDialog();
            })
            .catch(error => setError(error.message));
    };

    const handleDelete = (id, isCompleted) => {
        if (userRole !== 'ADMIN') return;

        fetch(`/api/tareas/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            credentials: 'include'
        })
            .then(() => {
                if (isCompleted) {
                    setCompletedTareas(prev => prev.filter(t => t.id !== id));
                } else {
                    setActiveTareas(prev => prev.filter(t => t.id !== id));
                }
                if (selectedTarea && selectedTarea.id === id) {
                    setSelectedTarea(null);
                }
            })
            .catch(error => setError(error.message));
    };

    const handleSelectTarea = (tarea) => {
        setSelectedTarea(tarea);
    };

    const renderTaskTable = (tareas, isCompleted) => (
        <TableContainer component={Paper}>
            <Table aria-label={`Tabla de Tareas ${isCompleted ? 'Completadas' : 'Activas'}`}>
                <TableBody>
                    {tareas.map(tarea => (
                        <TableRow key={tarea.id} onClick={() => handleSelectTarea(tarea)} style={{cursor: 'pointer'}}>
                            <TableCell style={{width: '30%'}}>{tarea.descripcion}</TableCell>
                            <TableCell style={{width: '20%'}}>{tarea.estatus}</TableCell>
                            <TableCell style={{width: '20%'}}>
                                {projects.find(p => p.id === tarea.proyectoId)?.nombre || 'N/A'}
                            </TableCell>
                            <TableCell style={{width: '15%'}}>
                                <Moment format="MMM Do hh:mm:ss">{tarea.fechaFinalizacion}</Moment>
                            </TableCell>
                            {userRole === 'ADMIN' && (
                                <TableCell align="right" style={{width: '15%'}}>
                                    <Button
                                        variant="contained"
                                        className="DoneButton"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDialog(tarea);
                                        }}
                                        size="small"
                                        style={{
                                            backgroundColor: "green",
                                            color: "white",
                                            borderRadius: "12px",
                                            marginRight: "5px"
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className="delete"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(tarea.id, isCompleted);
                                        }}
                                        style={{
                                            backgroundColor: "red",
                                            color: "white",
                                            borderRadius: "12px"
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!isAuthenticated) {
        return <Typography>Please log in to access this page.</Typography>;
    }

    const handleLogout = () => {
        fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            }
        })
            .then(response => {
                if (response.ok) {
                    setIsAuthenticated(false);
                    setUserRole(null);
                    // Redirect to login page or show login required message
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                setError('Logout failed. Please try again.');
            });
    };

    return (
        <div className="App" style={{ display: "flex", flexDirection: "column"}}>
            <header>
                <div className="logo" style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src="https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png"
                        alt="Oracle Logo"
                        style={{ width: "100px", height: "auto" }}
                    />
                </div>
                <h3>Oracle Todo App</h3>
                <p>Logged in as: {userRole}</p>
            </header>

            <div style={{display: "flex", flex: 1}}>
                <aside className="projects" style={{width: "20%", padding: "20px"}}>
                    {/* Project list could go here if needed */}
                </aside>

                <main style={{width: "60%", padding: "20px"}}>
                    <div id="TaskList">
                        <h3>Lista de Tareas Activas</h3>
                        {userRole === 'ADMIN' && (
                            <Button
                                onClick={() => handleOpenDialog()}
                                variant="contained"
                                style={{backgroundColor: "green", color: "white", marginBottom: "20px"}}
                                startIcon={<AddIcon/>}
                            >
                                Agregar Nueva Tarea
                            </Button>
                        )}
                        {error && <Typography color="error">{error}</Typography>}
                        {renderTaskTable(activeTareas, false)}

                        <h3 style={{marginTop: "30px"}}>Lista de Tareas Completadas</h3>
                        {renderTaskTable(completedTareas, true)}
                    </div>
                </main>

                <aside className="taskDetails" style={{width: "20%", padding: "20px"}}>
                    <h3>Detalles de la Tarea</h3>
                    {selectedTarea ? (
                        <div>
                            <p><strong>Descripción:</strong> {selectedTarea.descripcion}</p>
                            <p><strong>Estado:</strong> {selectedTarea.estatus}</p>
                            <p>
                                <strong>Proyecto:</strong> {projects.find(p => p.id === selectedTarea.proyectoId)?.nombre || 'N/A'}
                            </p>
                            <p><strong>Tiempo Estimado:</strong> {selectedTarea.tiempoEstimado}</p>
                            <p><strong>Tiempo Real:</strong> {selectedTarea.tiempoReal}</p>
                            <p><strong>Puntuación Calidad:</strong> {selectedTarea.puntacionCalidad}</p>
                            <p><strong>Eficiencia:</strong> {selectedTarea.eficienciaTarea}</p>
                            <p><strong>Productividad:</strong> {selectedTarea.productividadTarea}</p>
                            <p><strong>Fecha de Finalización:</strong> <Moment
                                format="MMM Do YYYY, hh:mm:ss">{selectedTarea.fechaFinalizacion}</Moment></p>
                        </div>
                    ) : (
                        <p>Seleccione una tarea para ver sus detalles.</p>
                    )}
                </aside>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentTarea && currentTarea.id ? 'Editar Tarea' : 'Crear Nueva Tarea'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="descripcion"
                        label="Task Description"
                        type="text"
                        fullWidth
                        value={currentTarea?.descripcion || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="estatus"
                        label="Status"
                        type="text"
                        fullWidth
                        value={currentTarea?.estatus || ''}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="project-select-label">Project</InputLabel>
                        <Select
                            labelId="project-select-label"
                            id="project-select"
                            name="proyectoId"
                            value={currentTarea?.proyectoId || ''}
                            label="Project"
                            onChange={handleChange}
                        >
                            {projects.map((project) => (
                                <MenuItem key={project.id} value={project.id}>
                                    {project.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="tiempoEstimado"
                        label="Estimated Time"
                        type="number"
                        fullWidth
                        value={currentTarea?.tiempoEstimado || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="tiempoReal"
                        label="Actual Time"
                        type="number"
                        fullWidth
                        value={currentTarea?.tiempoReal || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="fechaFinalizacion"
                        label="Completion Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentTarea?.fechaFinalizacion || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="puntuacionCalidad"
                        label="Quality Score"
                        type="number"
                        fullWidth
                        value={currentTarea?.puntuacionCalidad || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="eficienciaTarea"
                        label="Task Efficiency"
                        type="number"
                        fullWidth
                        value={currentTarea?.eficienciaTarea || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="productividadTarea"
                        label="Task Productivity"
                        type="number"
                        fullWidth
                        value={currentTarea?.productividadTarea || ''}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </DialogActions>
            </Dialog>

            <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                startIcon={<LogoutIcon />}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000
                }}
            >
                Logout
            </Button>
        </div>
    );
}

export default App;