import logoCompany from '@assets/logo_company.png'
import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { FileDown, Plus } from 'lucide-react'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface AppUser {
    id: string
    fullName: string
    email: string
    document: string
}

interface AppEquipment {
    id: string
    category: string
    name: string
    rentalPrice: number
}

interface QuoteItem {
    equipmentId: string
    equipmentName: string
    equipmentCategory: string
    unitPrice: number
    quantity: number
    rentalDays: number
    total: number
}

interface SavedQuote {
    id: string
    createdAt: string
    clientId: string
    clientName: string
    clientDocument: string
    item: QuoteItem
    total: number
    notes?: string
}

const usersStorageKey = 'hym-users-list'
const equipmentStorageKey = 'hym-equipment-list'
const quotesStorageKey = 'hym-quotes-list'

const createQuoteSchema = z.object({
    clientId: z.string().min(1, 'Selecciona un cliente'),
    equipmentId: z.string().min(1, 'Selecciona un equipo'),
    quantity: z.number().int('Cantidad invalida').positive('La cantidad debe ser mayor a 0'),
    rentalDays: z.number().int('Dias invalidos').positive('Los dias deben ser mayor a 0'),
    notes: z.string().max(300, 'Maximo 300 caracteres').optional(),
})

type CreateQuoteFormData = z.infer<typeof createQuoteSchema>

