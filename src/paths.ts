import Icons from '@icons'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
    label: string
    to: string
    icon: LucideIcon
}

export const pathsNavItems: NavItem[] =
    [
        { label: 'Panel', to: '/app/panel', icon: Icons.Panel },
        { label: 'Usuarios', to: '/app/usuarios', icon: Icons.Usuarios },
        { label: 'Equipos', to: '/app/equipos', icon: Icons.Equipos },
        { label: 'Cotizaciones', to: '/app/cotizaciones', icon: Icons.Cotizaciones },

        { label: 'Configuración', to: '/app/configuracion', icon: Icons.Configuracion },
    ]