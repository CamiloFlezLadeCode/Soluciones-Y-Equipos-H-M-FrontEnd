import { zodResolver } from '@hookform/resolvers/zod'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { notify } from '@services/notify'
import { Plus, Search, ShieldCheck, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type UserRole = 'Administrador' | 'Operador' | 'Consulta'
type UserStatus = 'Activo' | 'Inactivo'

interface AppUser {
    id: string
    fullName: string
    email: string
    document: string
    role: UserRole
    status: UserStatus
    createdAt: string
    address: string
    phone: string
}

const usersStorageKey = 'hym-users-list'

const createUserSchema = z.object({
    fullName: z.string().min(3, 'El nombre es obligatorio'),
    email: z.string().email('Correo invalido'),
    document: z
        .string()
        .min(6, 'Documento invalido')
        .max(20, 'Documento invalido')
        .regex(/^[0-9]+$/, 'Solo se permiten numeros'),
    address: z.string().min(3, 'Dirección es obligatoria'),
    status: z.enum(['Activo', 'Inactivo']),
    role: z.enum(['Administrador', 'Operador', 'Consulta']),
    phone: z.string().min(10, 'Telefono invalido').max(10, 'Telefono invalido').regex(/^[0-9]+$/, 'Solo se permiten numeros'),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

const defaultUsers: AppUser[] = [
    {
        id: 'usr-001',
        fullName: 'Camila Torres',
        email: 'camila.torres@hym.com',
        document: '1023456789',
        role: 'Administrador',
        status: 'Activo',
        createdAt: '2026-03-10',
        address: 'Calle 123, Ciudad X',
        phone: '32012345678',
    },
    {
        id: 'usr-002',
        fullName: 'Juan Perez',
        email: 'juan.perez@hym.com',
        document: '91234567',
        role: 'Operador',
        status: 'Activo',
        createdAt: '2026-03-14',
        address: 'Calle 456, Ciudad Y',
        phone: '3204567890',
    },
]

const getStoredUsers = (): AppUser[] => {
    try {
        const raw = localStorage.getItem(usersStorageKey)
        if (!raw) return defaultUsers
        const parsed = JSON.parse(raw) as AppUser[]
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultUsers
    } catch {
        return defaultUsers
    }
}

export default function ViewUsersComponent() {
    const [users, setUsers] = useState<AppUser[]>(getStoredUsers)
    const [search, setSearch] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fullName: '',
            email: '',
            document: '',
            role: 'Operador',
            status: 'Activo',
            address: '',
        },
    })

    const persistUsers = (nextUsers: AppUser[]) => {
        setUsers(nextUsers)
        localStorage.setItem(usersStorageKey, JSON.stringify(nextUsers))
    }

    const filteredUsers = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim()
        if (!normalizedSearch) return users

        return users.filter((user) =>
            [user.fullName, user.email, user.document, user.role].join(' ').toLowerCase().includes(normalizedSearch)
        )
    }, [search, users])

    const onCreateUser = handleSubmit(async (data) => {
        const alreadyExists = users.some(
            (user) => user.email.toLowerCase() === data.email.toLowerCase() || user.document === data.document
        )

        if (alreadyExists) {
            notify({
                message: 'Ya existe un usuario con ese correo o documento',
                type: 'error',
            })
            return
        }

        const newUser: AppUser = {
            id: `usr-${Date.now()}`,
            fullName: data.fullName.trim(),
            email: data.email.toLowerCase(),
            document: data.document,
            role: data.role,
            status: 'Activo',
            createdAt: new Date().toISOString().slice(0, 10),
            address: data.address,
            phone: data.phone,
        }

        persistUsers([newUser, ...users])
        reset()
        notify({
            message: 'Usuario creado correctamente',
            type: 'success',
        })
    })

    const activeUsers = users.filter((user) => user.status === 'Activo').length

    return (
        <Stack spacing={2.2}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.8, md: 2.2 },
                    borderRadius: 3,
                    border: `1px solid ${alpha('#64748b', 0.2)}`,
                    background: `linear-gradient(150deg, ${alpha('#ffffff', 0.86)} 0%, ${alpha('#f8fbff', 0.72)} 100%)`,
                    backdropFilter: 'blur(14px)',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={1.3}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                >
                    <Box>
                        <Typography sx={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                            Gestion de usuarios
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: alpha('#0f172a', 0.68), mt: 0.25 }}>
                            Visualiza y crea usuarios/clientes con control de acceso
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip
                            icon={<UsersRound size={14} />}
                            label={`Total: ${users.length}`}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                        <Chip
                            icon={<ShieldCheck size={14} />}
                            label={`Activos: ${activeUsers}`}
                            color="success"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </Stack>
                </Stack>
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 1fr) minmax(0, 1.85fr)' },
                }}
            >
                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 1.8, md: 2 },
                            borderRadius: 3,
                            border: `1px solid ${alpha('#64748b', 0.18)}`,
                            background: `linear-gradient(155deg, ${alpha('#ffffff', 0.84)} 0%, ${alpha('#f1f7ff', 0.7)} 100%)`,
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.4 }}>Crear usuario</Typography>

                        <Stack component="form" onSubmit={onCreateUser} spacing={1.2}>
                            <TextField
                                label="Nombre completo"
                                size="small"
                                {...register('fullName')}
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                            />
                            <TextField
                                label="Correo"
                                size="small"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                label="Documento"
                                size="small"
                                {...register('document')}
                                error={!!errors.document}
                                helperText={errors.document?.message}
                            />
                            <TextField
                                label="Dirección"
                                size="small"
                                {...register('address')}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                            />
                            <TextField
                                label="Telefono"
                                size="small"
                                {...register('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                            <TextField
                                label="Rol"
                                size="small"
                                select
                                defaultValue="Operador"
                                {...register('role')}
                                error={!!errors.role}
                                helperText={errors.role?.message}
                            >
                                <MenuItem value="Administrador">Administrador</MenuItem>
                                <MenuItem value="Operador">Operador</MenuItem>
                                <MenuItem value="Consulta">Consulta</MenuItem>
                                <MenuItem value="Cliente">Cliente</MenuItem>
                            </TextField>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Plus size={16} />}
                                disabled={isSubmitting}
                                sx={{
                                    mt: 0.4,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    backgroundColor: '#FF7F00',
                                    '&:hover': { backgroundColor: '#e67000' },
                                }}
                            >
                                {isSubmitting ? 'Creando...' : 'Crear usuario'}
                            </Button>
                        </Stack>
                    </Paper>
                </Box>

                <Box>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 1.3, md: 1.6 },
                            borderRadius: 3,
                            border: `1px solid ${alpha('#64748b', 0.18)}`,
                            background: `linear-gradient(155deg, ${alpha('#ffffff', 0.86)} 0%, ${alpha('#f5f9ff', 0.74)} 100%)`,
                            backdropFilter: 'blur(12px)',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.2}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                            justifyContent="space-between"
                            sx={{ mb: 1.2 }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Listado de usuarios</Typography>
                            <TextField
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                size="small"
                                placeholder="Buscar por nombre, correo o documento"
                                sx={{ width: { xs: '100%', sm: 280 } }}
                                InputProps={{
                                    startAdornment: (
                                        <Box sx={{ mr: 0.8, display: 'flex', alignItems: 'center' }}>
                                            <Search size={14} />
                                        </Box>
                                    ),
                                }}
                            />
                        </Stack>

                        <Divider sx={{ mb: 1.2 }} />

                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <TableContainer sx={{ maxHeight: 430, overflowX: 'auto' }}>
                                <Table stickyHeader size="small" aria-label="tabla de usuarios">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Correo</TableCell>
                                            <TableCell>Documento</TableCell>
                                            <TableCell>Rol</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Dirección</TableCell>
                                            <TableCell>Telefono</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{user.fullName}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{user.email}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{user.document}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        label={user.role}
                                                        color={user.role === 'Administrador' ? 'primary' : 'default'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        color={user.status === 'Activo' ? 'success' : 'default'}
                                                        variant="dot"
                                                        sx={{ '& .MuiBadge-badge': { right: -5, top: 8 } }}
                                                    >
                                                        <Typography sx={{ fontSize: '0.78rem' }}>{user.status}</Typography>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{user.address}</TableCell>
                                                <TableCell sx={{ fontSize: '0.8rem' }}>{user.phone}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Stack sx={{ display: { xs: 'flex', md: 'none' } }} spacing={1.1}>
                            {filteredUsers.map((user) => (
                                <Paper
                                    key={user.id}
                                    elevation={0}
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 2,
                                        border: `1px solid ${alpha('#64748b', 0.16)}`,
                                        backgroundColor: alpha('#ffffff', 0.8),
                                    }}
                                >
                                    <Stack spacing={0.7}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.84rem' }}>{user.fullName}</Typography>
                                        <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72), wordBreak: 'break-word' }}>
                                            {user.email}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72) }}>
                                            Documento: {user.document}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                            <Chip
                                                size="small"
                                                label={user.role}
                                                color={user.role === 'Administrador' ? 'primary' : 'default'}
                                                variant="outlined"
                                            />
                                            <Badge
                                                color={user.status === 'Activo' ? 'success' : 'default'}
                                                variant="dot"
                                                sx={{ '& .MuiBadge-badge': { right: -5, top: 8 } }}
                                            >
                                                <Typography sx={{ fontSize: '0.76rem' }}>{user.status}</Typography>
                                            </Badge>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>

                        {filteredUsers.length === 0 && (
                            <Box
                                sx={{
                                    py: 4,
                                    textAlign: 'center',
                                    color: alpha('#0f172a', 0.6),
                                    fontSize: '0.85rem',
                                }}
                            >
                                No se encontraron usuarios con ese criterio de busqueda.
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Stack>
    )
}
