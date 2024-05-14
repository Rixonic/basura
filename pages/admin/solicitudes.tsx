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
import { IconButton } from '@mui/material';

const EquipmentsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImageDialog = (image) => {
      setSelectedImage(image);
    };
  
    const closeImageDialog = () => {
      setSelectedImage(null);
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
        <TableContainer component={Paper}>
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
            <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tickets.map((row) => (
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
            <TableCell align="right">
                  {row.images && row.images.length > 0  && (
                    <IconButton onClick={() => openImageDialog(row.images[0])}  color="primary">
                      <ImageIcon/>
                    </IconButton>
                  )}
                </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <Dialog open={selectedImage !== null} onClose={closeImageDialog}>
        <DialogTitle>Imagen</DialogTitle>
        <DialogContent>
          {selectedImage && <img src={selectedImage} alt="Imagen" style={{ maxWidth: '100%' }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImageDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </ShopLayout>


  )
}


export default EquipmentsPage;