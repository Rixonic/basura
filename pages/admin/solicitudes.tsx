import React, { useContext, HTMLAttributes, HTMLProps, useState, useEffect, useRef, ChangeEvent } from 'react'
import { ShopLayout } from '../../components/layouts'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ImageIcon from '@mui/icons-material/Image';
import { format } from 'date-fns'; // Importar la función format de date-fns
import { DialogContentText, Divider, IconButton, TablePagination, TextField } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import { ITicket } from '../../interfaces';
import { DateField, DatePicker, LocalizationProvider, TimeField, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

interface SelectedTicket {
  _id?: number;
  email: string;
  name: string;
  description: string;
  sector: string;
  subSector: string;
  priority: string;
  images:string[];
  reciever: string;
  dateRecieved: Date;
  workHours: Date; 
  executer: string;
  status: string;
  materials: string;
  comments: string;
}


const EquipmentsPage = () => {
  const [open, setOpen] = React.useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openImageDialog = (image) => {
    setSelectedImage(image);
  };

  const closeImageDialog = () => {
    setSelectedImage(null);
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SelectedTicket>({
    _id: 0,
    email: '',
    name: '',
    description: '',
    sector: '',
    subSector: '',
    priority: '',
    images: [],
    reciever: '',
    dateRecieved: null,
    workHours: null,
    executer: '',
    status: '',
    materials: '',
    comments: '',

  });

  const handleOpenEditDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleTimeFieldChange = (e) => {
    console.log(e)
    setSelectedTicket((prevFields) => ({
      ...prevFields,
      workHours: e
    }));
  };

  const handleDateFieldChange = (e) => {
    console.log(e)
    setSelectedTicket((prevFields) => ({
      ...prevFields,
      dateRecieved: e
    }));
  };

  const handleFieldChange = (e) => {
    console.log(e)
    const { name, value } = e.target;
    setSelectedTicket((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      console.log(selectedTicket)
      const response = await axios.put('/api/tickets', selectedTicket);
      //setTickets(response.data);
      fetchTickets();
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleConfigChange = async (newEmail: string) => {
    try {
      const response = await axios.put("/api/config", { parameter: "MAIL", value: newEmail });
      setOpen(false);
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };
  const fetchTickets = async () => {
    try {
      const response = await axios.get('/api/tickets');
      setTickets(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/tickets');
        setTickets(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  return (

    <ShopLayout
      title={'Solicitudes'}
      pageDescription={''}

    >
      <IconButton aria-label="delete" color="primary" onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>

      <Paper sx={{ width: '100%' }}>
        <TableContainer >
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">ID</TableCell>
                <TableCell align="right">Mail</TableCell>
                <TableCell align="right">Nombre</TableCell>
                <TableCell align="right">Prioridad</TableCell>
                <TableCell align="right">Descripcion</TableCell>
                <TableCell align="right">Sector</TableCell>
                <TableCell align="right">Sub Sector</TableCell>
                <TableCell align="right">Creado el</TableCell>
                <TableCell align="right">Mail</TableCell>
                <TableCell align="right">Nombre</TableCell>
                <TableCell align="right">Prioridad</TableCell>
                <TableCell align="right">Descripcion</TableCell>
                <TableCell align="right">Sector</TableCell>
                <TableCell align="right">Sub Sector</TableCell>
                <TableCell align="right">Creado el</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row._id}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.priority}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">{row.sector}</TableCell>
                  <TableCell align="right">{row.subSector}</TableCell>
                  <TableCell align="right">{format(new Date(row.createdAt), 'dd/MM/yyyy hh:mm')}</TableCell>
                  <TableCell align="right">{row.dateRecieved}</TableCell>
                  <TableCell align="right">{row.reciever}</TableCell>
                  <TableCell align="right">{row.executer}</TableCell>
                  <TableCell align="right">{format(new Date(row.workHours), 'hh:mm')}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.materials}</TableCell>
                  <TableCell align="right">{row.comments}</TableCell>
                  <TableCell align="right">
                    {row.images && row.images.length > 0 && (
                      <IconButton onClick={() => openImageDialog(row.images[0])} color="primary">
                        <ImageIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEditDialog(row)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>


      <Dialog open={selectedImage !== null} onClose={closeImageDialog}>
        <DialogTitle>Imagen</DialogTitle>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Imagen" style={{ maxWidth: '100%' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            handleConfigChange(email);
            setOpen(false);
          },
        }}
      >
        <DialogTitle>Configuracion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cambie el mail a donde se envian las OT generadas
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Correo Electronico"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">Cambiar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Ticket</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Responsable"
            name="executer"
            value={selectedTicket.executer}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Recepcionado"
            name="reciever"
            value={selectedTicket.reciever}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Estado"
            name="status"
            value={selectedTicket.status}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Observaciones"
            name="comments"
            value={selectedTicket.comments}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Materiales"
            name="materials"
            value={selectedTicket.materials}
            onChange={handleFieldChange}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker 
              label="Fecha recepcion" 
              name="dateRecieved" 
              value={selectedTicket.dateRecieved}
              onChange={handleDateFieldChange}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} >
            <TimeField
              label="Horas trabajadas"
              name="workHours"
              value={selectedTicket.workHours}
              onChange={ handleTimeFieldChange}
              format="HH:mm"
            />
          </LocalizationProvider>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button onClick={handleSaveChanges}>Guardar</Button>
        </DialogActions>
      </Dialog>


    </ShopLayout>





  )
}


export default EquipmentsPage;