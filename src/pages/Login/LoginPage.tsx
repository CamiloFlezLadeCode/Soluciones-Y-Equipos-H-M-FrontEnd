// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Link from '@mui/material/Link';
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import logo from '../../assets/logo_company.png';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Link as RouterLink } from 'react-router-dom';
// import { useLogin } from '../../hooks/useLogin';
// import { URLS } from '../../constants/urls';
// import { openInNewTab } from '../../utils/navigation';

// export default function LoginPage() {
//     const loginSchema = z.object({
//         email: z.string().min(1, 'El usuario es obligatorio'),
//         password: z
//             .string()
//             .min(1, 'La contraseña es obligatoria')
//         // .min(6, 'La contraseña debe tener al menos 6 caracteres'),
//     });

//     type LoginFormData = z.infer<typeof loginSchema>;

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

//     const onSubmit = handleSubmit(() => {
//         alert('Iniciando sesión...')
//     });

//     const VisitarPaginaCasaDesarrolladora = () => {
//         openInNewTab(URLS.DEVELOPER_WEBSITE);
//     }

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: 'var(--gris-base)',
//                 px: { xs: 3 },
//             }}
//         >
//             <Paper
//                 elevation={0}
//                 sx={{
//                     width: '100%',
//                     maxWidth: 380,
//                     p: { xs: 2.5, md: 3 },
//                     boxShadow: '0 18px 45px rgba(0, 0, 0, 0.06)',
//                     borderRadius: 3,
//                     backgroundColor: '#fbf9fb',
//                 }}
//             >
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         gap: 2.5,
//                     }}
//                 >
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             gap: 1.5,
//                         }}
//                     >
//                         <Box
//                             component="img"
//                             src={logo}
//                             alt="Logo soluciones y equipos"
//                             sx={{
//                                 width: 140,
//                                 height: 140,
//                                 objectFit: 'contain',
//                             }}
//                         />
//                     </Box>

//                     <Box
//                         component="form"
//                         onSubmit={onSubmit}
//                         sx={{
//                             width: '100%',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             gap: 1.75,
//                             mt: 1,
//                         }}
//                     >
//                         <TextField
//                             label="Usuario"
//                             type="text"
//                             fullWidth
//                             {...register('email')}
//                             autoComplete="username"
//                             size="small"
//                             variant="outlined"
//                             error={!!errors.email}
//                             helperText={errors.email?.message}
//                             InputProps={{
//                                 sx: {
//                                     borderRadius: 999,
//                                     background: 'rgba(255, 255, 255, 0.45)',
//                                     backdropFilter: 'blur(18px)',
//                                     border: '1px solid rgba(255, 255, 255, 0.9)',
//                                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
//                                     '& fieldset': {
//                                         border: 'none',
//                                     },
//                                     '&:hover fieldset': {
//                                         border: 'none',
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         border: 'none',
//                                     },
//                                     '& .MuiOutlinedInput-input': {
//                                         py: 1.2,
//                                     },
//                                 },
//                             }}
//                         />
//                         <TextField
//                             label="Contraseña"
//                             type="password"
//                             fullWidth
//                             {...register('password')}
//                             autoComplete="current-password"
//                             size="small"
//                             variant="outlined"
//                             error={!!errors.password}
//                             helperText={errors.password?.message}
//                             InputProps={{
//                                 sx: {
//                                     borderRadius: 999,
//                                     background: 'rgba(255, 255, 255, 0.45)',
//                                     backdropFilter: 'blur(18px)',
//                                     border: '1px solid rgba(255, 255, 255, 0.9)',
//                                     boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
//                                     '& fieldset': {
//                                         border: 'none',
//                                     },
//                                     '&:hover fieldset': {
//                                         border: 'none',
//                                     },
//                                     '&.Mui-focused fieldset': {
//                                         border: 'none',
//                                     },
//                                     '& .MuiOutlinedInput-input': {
//                                         py: 1.2,
//                                     },
//                                 },
//                             }}
//                         />

//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 gap: 1.5,
//                             }}
//                         >
//                             <FormControlLabel
//                                 control={<Checkbox size="small" />}
//                                 label={<Typography variant="body2">Recordarme</Typography>}
//                             />
//                             <Link href="#" variant="body2" underline="hover">
//                                 ¿Olvidaste tu contraseña?
//                             </Link>
//                         </Box>

//                         <Button
//                             type="submit"
//                             variant="contained"
//                             size="large"
//                             sx={{
//                                 mt: 1,
//                                 py: 1.2,
//                                 textTransform: 'none',
//                                 fontSize: 16,
//                                 fontWeight: 600,
//                                 borderRadius: 2,
//                                 backgroundColor: '#FF7F00',
//                                 '&:hover': {
//                                     backgroundColor: '#e67000',
//                                 },
//                             }}
//                         >
//                             Iniciar sesión
//                         </Button>
//                         <Typography variant="body2" sx={{ textAlign: 'center', fontSize: 13 }} onClick={VisitarPaginaCasaDesarrolladora}>© {new Date().getFullYear()} <strong style={{ cursor: 'pointer' }} onClick={VisitarPaginaCasaDesarrolladora}>FlezLade Softworks</strong>. Todos los derechos reservados.</Typography>
//                     </Box>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// }




// src/pages/Login/LoginPage.tsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo_company.png';
import { useLogin } from '../../hooks/useLogin';
import { openInNewTab } from '../../utils/navigation';
import { URLS } from '../../constants/urls';
import { textFieldLabelStyles, textFieldStyles } from './LoginPage.styles';

export default function LoginPage() {
    const { register, onSubmit, errors } = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const handleDeveloperClick = () => {
        openInNewTab(URLS.DEVELOPER_WEBSITE);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--gris-base)',
                px: { xs: 3 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 380,
                    p: { xs: 2.5, md: 3 },
                    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.06)',
                    borderRadius: 3,
                    backgroundColor: '#fbf9fb',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            component="img"
                            src={logo}
                            alt="Logo soluciones y equipos"
                            sx={{ width: 140, height: 140, objectFit: 'contain' }}
                        />
                    </Box>

                    <Box
                        component="form"
                        onSubmit={onSubmit}
                        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.75, mt: 1 }}
                    >
                        <TextField
                            label="Usuario"
                            type="text"
                            fullWidth
                            {...register('email')}
                            autoComplete="username"
                            size="small"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={textFieldLabelStyles}
                            InputProps={{ sx: textFieldStyles }}
                        />

                        <TextField
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            {...register('password')}
                            autoComplete="current-password"
                            size="small"
                            variant="outlined"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={textFieldLabelStyles}
                            InputProps={{
                                sx: textFieldStyles,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            onMouseDown={(event) => event.preventDefault()}
                                            edge="end"
                                            size="small"
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                            sx={{ mr: 0.2, color: 'rgba(63, 46, 101, 0.7)' }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                            <FormControlLabel
                                control={<Checkbox size="small" />}
                                label={<Typography variant="body2">Recordarme</Typography>}
                            />
                            <Link href="#" variant="body2" underline="hover">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 1,
                                py: 1.2,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 600,
                                borderRadius: 2,
                                backgroundColor: '#FF7F00',
                                '&:hover': { backgroundColor: '#e67000' },
                            }}
                        >
                            Iniciar sesión
                        </Button>

                        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: 13 }}>
                            © {new Date().getFullYear()}{' '}
                            <strong
                                style={{ cursor: 'pointer' }}
                                onClick={handleDeveloperClick}
                            >
                                FlezLade Softworks
                            </strong>
                            . Todos los derechos reservados.
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
