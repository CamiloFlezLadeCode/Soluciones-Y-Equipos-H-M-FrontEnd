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
