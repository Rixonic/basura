import React, { useContext, HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
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
import { FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField } from '@mui/material';
import axios from 'axios';


type FormData = {
  //_id: string;
  email: string;
  name: string;
  description: string;
  sector: string;
  priority: string;
};



const EquipmentsPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const onRegisterForm = async (data: FormData) => {
    try {
      const response = await axios.post('https://s96xk5tt-4040.brs.devtunnels.ms/api/tickets', data);
      console.log(response.data);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }

  }


  const steps = [
    {
      label: 'Ingrese sus datos',
      description: (
        <>
          <TextField
            label="Nombre"
            variant="filled"
            fullWidth
            {...register('name', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
          <TextField
            label="Mail"
            variant="filled"
            fullWidth
            {...register('email', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
        </>
      ),
    },
    {
      label: 'Servicio solicitante',
      description: (
        <>
          <TextField
            type="text"
            label="Sector"
            variant="filled"
            fullWidth
            select
            defaultValue=""
            {...register('sector', {
              required: 'Este campo es requerido'
            })}
          >
            <MenuItem value="RRHH" > RRHH </MenuItem>
            <MenuItem value="UTI" > UTI </MenuItem>
            <MenuItem value="NEO" > NEO </MenuItem>
            <MenuItem value="IMAGENES" > IMAGENES </MenuItem>
            <MenuItem value="SISTEMAS" > SISTEMAS </MenuItem>
          </TextField>
        </>
      ),
    },
    {
      label: 'Descripcion',
      description: (
        <>
          <TextField
            label="Nombre"
            variant="filled"
            fullWidth
            {...register('description', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          />
        </>
      ),
    },
    {
      label: 'Prioridad',
      description: (
        <>
          <FormLabel id="demo-row-radio-buttons-group-label">Prioridad</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            {...register('priority', {
              required: 'Este campo es requerido',
              minLength: { value: 2, message: 'Mínimo 2 caracteres' }
            })}
          >
            <FormControlLabel value="ALTO" control={<Radio />} label="Alto" />
            <FormControlLabel value="MEDIO" control={<Radio />} label="Medio" />
            <FormControlLabel value="BAJO" control={<Radio />} label="Bajo" />
          </RadioGroup>
        </>
      ),
    },
  ];




  return (

    <ShopLayout
      title={'Inicio'}
      pageDescription={''}

    >
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
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Su solicitud a sido creada</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Cargar nueva solicitud
            </Button>
          </Paper>
        )}
      </Box>


    </ShopLayout>


  )
}


export default EquipmentsPage;