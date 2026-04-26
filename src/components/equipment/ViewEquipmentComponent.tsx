import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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
import { Plus, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type EquipmentCategory = 'Pesado' | 'Ligero' | 'Herramienta'

interface AppEquipment {
    id: string
    category: EquipmentCategory
    name: string
    rentalPrice: number
    createdAt: string
}

const equipmentStorageKey = 'hym-equipment-list'

const createEquipmentSchema = z.object({
    category: z.enum(['Pesado', 'Ligero', 'Herramienta']),
    name: z.string().min(3, 'El nombre es obligatorio'),
    rentalPrice: z.number().positive('El precio debe ser mayor a 0'),
})

type CreateEquipmentFormData = z.infer<typeof createEquipmentSchema>

const defaultEquipment: AppEquipment[] = [
    {
        id: 'eq-001',
        category: 'Pesado',
        name: 'Excavadora CAT 320',
        rentalPrice: 850000,
        createdAt: '2026-04-10',
    },
    {
        id: 'eq-002',
        category: 'Herramienta',
        name: 'Martillo Demoledor Bosch',
        rentalPrice: 120000,
        createdAt: '2026-04-12',
    },
]

const getStoredEquipment = (): AppEquipment[] => {
    try {
        const raw = localStorage.getItem(equipmentStorageKey)
        if (!raw) return defaultEquipment
        const parsed = JSON.parse(raw) as AppEquipment[]
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultEquipment
    } catch {
        return defaultEquipment
    }
}

export default function ViewEquipmentComponent() {
    const [equipmentList, setEquipmentList] = useState<AppEquipment[]>(getStoredEquipment)
    const [search, setSearch] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateEquipmentFormData>({
        resolver: zodResolver(createEquipmentSchema),
        defaultValues: {
            category: 'Herramienta',
            name: '',
            rentalPrice: 0,
        },
    })

    const persistEquipment = (nextEquipment: AppEquipment[]) => {
        setEquipmentList(nextEquipment)
        localStorage.setItem(equipmentStorageKey, JSON.stringify(nextEquipment))
    }

    const onCreateEquipment = handleSubmit(async (data) => {
        const normalizedName = data.name.trim().toLowerCase()
        const alreadyExists = equipmentList.some((equipment) => equipment.name.trim().toLowerCase() === normalizedName)

        if (alreadyExists) {
            notify({
                message: 'Ya existe un equipo con ese nombre',
                type: 'error',
            })
            return
        }

        const newEquipment: AppEquipment = {
            id: `eq-${Date.now()}`,
            category: data.category,
            name: data.name.trim(),
            rentalPrice: data.rentalPrice,
            createdAt: new Date().toISOString().slice(0, 10),
        }

        persistEquipment([newEquipment, ...equipmentList])
        reset({
            category: 'Herramienta',
            name: '',
            rentalPrice: 0,
        })
        notify({
            message: 'Equipo creado correctamente',
            type: 'success',
        })
    })

    const filteredEquipment = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim()
        if (!normalizedSearch) return equipmentList
        return equipmentList.filter((equipment) =>
            [equipment.category, equipment.name].join(' ').toLowerCase().includes(normalizedSearch)
        )
    }, [equipmentList, search])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(amount)

    return (
        <Stack spacing={2}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.8, md: 2.2 },
                    borderRadius: 3,
                    border: `1px solid ${alpha('#64748b', 0.2)}`,
                    background: `linear-gradient(150deg, ${alpha('#ffffff', 0.88)} 0%, ${alpha('#f8fbff', 0.74)} 100%)`,
                    backdropFilter: 'blur(14px)',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.2}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                    <Box>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Gestion de equipos</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: alpha('#0f172a', 0.68), mt: 0.2 }}>
                            Crea y administra tu catalogo de equipos y herramientas
                        </Typography>
                    </Box>
                    <Chip icon={<Wrench size={14} />} label={`Total: ${equipmentList.length}`} variant="outlined" />
                </Stack>
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 1fr) minmax(0, 1.8fr)' },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.8, md: 2 },
                        borderRadius: 3,
                        border: `1px solid ${alpha('#64748b', 0.18)}`,
                        background: `linear-gradient(155deg, ${alpha('#ffffff', 0.86)} 0%, ${alpha('#f1f7ff', 0.72)} 100%)`,
                    }}
                >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.2 }}>Crear equipo</Typography>

                    <Stack component="form" onSubmit={onCreateEquipment} spacing={1.2}>
                        <TextField
                            label="Categoria"
                            size="small"
                            select
                            defaultValue="Herramienta"
                            {...register('category')}
                            error={!!errors.category}
                            helperText={errors.category?.message}
                        >
                            <MenuItem value="Pesado">Pesado</MenuItem>
                            <MenuItem value="Ligero">Ligero</MenuItem>
                            <MenuItem value="Herramienta">Herramienta</MenuItem>
                        </TextField>

                        <TextField
                            label="Nombre del equipo"
                            size="small"
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />

                        <TextField
                            label="Precio de alquiler"
                            size="small"
                            type="number"
                            inputProps={{ min: 1 }}
                            {...register('rentalPrice', { valueAsNumber: true })}
                            error={!!errors.rentalPrice}
                            helperText={errors.rentalPrice?.message}
                        />

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
                            {isSubmitting ? 'Guardando...' : 'Guardar equipo'}
                        </Button>
                    </Stack>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.3, md: 1.6 },
                        borderRadius: 3,
                        border: `1px solid ${alpha('#64748b', 0.18)}`,
                        background: `linear-gradient(155deg, ${alpha('#ffffff', 0.88)} 0%, ${alpha('#f5f9ff', 0.76)} 100%)`,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.2}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                        justifyContent="space-between"
                        sx={{ mb: 1.2 }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Listado de equipos</Typography>
                        <TextField
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            size="small"
                            placeholder="Buscar por nombre o categoria"
                            sx={{ width: { xs: '100%', sm: 280 } }}
                        />
                    </Stack>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <TableContainer sx={{ maxHeight: 430, overflowX: 'auto' }}>
                            <Table stickyHeader size="small" aria-label="tabla de equipos">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Categoria</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Precio alquiler</TableCell>
                                        <TableCell>Creado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredEquipment.map((equipment) => (
                                        <TableRow key={equipment.id} hover>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{equipment.category}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{equipment.name}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{formatCurrency(equipment.rentalPrice)}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{equipment.createdAt}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Stack sx={{ display: { xs: 'flex', md: 'none' } }} spacing={1.1}>
                        {filteredEquipment.map((equipment) => (
                            <Paper
                                key={equipment.id}
                                elevation={0}
                                sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha('#64748b', 0.16)}`,
                                    backgroundColor: alpha('#ffffff', 0.84),
                                }}
                            >
                                <Stack spacing={0.7}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.84rem' }}>{equipment.name}</Typography>
                                    <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72) }}>
                                        Categoria: {equipment.category}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72) }}>
                                        Alquiler: {formatCurrency(equipment.rentalPrice)}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>

                    {filteredEquipment.length === 0 && (
                        <Box sx={{ py: 4, textAlign: 'center', color: alpha('#0f172a', 0.6), fontSize: '0.85rem' }}>
                            No hay equipos registrados para ese criterio.
                        </Box>
                    )}
                </Paper>
            </Box>
        </Stack>
    )
}
