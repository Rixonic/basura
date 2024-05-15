import React, { useContext, HTMLAttributes, HTMLProps, useState, useEffect, useRef, ChangeEvent } from 'react'
import { ShopLayout } from '../components/layouts'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField, Stack, FormControl, Grid, CardMedia, Card, CardActions, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { UploadOutlined } from '@mui/icons-material';
import { tesloApi } from '../api';


type FormData = {
  //_id: string;
  email: string;
  name: string;
  description: string;
  sector: string;
  subSector: string;
  priority: string;
  images: string[];
};



const EquipmentsPage = () => {
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState("Ups!");
  const [response, setResponse] = React.useState("Todo listo!");
  const [activeStep, setActiveStep] = React.useState(0);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      images: []
    }
  });
  const [selectedValue, setSelectedValue] = React.useState('BAJO');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      const uploadPromises = Array.from(target.files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await tesloApi.post<{ message: string }>(
          "/admin/upload",
          formData
        );
        return data.message;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setValue("images", [...getValues("images"), ...uploadedImages], {
        shouldValidate: true,
      });
    } catch (error) {
      console.log({ error });
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handleNext = () => {
    if (activeStep === 0) {
      const isValid = getValues("name") && getValues("email");
      if (!isValid) {
        setMessage("Ingrese un nombre o un mail valido")
        setOpen(true)
        return; 
      }
    } else if (activeStep === 1) {
      const isValid = getValues("sector"); 
      if (!isValid) {
        setMessage("Por favor, seleccione un sector del listado")
        setOpen(true)
        return; 
      }

      const isValid2 = getValues("subSector");
      if (!isValid2) {
        setMessage("Por favor, especifique el lugar dentro del sector")
        setOpen(true)
        return;
      }
    } else if (activeStep === 2) {
      const isValid = getValues("description");
      if (!isValid) {
        setMessage("Por favor, indique la descripcion de su problema")
        setOpen(true)
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const onDeleteImage = (image: string) => {
    setValue(
      "images",
      getValues("images").filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  const onRegisterForm = async (data: FormData) => {
    data.priority = selectedValue
    setUploading(true)
    try {
      const response = await axios.post('/api/tickets', data);
      console.log(response.data.message)
      setResponse(response.data.message)
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setResponse("Tuvimos un problema y su solicitud no fue creada")
    }
    finally{
      setUploading(false)
    }

  }


  const steps = [
    {
      label: 'Ingrese sus datos',
      description: (
        <Stack direction="column" spacing={2}>
          <TextField
            label="Nombre"
            variant="filled"
            fullWidth
            required
            {...register('name', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
          <TextField
            label="Mail"
            variant="filled"
            fullWidth
            required
            {...register('email', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
        </Stack>
      ),
    },
    {
      label: 'Servicio solicitante',
      description: (
        <Stack direction="column" spacing={2}>
          <TextField
            type="text"
            label="Sector"
            variant="filled"
            fullWidth
            select
            defaultValue=""
            required
            {...register('sector', {
              required: 'Este campo es requerido'
            })}
          >
            <MenuItem value="NEONATOLOGIA" > Neonatologia </MenuItem>
            <MenuItem value="UNIDAD CORONARIA" > Unidad Coronaria </MenuItem>
            <MenuItem value="TERAPIA INTENSIVA" > Terapia Intensiva </MenuItem>
            <MenuItem value="CUIDADOS INTERMEDIOS" > Cuidados Intermedios </MenuItem>
            <MenuItem value="CUIDADOS MINIMOS/PEDIATRIA" > Cuidados Minimos/Pediatria </MenuItem>
            <MenuItem value="MATERNIDAD" > Maternidad </MenuItem>
            <MenuItem value="ESTERILIZACION" > Esterilizacion </MenuItem>
            <MenuItem value="PARTOS" > Partos </MenuItem>
            <MenuItem value="QUIROFANOS" > Quirofanos </MenuItem>
            <MenuItem value="ANATOMIA PATOLOGICA" > Anatomia Patologica </MenuItem>
            <MenuItem value="HEMOTERAPIA" > Hemoterapia </MenuItem>
            <MenuItem value="LABORATORIO" > Laboratorio </MenuItem>
            <MenuItem value="KINESIOLOGIA" > Kinesiologia </MenuItem>
            <MenuItem value="DIAGNOSTICO POR IMAGENES" > Diagnostico por Imagenes </MenuItem>
            <MenuItem value="CONSULTORIOS EXTERNOS" > Consultorios Externos </MenuItem>
            <MenuItem value="GUARDIA ADULTOS" > Guardia Adultos </MenuItem>
            <MenuItem value="GUARDIAS" > Guardias </MenuItem>
            <MenuItem value="LAVADERO" > Lavadero </MenuItem>
            <MenuItem value="GENERAL" > General </MenuItem>
            <MenuItem value="OTROS" > Otros </MenuItem>
          </TextField>

          <TextField
            type="text"
            label="Sub Sector"
            variant="filled"
            fullWidth
            defaultValue=""
            {...register('subSector')}
          />
        </Stack>

      ),
    },
    {
      label: 'Descripcion',
      description: (
        <Stack direction="column" spacing={2}>
          <TextField
            label="Descripcion"
            variant="filled"
            fullWidth
            required
            {...register('description', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
        </Stack>
      ),
    },
    {
      label: 'Prioridad',
      description: (
        <Stack direction="row" spacing={2}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            <Radio
              checked={selectedValue === 'ALTO'}
              onChange={handleChange}
              value="ALTO"
              name="radio-buttons"
              inputProps={{ 'aria-label': 'A' }}
            />
            <Typography>Alto</Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            <Radio
              checked={selectedValue === 'MEDIO'}
              onChange={handleChange}
              aria-label='asdasd'
              value="MEDIO"
              name="radio-buttons"
              inputProps={{ 'aria-label': 'B' }}
            />
            <Typography>Medio</Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            <Radio
              checked={selectedValue === 'BAJO'}
              onChange={handleChange}
              value="BAJO"
              name="radio-buttons"
              inputProps={{ 'aria-label': 'B' }}
            />
            <Typography>Bajo</Typography>
          </Stack>

        </Stack>
      ),
    },
    {
      label: 'Imagen',
      description: (
        <Stack direction="column" spacing={2}>
          <Button
            color="secondary"
            fullWidth
            startIcon={<UploadOutlined />}
            sx={{ mb: 3 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Cargar imagen
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            //multiple
            accept="image/png, image/gif, image/jpeg"
            style={{ display: "none" }}
            onChange={onFilesSelected}
          />
          <Grid container spacing={2}>
            {getValues("images") && getValues("images").map((img) => (
              <Grid item xs={8} sm={8} key={img}>
                <Card>
                  <CardMedia
                    component="img"
                    className="fadeIn"
                    image={img}
                    alt={img}
                  />
                  <CardActions>
                    <Button
                      fullWidth
                      color="error"
                      onClick={() => onDeleteImage(img)}
                    >
                      Borrar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

            ))}
          </Grid>
          {
          }
        </Stack>
      ),
    },
  ];




  return (

    <ShopLayout
      title={'Inicio'}
      pageDescription={''}

    >
              <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={uploading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      <Box sx={{ maxWidth: 400 }}>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  {step.description}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {index === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Terminar
                        </Button>) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Continuar
                        </Button>)}

                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Atras
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </form>
        {activeStep === steps.length && !uploading && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>{response}</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Cargar nueva solicitud
            </Button>
          </Paper>
        )}
      </Box>

      <Snackbar
        anchorOrigin={{ vertical:"top", horizontal:"center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
    onClose={handleClose}
    severity="error"
    variant="filled"
    sx={{ width: '100%' }}
  >
    {message}
  </Alert>
  </Snackbar>
    </ShopLayout>


  )
}


export default EquipmentsPage;