import React, { useState, useEffect } from 'react';
import { CircularProgress, TableBody, Table, TableRow, TableCell, TableContainer, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Moment from 'react-moment';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function App() {
    const [isLoading, setLoading] = useState(false);
    const [tareas, setTareas] = useState([]);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTarea, setCurrentTarea] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('/api/tareas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch tareas');
                }
                return response.json();
            })
            .then(data => {
                setTareas(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleOpenDialog = (tarea = null) => {
        setCurrentTarea(tarea);
        setOpenDialog(true);
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
        const url = '/api/tareas';
        const method = currentTarea && currentTarea.id ? 'PUT' : 'POST';
        const id = currentTarea && currentTarea.id ? `/${currentTarea.id}` : '';

        fetch(`${url}${id}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentTarea),
        })
            .then(response => response.json())
            .then(data => {
                if (method === 'POST') {
                    setTareas([...tareas, data]);
                } else {
                    setTareas(tareas.map(t => t.id === data.id ? data : t));
                }
                handleCloseDialog();
            })
            .catch(error => setError(error.message));
    };

    const handleDelete = (id) => {
        fetch(`/api/tareas/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                setTareas(tareas.filter(t => t.id !== id));
                if (selectedTarea && selectedTarea.id === id) {
                    setSelectedTarea(null);
                }
            })
            .catch(error => setError(error.message));
    };

    const handleSelectTarea = (tarea) => {
        setSelectedTarea(tarea);
    };

    return (
        <div className="App" style={{ display: "flex", flexDirection: "column" }}>
            <header>
                <div className="logo" style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src="https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png"
                        alt="Oracle Logo"
                        style={{ width: "100px", height: "auto" }}
                    />
                </div>
                <h3>Oracle Todo App</h3>
            </header>

            <div style={{ display: "flex" }}>
                {/* Projects Section (Left) */}
                <aside className="projects" style={{ width: "20%", padding: "20px" }}>
                    {/* Project list would go here */}
                </aside>

                {/* Tasks List (Center) */}
                <main style={{ width: "60%", padding: "20px" }}>
                    <div id="TaskList">
                        <h3>Lista de Tareas</h3>
                        <Button
                            onClick={() => handleOpenDialog()}
                            variant="contained"
                            style={{ backgroundColor: "green", color: "white" }}
                            startIcon={<AddIcon />}
                        >
                            Agregar Nueva Tarea
                        </Button>
                        {error && <Typography color="error">{error}</Typography>}
                        {isLoading ? <CircularProgress /> : (
                            <TableContainer component={Paper}>
                                <Table aria-label="Tabla de Tareas">
                                    <TableBody>
                                        {tareas.map(tarea => (
                                            <TableRow key={tarea.id} onClick={() => handleSelectTarea(tarea)} style={{cursor: 'pointer'}}>
                                                <TableCell className="description">{tarea.descripcion}</TableCell>
                                                <TableCell>{tarea.estatus}</TableCell>
                                                <TableCell>
                                                    <Moment format="MMM Do hh:mm:ss">{tarea.fechaFinalizacion}</Moment>
                                                </TableCell>
                                                <TableCell>
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
                                                            handleDelete(tarea.id);
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                </main>

                {/* Task Details (Right) */}
                <aside className="taskDetails" style={{ width: "20%", padding: "20px" }}>
                    <h3>Detalles de la Tarea</h3>
                    {selectedTarea ? (
                        <div>
                            <p><strong>Descripción:</strong> {selectedTarea.descripcion}</p>
                            <p><strong>Estado:</strong> {selectedTarea.estatus}</p>
                            <p><strong>Fecha de Finalización:</strong> <Moment format="MMM Do YYYY, hh:mm:ss">{selectedTarea.fechaFinalizacion}</Moment></p>
                        </div>
                    ) : (
                        <p>Seleccione una tarea para ver sus detalles.</p>
                    )}
                </aside>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Detalles de la Tarea</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="descripcion"
                        label="Descripción de la Tarea"
                        type="text"
                        fullWidth
                        value={currentTarea?.descripcion || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="estatus"
                        label="Estado"
                        type="text"
                        fullWidth
                        value={currentTarea?.estatus || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="fechaFinalizacion"
                        label="Fecha de Finalización"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={currentTarea?.fechaFinalizacion || ''}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default App;