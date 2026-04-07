// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '@pages/Login/loginSchema';
// import type { LoginFormData } from '@pages/Login/loginSchema';

// export const useLogin = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<LoginFormData>({
//         resolver: zodResolver(loginSchema),
//         defaultValues: {
//             email: '',
//             password: '',
//         },
//     });

//     const onSubmit = handleSubmit((data) => {
//         console.log('Datos del login:', data);
//         alert('Iniciando sesión...');
//         // Aquí iría la lógica de autenticación
//     });

//     return {
//         register,
//         onSubmit,
//         errors,
//     };
// };


// src/hooks/useLogin.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@pages/Login/loginSchema';
import type { LoginFormData } from '@pages/Login/loginSchema';
import { authService } from '@services/api/auth.service';
import type { LoginRequest } from '@services/api/types';
import { useNavigate , redirect } from 'react-router-dom';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        setApiError(null);

        try {
            // Transformar datos del formulario al formato que espera la API
            const credentials: LoginRequest = {
                credenDocumentoUsuario: data.email,  // email = documento
                credenClave: data.password
            };

            // Llamar al servicio de autenticación
            const user = await authService.login(credentials);

            console.log('Login exitoso:', user);

            // Redirigir al dashboard o página principal
            // window.location.href = '/dashboard';
            navigate('/dashboard');
            // Navigate('/dashboard');


        } catch (err) {
            // Manejar errores de la API
            const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setApiError(message);

            // Opcional: Mapear errores específicos a campos del formulario
            if (message.includes('usuario') || message.includes('credenciales')) {
                setError('email', {
                    type: 'manual',
                    message: 'Usuario o contraseña incorrectos'
                });
            }

            console.error('Error en login:', err);
        } finally {
            setLoading(false);
        }
    });

    const logout = () => {
        authService.logout();
    };

    const isAuthenticated = () => authService.isAuthenticated();

    return {
        // Props del formulario
        register,
        onSubmit,
        errors,
        // Estado de la petición
        loading,
        apiError,
        // Utilidades de autenticación
        logout,
        isAuthenticated,
    };
};