const getStoredUsers = (): AppUser[] => {
    try {
        const raw = localStorage.getItem(usersStorageKey)
        if (!raw) return []
        const parsed = JSON.parse(raw) as AppUser[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const getStoredEquipment = (): AppEquipment[] => {
    try {
        const raw = localStorage.getItem(equipmentStorageKey)
        if (!raw) return []
        const parsed = JSON.parse(raw) as AppEquipment[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const getStoredQuotes = (): SavedQuote[] => {
    try {
        const raw = localStorage.getItem(quotesStorageKey)
        if (!raw) return []
        const parsed = JSON.parse(raw) as SavedQuote[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

const toDataUrl = async (assetUrl: string): Promise<string> => {
    const response = await fetch(assetUrl)
    const blob = await response.blob()

    return await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            } else {
                reject(new Error('No fue posible cargar la imagen del logo'))
            }
        }
        reader.onerror = () => reject(new Error('No fue posible leer la imagen del logo'))
        reader.readAsDataURL(blob)
    })
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(amount)

const pdfMakeWithFonts = pdfMake as typeof pdfMake & { vfs: Record<string, string> }
const vfsSource = pdfFonts as { pdfMake?: { vfs?: Record<string, string> }; vfs?: Record<string, string> }
pdfMakeWithFonts.vfs = vfsSource.pdfMake?.vfs ?? vfsSource.vfs ?? {}

export default function QuotesComponent() {
    const [users, setUsers] = useState<AppUser[]>(getStoredUsers)
    const [equipmentList, setEquipmentList] = useState<AppEquipment[]>(getStoredEquipment)
    const [quotes, setQuotes] = useState<SavedQuote[]>(getStoredQuotes)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateQuoteFormData>({
        resolver: zodResolver(createQuoteSchema),
        defaultValues: {
            clientId: '',
            equipmentId: '',
            quantity: 1,
            rentalDays: 1,
            notes: '',
        },
    })

    const persistQuotes = (nextQuotes: SavedQuote[]) => {
        setQuotes(nextQuotes)
        localStorage.setItem(quotesStorageKey, JSON.stringify(nextQuotes))
    }

    const reloadCatalogs = () => {
        setUsers(getStoredUsers())
        setEquipmentList(getStoredEquipment())
        notify({
            message: 'Clientes y equipos actualizados',
            type: 'success',
        })
    }

    const selectedEquipment = useMemo(() => {
        const equipmentId = watch('equipmentId')
        return equipmentList.find((item) => item.id === equipmentId)
    }, [equipmentList, watch])

    const estimatedTotal = useMemo(() => {
        if (!selectedEquipment) return 0
        const quantity = Number(watch('quantity') ?? 0)
        const rentalDays = Number(watch('rentalDays') ?? 0)
        if (quantity <= 0 || rentalDays <= 0) return 0
        return selectedEquipment.rentalPrice * quantity * rentalDays
    }, [selectedEquipment, watch])

    const generateQuotePdf = async (quote: SavedQuote) => {
        try {
            const logoDataUrl = await toDataUrl(logoCompany)
            const docDefinition: TDocumentDefinitions = {
                pageSize: 'A4',
                pageMargins: [40, 90, 40, 45],
                background: (_, pageSize) => ({
                    image: 'watermarkLogo',
                    width: 300,
                    opacity: 0.08,
                    absolutePosition: {
                        x: (pageSize.width - 300) / 2,
                        y: (pageSize.height - 300) / 2,
                    },
                }),
                header: {
                    margin: [40, 20, 40, 0],
                    columns: [
                        {
                            image: 'companyLogo',
                            width: 58,
                        },
                        {
                            width: '*',
                            stack: [
                                { text: 'SOLUCIONES Y EQUIPOS H&M', style: 'headerTitle' },
                                { text: 'Cotización de alquiler de equipos', style: 'headerSubtitle' },
                            ],
                            margin: [12, 4, 0, 0],
                        },
                        {
                            width: 'auto',
                            stack: [
                                { text: `No. ${quote.id.toUpperCase()}`, style: 'headerMeta' },
                                { text: `Fecha: ${quote.createdAt}`, style: 'headerMeta' },
                            ],
                            alignment: 'right',
                        },
                    ],
                },
                footer: (currentPage, pageCount) => ({
                    margin: [40, 0, 40, 18],
                    columns: [
                        {
                            text: 'Documento generado por el sistema de cotizaciones',
                            style: 'footerText',
                        },
                        {
                            text: `Página ${currentPage} de ${pageCount}`,
                            style: 'footerText',
                            alignment: 'right',
                        },
                    ],
                }),
                content: [
                    {
                        text: 'Datos del cliente',
                        style: 'sectionTitle',
                    },
                    {
                        table: {
                            widths: ['30%', '70%'],
                            body: [
                                [{ text: 'Cliente', style: 'tableLabel' }, { text: quote.clientName, style: 'tableValue' }],
                                [{ text: 'Documento', style: 'tableLabel' }, { text: quote.clientDocument, style: 'tableValue' }],
                            ],
                        },
                        layout: 'lightHorizontalLines',
                        margin: [0, 6, 0, 18],
                    },
                    {
                        text: 'Detalle de la cotización',
                        style: 'sectionTitle',
                    },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['34%', '16%', '16%', '14%', '20%'],
                            body: [
                                [
                                    { text: 'Equipo', style: 'tableHead' },
                                    { text: 'Categoría', style: 'tableHead' },
                                    { text: 'Precio día', style: 'tableHead' },
                                    { text: 'Cant. x días', style: 'tableHead' },
                                    { text: 'Total', style: 'tableHead' },
                                ],
                                [
                                    { text: quote.item.equipmentName, style: 'tableValue' },
                                    { text: quote.item.equipmentCategory, style: 'tableValue' },
                                    { text: formatCurrency(quote.item.unitPrice), style: 'tableValue' },
                                    { text: `${quote.item.quantity} x ${quote.item.rentalDays}`, style: 'tableValue' },
                                    { text: formatCurrency(quote.total), style: 'tableValueStrong' },
                                ],
                            ],
                        },
                        layout: {
                            fillColor: (rowIndex) => (rowIndex === 0 ? '#eef2ff' : null),
                            hLineColor: () => '#dbe4f0',
                            vLineColor: () => '#dbe4f0',
                        },
                        margin: [0, 6, 0, 14],
                    },
                    {
                        columns: [
                            { width: '*', text: '' },
                            {
                                width: 220,
                                table: {
                                    widths: ['55%', '45%'],
                                    body: [
                                        [{ text: 'Subtotal', style: 'summaryLabel' }, { text: formatCurrency(quote.total), style: 'summaryValue' }],
                                        [{ text: 'IVA', style: 'summaryLabel' }, { text: '$0', style: 'summaryValue' }],
                                        [{ text: 'Total', style: 'summaryTotalLabel' }, { text: formatCurrency(quote.total), style: 'summaryTotalValue' }],
                                    ],
                                },
                                layout: 'lightHorizontalLines',
                            },
                        ],
                        margin: [0, 0, 0, 16],
                    },
                    quote.notes
                        ? {
                            stack: [
                                { text: 'Observaciones', style: 'sectionTitle' },
                                { text: quote.notes, style: 'notesText', margin: [0, 4, 0, 0] },
                            ],
                        }
                        : { text: '' },
                ],
                images: {
                    companyLogo: logoDataUrl,
                    watermarkLogo: logoDataUrl,
                },
                styles: {
                    headerTitle: { fontSize: 12, bold: true, color: '#0f172a' },
                    headerSubtitle: { fontSize: 9, color: '#475569' },
                    headerMeta: { fontSize: 9, color: '#334155' },
                    sectionTitle: { fontSize: 11, bold: true, color: '#0f172a' },
                    tableHead: { fontSize: 9, bold: true, color: '#0f172a', margin: [0, 4, 0, 4] },
                    tableLabel: { fontSize: 9, bold: true, color: '#334155' },
                    tableValue: { fontSize: 9, color: '#1e293b' },
                    tableValueStrong: { fontSize: 9, bold: true, color: '#0f172a' },
                    summaryLabel: { fontSize: 9, color: '#334155' },
                    summaryValue: { fontSize: 9, color: '#1e293b', alignment: 'right' },
                    summaryTotalLabel: { fontSize: 10, bold: true, color: '#0f172a' },
                    summaryTotalValue: { fontSize: 10, bold: true, color: '#0f172a', alignment: 'right' },
                    notesText: { fontSize: 9, color: '#334155' },
                    footerText: { fontSize: 8, color: '#64748b' },
                },
                defaultStyle: {
                    fontSize: 9,
                },
            }

            pdfMakeWithFonts.createPdf(docDefinition).download(`cotizacion-${quote.id}.pdf`)
        } catch {
            notify({
                message: 'No fue posible generar el PDF de la cotización',
                type: 'error',
            })
        }
    }

    const onCreateQuote = handleSubmit(async (data) => {
        const selectedClient = users.find((user) => user.id === data.clientId)
        const equipment = equipmentList.find((item) => item.id === data.equipmentId)

        if (!selectedClient || !equipment) {
            notify({
                message: 'Debes seleccionar un cliente y un equipo válidos',
                type: 'error',
            })
            return
        }

        const lineTotal = equipment.rentalPrice * data.quantity * data.rentalDays
        const newQuote: SavedQuote = {
            id: `cot-${Date.now()}`,
            createdAt: new Date().toISOString().slice(0, 10),
            clientId: selectedClient.id,
            clientName: selectedClient.fullName,
            clientDocument: selectedClient.document,
            item: {
                equipmentId: equipment.id,
                equipmentName: equipment.name,
                equipmentCategory: equipment.category,
                unitPrice: equipment.rentalPrice,
                quantity: data.quantity,
                rentalDays: data.rentalDays,
                total: lineTotal,
            },
            total: lineTotal,
            notes: data.notes?.trim() || undefined,
        }

        const nextQuotes = [newQuote, ...quotes]
        persistQuotes(nextQuotes)
        reset({
            clientId: '',
            equipmentId: '',
            quantity: 1,
            rentalDays: 1,
            notes: '',
        })
        notify({
            message: 'Cotización guardada correctamente',
            type: 'success',
        })
    })

    const hasCatalogs = users.length > 0 && equipmentList.length > 0

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
                        <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>Gestion de cotizaciones</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: alpha('#0f172a', 0.68), mt: 0.2 }}>
                            Crea cotizaciones con base en clientes y equipos registrados
                        </Typography>
                    </Box>
                    <Button size="small" variant="outlined" onClick={reloadCatalogs} sx={{ textTransform: 'none' }}>
                        Recargar clientes y equipos
                    </Button>
                </Stack>
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 1fr) minmax(0, 1.9fr)' },
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
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.2 }}>Crear cotización</Typography>

                    {!hasCatalogs && (
                        <Box sx={{ mb: 1.2, color: alpha('#0f172a', 0.7), fontSize: '0.8rem' }}>
                            Primero registra al menos 1 cliente y 1 equipo para poder cotizar.
                        </Box>
                    )}

                    <Stack component="form" onSubmit={onCreateQuote} spacing={1.2}>
                        <TextField
                            label="Cliente"
                            size="small"
                            select
                            defaultValue=""
                            {...register('clientId')}
                            error={!!errors.clientId}
                            helperText={errors.clientId?.message}
                        >
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.fullName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Equipo"
                            size="small"
                            select
                            defaultValue=""
                            {...register('equipmentId')}
                            error={!!errors.equipmentId}
                            helperText={errors.equipmentId?.message}
                        >
                            {equipmentList.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Cantidad"
                            size="small"
                            type="number"
                            inputProps={{ min: 1 }}
                            {...register('quantity', { valueAsNumber: true })}
                            error={!!errors.quantity}
                            helperText={errors.quantity?.message}
                        />

                        <TextField
                            label="Dias de alquiler"
                            size="small"
                            type="number"
                            inputProps={{ min: 1 }}
                            {...register('rentalDays', { valueAsNumber: true })}
                            error={!!errors.rentalDays}
                            helperText={errors.rentalDays?.message}
                        />

                        <TextField
                            label="Observaciones"
                            size="small"
                            multiline
                            minRows={2}
                            {...register('notes')}
                            error={!!errors.notes}
                            helperText={errors.notes?.message}
                        />

                        <Paper
                            elevation={0}
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                border: `1px solid ${alpha('#64748b', 0.2)}`,
                                backgroundColor: alpha('#ffffff', 0.84),
                            }}
                        >
                            <Typography sx={{ fontSize: '0.8rem', color: alpha('#0f172a', 0.72) }}>Total estimado</Typography>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700 }}>{formatCurrency(estimatedTotal)}</Typography>
                        </Paper>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Plus size={16} />}
                            disabled={isSubmitting || !hasCatalogs}
                            sx={{
                                mt: 0.4,
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                backgroundColor: '#FF7F00',
                                '&:hover': { backgroundColor: '#e67000' },
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar cotización'}
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
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1.2 }}>Historial de cotizaciones</Typography>
                    <Divider sx={{ mb: 1.2 }} />

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <TableContainer sx={{ maxHeight: 450, overflowX: 'auto' }}>
                            <Table stickyHeader size="small" aria-label="tabla de cotizaciones">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Consecutivo</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Equipo</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>PDF</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quotes.map((quote) => (
                                        <TableRow key={quote.id} hover>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{quote.id}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{quote.clientName}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{quote.item.equipmentName}</TableCell>
                                            <TableCell sx={{ fontSize: '0.8rem' }}>{formatCurrency(quote.total)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<FileDown size={14} />}
                                                    onClick={() => void generateQuotePdf(quote)}
                                                    sx={{ textTransform: 'none' }}
                                                >
                                                    Generar PDF
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Stack sx={{ display: { xs: 'flex', md: 'none' } }} spacing={1.1}>
                        {quotes.map((quote) => (
                            <Paper
                                key={quote.id}
                                elevation={0}
                                sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha('#64748b', 0.16)}`,
                                    backgroundColor: alpha('#ffffff', 0.84),
                                }}
                            >
                                <Stack spacing={0.7}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.84rem' }}>{quote.clientName}</Typography>
                                    <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72) }}>
                                        Equipo: {quote.item.equipmentName}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.77rem', color: alpha('#0f172a', 0.72) }}>
                                        Total: {formatCurrency(quote.total)}
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<FileDown size={14} />}
                                        onClick={() => void generateQuotePdf(quote)}
                                        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                                    >
                                        Generar PDF
                                    </Button>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>

                    {quotes.length === 0 && (
                        <Box sx={{ py: 4, textAlign: 'center', color: alpha('#0f172a', 0.6), fontSize: '0.85rem' }}>
                            Aun no has creado cotizaciones.
                        </Box>
                    )}
                </Paper>
            </Box>
        </Stack>
    )
}
