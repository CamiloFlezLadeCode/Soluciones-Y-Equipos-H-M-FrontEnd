import type { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import { notify } from '@services/notify'

interface Column {
    id: 'nombre' | 'rol' | 'estado' | 'ultimoAcceso'
    label: string
}

interface Data {
    nombre: string
    rol: string
    estado: string
    ultimoAcceso: string
}

const palette = {
    orange: '#FF7F00',
    purple: '#3F2E65',
    lightWarmGray: '#f6f2f7',
    gray: '#eceaee',
    whiteBase: '#fbf9fb',
}

const columns: readonly Column[] = [
    { id: 'nombre', label: 'Nombre' },
    { id: 'rol', label: 'Rol' },
    { id: 'estado', label: 'Estado' },
    { id: 'ultimoAcceso', label: 'Ultimo acceso' },
]

const rows: readonly Data[] = [
    { nombre: 'Ana Ruiz', rol: 'Administrador', estado: 'Activo', ultimoAcceso: 'Hoy, 08:41' },
    { nombre: 'Carlos Perez', rol: 'Operador', estado: 'Activo', ultimoAcceso: 'Hoy, 07:55' },
    { nombre: 'Laura Mejia', rol: 'Supervisor', estado: 'Inactivo', ultimoAcceso: 'Ayer, 18:12' },
    { nombre: 'Andres Silva', rol: 'Operador', estado: 'Activo', ultimoAcceso: 'Hoy, 09:04' },
    { nombre: 'Julian Gomez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:17' },
    { nombre: 'Julian Gomez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:17' },
    { nombre: 'Maria Lopez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:45' },
    { nombre: 'Carlos Ruiz', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: 'Ayer, 14:30' },
    { nombre: 'Ana Martinez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:55' },
    { nombre: 'Luis Fernandez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:12' },
    { nombre: 'Sofia Ramirez', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-20, 16:20' },
    { nombre: 'Diego Torres', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:03' },
    { nombre: 'Valentina Castro', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:44' },
    { nombre: 'Andres Morales', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-19, 09:15' },
    { nombre: 'Camila Vargas', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:30' },
    { nombre: 'Felipe Rojas', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:20' },
    { nombre: 'Laura Silva', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-18, 17:45' },
    { nombre: 'Javier Paredes', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:55' },
    { nombre: 'Natalia Mendoza', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:18' },
    { nombre: 'Ricardo Herrera', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 13:40' },
    { nombre: 'Gabriela Soto', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:05' },
    { nombre: 'Oscar Jimenez', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-15, 11:00' },
    { nombre: 'Daniela Reyes', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:22' },
    { nombre: 'Hugo Vega', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:50' },
    { nombre: 'Paula Ortiz', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-17, 10:30' },
    { nombre: 'Eduardo Flores', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:33' },
    { nombre: 'Isabel Castro', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 15:10' },
    { nombre: 'Raul Sandoval', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:47' },
    { nombre: 'Patricia Romero', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:12' },
    { nombre: 'Sergio Mendez', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-10, 08:50' },
    { nombre: 'Adriana Gutierrez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 13:05' },
    { nombre: 'Martin Ponce', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:28' },
    { nombre: 'Lorena Chacon', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-16, 12:15' },
    { nombre: 'Cristian Fuentes', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 16:40' },
    { nombre: 'Carolina Bautista', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:59' },
    { nombre: 'Mauricio Serrano', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:41' },
    { nombre: 'Diana Luna', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:35' },
    { nombre: 'Esteban Guerrero', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-14, 14:05' },
    { nombre: 'Monica Peña', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:17' },
    { nombre: 'Giovanni Rios', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:25' },
    { nombre: 'Alejandro Cardenas', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-12, 09:50' },
    { nombre: 'Veronica Salazar', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:37' },
    { nombre: 'Pedro Gonzalez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:10' },
    { nombre: 'Nora Camacho', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 11:55' },
    { nombre: 'Ramon Ibarra', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 13:18' },
    { nombre: 'Claudia Nava', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-13, 17:20' },
    { nombre: 'Emilio Dominguez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:05' },
    { nombre: 'Brenda Acevedo', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:30' },
    { nombre: 'Hector Olvera', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:48' },
    { nombre: 'Teresa Millan', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 14:25' },
    { nombre: 'Alberto Figueroa', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-11, 10:15' },
    { nombre: 'Rosa Valdez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:42' },
    { nombre: 'Cesar Moreno', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:38' },
    { nombre: 'Julia Reyes', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-09, 16:00' },
    { nombre: 'Francisco Cabrera', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 15:20' },
    { nombre: 'Silvia Duran', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:33' },
    { nombre: 'Lorenzo Aguirre', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:44' },
    { nombre: 'Margarita Godoy', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 13:20' },
    { nombre: 'Ernesto Leal', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-08, 11:35' },
    { nombre: 'Leticia Espinoza', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:50' },
    { nombre: 'Manuel Ochoa', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:05' },
    { nombre: 'Gladys Padilla', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-07, 09:25' },
    { nombre: 'Rafael Covarrubias', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 13:55' },
    { nombre: 'Martha Montes', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:17' },
    { nombre: 'Eugenio Rojo', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 12:15' },
    { nombre: 'Alicia Pinto', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:09' },
    { nombre: 'Victor Zuniga', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-06, 15:30' },
    { nombre: 'Juana Cuevas', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:27' },
    { nombre: 'Mario Orozco', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:45' },
    { nombre: 'Consuelo Vera', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-05, 14:55' },
    { nombre: 'Arturo Lozano', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:38' },
    { nombre: 'Elena Prieto', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:33' },
    { nombre: 'Roberto Huerta', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 16:10' },
    { nombre: 'Susana Mejia', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:55' },
    { nombre: 'Salvador Pineda', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-04, 10:45' },
    { nombre: 'Rocío Angulo', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:15' },
    { nombre: 'Rogelio Esquivel', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:50' },
    { nombre: 'Blanca Franco', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-03, 13:40' },
    { nombre: 'Jorge Enriquez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:25' },
    { nombre: 'Luisa Galindo', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:15' },
    { nombre: 'Facundo Ordoñez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 17:30' },
    { nombre: 'Graciela Avila', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:59' },
    { nombre: 'Octavio Zamora', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-04-02, 12:20' },
    { nombre: 'Lidia Limon', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 13:42' },
    { nombre: 'Armando Solano', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:30' },
    { nombre: 'Cecilia Carranza', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-04-01, 11:10' },
    { nombre: 'Ramiro Felix', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:02' },
    { nombre: 'Miriam Arriaga', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:22' },
    { nombre: 'Federico Casas', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 15:55' },
    { nombre: 'Amparo Gaytan', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:08' },
    { nombre: 'Gustavo Vela', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-03-31, 09:30' },
    { nombre: 'Carmen Alanis', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:45' },
    { nombre: 'Rigoberto Tamez', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:18' },
    { nombre: 'Olga Zarate', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-03-30, 16:50' },
    { nombre: 'Alonso Bretón', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:52' },
    { nombre: 'Jimena Ocampo', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:38' },
    { nombre: 'Leonardo Preciado', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 13:15' },
    { nombre: 'Fabiola Quiroz', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:45' },
    { nombre: 'Edgar Lira', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-03-29, 10:40' },
    { nombre: 'Liliana Zamudio', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 15:05' },
    { nombre: 'Humberto Coronado', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:58' },
    { nombre: 'Marisol Escobar', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-03-28, 14:35' },
    { nombre: 'Fermin Loera', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 12:28' },
    { nombre: 'Rosalba Macias', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:42' },
    { nombre: 'Aaron Villareal', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 11:00' },
    { nombre: 'Rebeca Niño', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 13:27' },
    { nombre: 'Emmanuel Ceballos', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-03-27, 09:55' },
    { nombre: 'Marcela Treviño', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 10:33' },
    { nombre: 'Reynaldo Granados', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 08:14' },
    { nombre: 'Aura Palacios', rol: 'Analista', estado: 'Inactivo', ultimoAcceso: '2026-03-26, 12:50' },
    { nombre: 'Fausto Luevano', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 14:28' },
    { nombre: 'Elsa Berlanga', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 07:25' },
    { nombre: 'Joaquin Coronel', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer, 16:05' },
    { nombre: 'Aracely Cadena', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 11:15' },
    { nombre: 'Alexis Montemayor', rol: 'Analista', estado: 'Suspendido', ultimoAcceso: '2026-03-25, 13:30' },
    { nombre: 'Karina Zambrano', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 09:48' },
    { nombre: 'Juan de Dios Salas', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Hoy, 06:12' }
]

const metrics = [
    { title: 'Usuarios Activos', value: '128', trend: '+8.4%' },
    { title: 'Tareas Pendientes', value: '42', trend: '-3.1%' },
    { title: 'Eficiencia', value: '96.2%', trend: '+1.6%' },
]

export default function DashboardPage() {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const paginatedRows = useMemo(
        () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [page, rowsPerPage]
    )

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        if (event) event.preventDefault()
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value))
        setPage(0)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 4,
                    backgroundColor: alpha('#ffffff', 0.92),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(palette.purple, 0.14)}`,
                    boxShadow: `0 16px 30px ${alpha(palette.purple, 0.12)}`,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 800, color: palette.purple }}>
                    Bienvenido al Panel Administrativo
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.8, color: alpha(palette.purple, 0.82) }}>
                    Vista principal de operaciones y monitoreo de tu plataforma.
                </Typography>
                <Button
                    sx={{
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 800,
                        color: palette.whiteBase,
                        backgroundColor: palette.orange,
                        '&:hover': { backgroundColor: '#d96800' },
                    }}
                    onClick={() => notify({ type: 'success', message: 'Panel actualizado correctamente.' })}
                >
                    Actualizar panel
                </Button>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                    gap: 2,
                }}
            >
                {metrics.map((metric) => (
                    <Paper
                        key={metric.title}
                        elevation={0}
                        sx={{
                            p: 2.2,
                            borderRadius: 3,
                            backgroundColor: alpha('#ffffff', 0.9),
                            border: `1px solid ${alpha(palette.purple, 0.12)}`,
                            boxShadow: `0 8px 18px ${alpha(palette.purple, 0.08)}`,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: alpha(palette.purple, 0.72) }}>
                            {metric.title}
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 0.4, fontWeight: 800, color: palette.purple }}>
                            {metric.value}
                        </Typography>
                        <Typography variant="caption" sx={{ color: palette.orange, fontWeight: 700 }}>
                            {metric.trend}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: 3,
                    backgroundColor: alpha('#ffffff', 0.93),
                    border: `1px solid ${alpha(palette.purple, 0.12)}`,
                }}
            >
                <TableContainer>
                    <Table aria-label="usuarios">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        sx={{
                                            color: palette.purple,
                                            fontWeight: 700,
                                            backgroundColor: alpha(palette.gray, 0.92),
                                        }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRows.map((row) => (
                                <TableRow key={`${row.nombre}-${row.rol}`} hover>
                                    <TableCell>{row.nombre}</TableCell>
                                    <TableCell>{row.rol}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.estado}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                backgroundColor:
                                                    row.estado === 'Activo'
                                                        ? alpha('#2e7d32', 0.15)
                                                        : alpha('#a32727', 0.12),
                                                color:
                                                    row.estado === 'Activo'
                                                        ? '#1f5c24'
                                                        : '#8f1e1e',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{row.ultimoAcceso}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}
