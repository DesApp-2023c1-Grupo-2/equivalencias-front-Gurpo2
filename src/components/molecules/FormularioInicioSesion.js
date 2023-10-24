import React, { useState } from 'react';
import { TituloBienvenida, Titulos } from '../atoms/Title/Titulos';
import {
    OlvidastePassword,
    OlvidastePasswordLink
} from '../atoms/OlvidastePassword';
import LineaSeparacion from '../atoms/LineaSeparacion';
import { InputMUI, ContenedorInputs } from '../atoms/Input/InputMUI';
import { BotonMUI } from '../atoms/Button/BotonMUI';
import { Grid, styled } from '@mui/material';
import { Formulario } from '../atoms/Formulario/Formulario';
import { useEffect } from 'react';
import { getLogin } from '../../services/usuario_service';
import bcrypt from 'bcryptjs';
import ResetPasswordModal from '../organisms/IniciarSesion/ResetPasswordModal';

const FormularioInicioSesion = () => {
    const [dni, setDni] = useState(null);
    const [password, setPassword] = useState('');
    const [usuario, setUsuario] = useState([null]);

    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        /*
        const fetchUsuariosData = async () => {
            const usuarios = await getUsuarios();

            setUsuarios(usuarios);
        };

        fetchUsuariosData();
        */
    }, []);

    const grabarUsuario = async (user) => {
        localStorage.setItem('dni', JSON.stringify(user.dni));
        localStorage.setItem('nombre', JSON.stringify(user.nombre));
        localStorage.setItem('apellido', JSON.stringify(user.apellido));
        localStorage.setItem('email', JSON.stringify(user.email));
        localStorage.setItem('discord', JSON.stringify(user.discord));
        localStorage.setItem('telefono', JSON.stringify(user.telefono));
        localStorage.setItem('rol', JSON.stringify(user.rol));
        localStorage.setItem('password', JSON.stringify('********'));
        localStorage.setItem('id', JSON.stringify(user.id));
    };

    const ingresarAplicacion = async (user) => {
        setUsuario(user);
        if (user.rol == 'alumno') {
            window.location.href = '/usuario/equivalencias';
        } else if (user.rol == 'directivo') {
            window.location.href = '/direccionDashboard';
        } else if (user.rol == 'superusuario') {
            window.location.href = '/direccionDashboard'; //superusuario/solicitudes direccion anterior
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(dni);

        getLogin(parseInt(dni))
            .then(function (loginBack) {
                // controlor de login y mensaje al usuario:
                console.log('login: ', loginBack);
                if (loginBack.status != 200) {
                    throw loginBack.message;
                }
                return loginBack.user;
            })
            .then(function (user) {
                // corroborar la contraseña:
                const mensajeError = 'Usuario o contraseña incorrectos';
                console.log('primer console: ', user);
                if (password != '') {
                    bcrypt.compare(
                        password,
                        user.password,
                        async function (err, isMatch) {
                            if (err || !isMatch) {
                                alert(mensajeError);
                            } else {
                                await grabarUsuario(user);

                                await ingresarAplicacion(user);
                            }
                        }
                    );
                } else {
                    throw 'Usuario o contraseña incorrectos';
                }
            })
            .catch(function (error) {
                return alert(error);
            });
    };

    return (
        <FormularioMain>
            <TituloBienvenida>
                <Titulos titulogrande="+true" titulomarginbottom component="h2">
                    ¡Bienvenido/a!
                </Titulos>
                <Titulos titulochico titulolight component="h2">
                    Iniciar sesión
                </Titulos>
            </TituloBienvenida>

            <Formulario sx={{ marginTop: '40px' }}>
                <form
                    action=""
                    onSubmit={handleSubmit}
                    style={{ height: '100%', textAlign: 'center' }}
                >
                    <div>
                        <ContenedorInputs>
                            <InputMUI
                                type="text"
                                id="outlined-basic"
                                label="DNI"
                                variant="outlined"
                                onChange={(e) => setDni(e.target.value)}
                                value={dni}
                            />
                        </ContenedorInputs>

                        <ContenedorInputs>
                            <InputMUI
                                type="password"
                                id="outlined-basic"
                                label="Contraseña"
                                variant="outlined"
                                margin="normal"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </ContenedorInputs>
                    </div>

                    <OlvidastePassword>
                        <OlvidastePasswordLink
                            href="#"
                            onClick={handleOpenModal}
                        >
                            ¿Olvidaste tu contraseña?
                        </OlvidastePasswordLink>
                    </OlvidastePassword>
                    <ResetPasswordModal
                        open={openModal}
                        onClose={handleCloseModal}
                    />
                    <LineaSeparacion></LineaSeparacion>

                    <Grid>
                        <BotonMUI
                            variant="contained"
                            buttoncontained="+true"
                            disableElevation
                            type="submit"
                        >
                            Ingresar
                        </BotonMUI>
                    </Grid>
                </form>
            </Formulario>
        </FormularioMain>
    );
};

const FormularioMain = styled(Grid)`
    width: 65%;
    max-width: 65%;
    height: 100%;
    padding: 50px 0px;
    border-radius: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export { FormularioMain, FormularioInicioSesion };
