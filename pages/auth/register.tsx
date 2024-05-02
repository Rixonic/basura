import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { signIn, getSession } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Button, Chip, Grid, Link, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { validLocations } from '../../utils/validLocations';
import axios from 'axios';


type FormData = {
    _id: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    role: string;
    locations: string[];
    sede: string[];
    sector: string;
};

const roles = [
    {
      value: 'TECNICO',
      label: 'Tecnico',
    },
    {
      value: 'SUPERVISOR',
      label: 'Supervisor',
    },
    {
      value: 'COORDINADOR',
      label: 'Coordinador',
    },
    {
      value: 'JEFE DE DEPARTARMENTO',
      label: 'Jefe de departamento',
    },
  ];

const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);


    const [personName, setPersonName] = useState<string[]>([]);
    const [sede, setSede] = useState<string[]>([]);


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    //const onRegisterForm = async ({ name, email, password }: FormData) => {
    const onRegisterForm = async (data: FormData) => {
        data.locations = personName
        data.sede = sede
        console.log(data)
        setShowError(false);

        //const { hasError, message } = await registerUser(data.name, data.email, data.password);
        await axios.post("/api/user/register",data)

        /*if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 3000);
            return;
        }*/

        // Todo: navegar a la pantalla que el usuario estaba
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        //await signIn('credentials', { data.email, data.password });

    }

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleSedeChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setSede(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>
                            <Chip
                                label="No reconocemos ese usuario / contraseña"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                label="Usuario"
                                variant="filled"
                                fullWidth
                                {...register('username', {
                                    required: 'Este campo es requerido'

                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                label="Mail"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido'

                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type='password'
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                            variant="filled"
                                fullWidth
                                multiple
                                value={personName}
                                onChange={handleChange}
                                input={<OutlinedInput label="Name" />}
                            >
                                {validLocations.map((name) => (
                                    <MenuItem
                                        key={name.abreviation}
                                        value={name.value}
                                    >
                                        {name.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                        <Select
                            variant="filled"
                                fullWidth
                                multiple
                                value={sede}
                                onChange={handleSedeChange}
                                input={<OutlinedInput label="Name" />}
                            >
                                <MenuItem value={"RAMOS MEJIA"}>
                                    Ramos Mejia
                                </MenuItem>
                                <MenuItem value={"CASTELAR"}>
                                    Castelar
                                </MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                label="Sector"
                                variant="filled"
                                fullWidth
                                select
                                {...register('sector', {
                                    required: 'Este campo es requerido'

                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            >
                             {validLocations.map((name) => (
                                    <MenuItem
                                        key={name.abreviation}
                                        value={name.value}
                                    >
                                        {name.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                label="Rol"
                                select
                                variant="filled"
                                fullWidth
                                {...register('role', {
                                    required: 'Este campo es requerido'

                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}

                            >
                                {roles.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className='circular-btn'
                                size='large'
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>


                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session = await getSession({ req });
    // console.log({session});

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: {}
    }
}

export default RegisterPage