import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Menu,
    Moon,
    Sun,
    type LucideIcon,
    UserRound,
} from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '@services/api/auth.service'

const expandedDrawerWidth = 244
const collapsedDrawerWidth = 64
const themeStorageKey = 'hym-theme-mode'

interface NavItem {
    label: string
    to: string
    icon: LucideIcon
}

const navItems: NavItem[] = [{ label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard }, { label: 'Users', to: '/app/users', icon: UserRound }, { label: 'Settings', to: '/app/settings', icon: Moon }]

export default function AdminLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem(themeStorageKey)
        return storedTheme ? storedTheme === 'dark' : true
    })
    const location = useLocation()
    const navigate = useNavigate()

    const sidebarWidth = isSidebarCollapsed ? collapsedDrawerWidth : expandedDrawerWidth
    const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev)

    useEffect(() => {
        localStorage.setItem(themeStorageKey, isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const visual = useMemo(
        () =>
            isDarkMode
                ? {
                    appBackground: `radial-gradient(circle at 12% 8%, rgba(56, 130, 246, 0.12) 0%, transparent 30%),
                          radial-gradient(circle at 88% 12%, rgba(14, 165, 233, 0.1) 0%, transparent 32%),
                          linear-gradient(165deg, #091326 0%, #0b1b33 55%, #0f2744 100%)`,
                    drawerGradient: 'linear-gradient(145deg, rgba(11, 27, 51, 0.88) 0%, rgba(7, 21, 40, 0.9) 100%)',
                    drawerBorder: 'rgba(148, 163, 184, 0.24)',
                    drawerShadow: '0 12px 36px rgba(2, 8, 23, 0.45)',
                    drawerHoverShadow: '0 14px 42px rgba(2, 8, 23, 0.52)',
                    textPrimary: '#e2e8f0',
                    textSecondary: 'rgba(226, 232, 240, 0.72)',
                    glassSurface: 'rgba(15, 34, 58, 0.6)',
                    glassBorder: 'rgba(148, 163, 184, 0.24)',
                    glassHover: 'rgba(30, 56, 94, 0.64)',
                    navActiveBg: 'rgba(56, 189, 248, 0.2)',
                    navActiveBorder: 'rgba(56, 189, 248, 0.5)',
                    navIdleBg: 'rgba(148, 163, 184, 0.08)',
                    navIdleBorder: 'rgba(148, 163, 184, 0.2)',
                    navHoverBg: 'rgba(56, 189, 248, 0.15)',
                    brandGradient: 'linear-gradient(145deg, rgba(37, 99, 235, 0.95) 0%, rgba(8, 145, 178, 0.92) 100%)',
                    toolbarBg: 'rgba(10, 25, 47, 0.78)',
                    toolbarBorder: 'rgba(148, 163, 184, 0.22)',
                    toolbarShadow: '0 14px 28px rgba(2, 8, 23, 0.4)',
                    primaryAccent: '#38bdf8',
                }
                : {
                    appBackground: `radial-gradient(circle at 12% 10%, rgba(59, 130, 246, 0.15) 0%, transparent 34%),
                          radial-gradient(circle at 90% 0%, rgba(45, 212, 191, 0.12) 0%, transparent 40%),
                          linear-gradient(165deg, #f6f8fc 0%, #eef3fb 60%, #e7edf7 100%)`,
                    drawerGradient: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(246, 249, 255, 0.88) 100%)',
                    drawerBorder: 'rgba(71, 85, 105, 0.16)',
                    drawerShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
                    drawerHoverShadow: '0 14px 38px rgba(15, 23, 42, 0.16)',
                    textPrimary: '#1e293b',
                    textSecondary: 'rgba(30, 41, 59, 0.65)',
                    glassSurface: 'rgba(255, 255, 255, 0.68)',
                    glassBorder: 'rgba(71, 85, 105, 0.16)',
                    glassHover: 'rgba(255, 255, 255, 0.86)',
                    navActiveBg: 'rgba(14, 165, 233, 0.14)',
                    navActiveBorder: 'rgba(14, 165, 233, 0.32)',
                    navIdleBg: 'rgba(100, 116, 139, 0.06)',
                    navIdleBorder: 'rgba(100, 116, 139, 0.14)',
                    navHoverBg: 'rgba(14, 165, 233, 0.1)',
                    brandGradient: 'linear-gradient(145deg, rgba(59, 130, 246, 0.94) 0%, rgba(20, 184, 166, 0.9) 100%)',
                    toolbarBg: 'rgba(255, 255, 255, 0.82)',
                    toolbarBorder: 'rgba(71, 85, 105, 0.14)',
                    toolbarShadow: '0 12px 26px rgba(15, 23, 42, 0.12)',
                    primaryAccent: '#0284c7',
                },
        [isDarkMode]
    )

    const drawerContent = useMemo(
        () => (
            <Box
                sx={{
                    height: '100%',
                    px: isSidebarCollapsed ? 0.8 : 1.2,
                    py: 1.2,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: visual.drawerGradient,
                    backdropFilter: 'blur(22px) saturate(160%)',
                    borderRight: `1px solid ${visual.drawerBorder}`,
                    boxShadow: visual.drawerShadow,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: `linear-gradient(160deg, ${alpha('#ffffff', isDarkMode ? 0.08 : 0.28)} 0%, transparent 42%)`,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: -80,
                        right: -120,
                        width: 220,
                        height: 220,
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        background: `radial-gradient(circle, ${alpha(visual.primaryAccent, isDarkMode ? 0.18 : 0.12)} 0%, transparent 70%)`,
                    },
                }}
            >
                <Box
                    sx={{
                        p: isSidebarCollapsed ? 1 : 1.35,
                        borderRadius: '16px',
                        background: visual.brandGradient,
                        color: '#f8fafc',
                        minHeight: isSidebarCollapsed ? 62 : 84,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        border: `1px solid ${alpha('#ffffff', 0.22)}`,
                        boxShadow: `0 10px 22px ${alpha('#020617', 0.24)}`,
                        mb: 1.1,
                        alignItems: isSidebarCollapsed ? 'center' : 'flex-start',
                    }}
                >
                    {isSidebarCollapsed ? (
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: '10px',
                                display: 'grid',
                                placeItems: 'center',
                                backgroundColor: alpha('#ffffff', 0.18),
                                border: `1px solid ${alpha('#ffffff', 0.34)}`,
                            }}
                        >
                            <LayoutDashboard size={16} />
                        </Box>
                    ) : (
                        <>
                            <Typography
                                variant="overline"
                                sx={{
                                    letterSpacing: '0.08em',
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    opacity: 0.92,
                                    lineHeight: 1.1,
                                }}
                            >
                                Soluciones y Equipos
                            </Typography>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    fontSize: '15px',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                Panel Administrativo
                            </Typography>
                        </>
                    )}
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        mt: 0.35,
                        mb: 0.9,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '1px',
                            backgroundColor: alpha(visual.textSecondary, isDarkMode ? 0.28 : 0.22),
                        }}
                    />
                    <Tooltip title={isSidebarCollapsed ? 'Expandir panel' : 'Colapsar panel'} placement="right">
                        <IconButton
                            onClick={toggleSidebar}
                            aria-label={isSidebarCollapsed ? 'Expandir panel' : 'Colapsar panel'}
                            sx={{
                                display: { xs: 'none', md: 'inline-flex' },
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 4,
                                width: 27,
                                height: 27,
                                borderRadius: '999px',
                                background: `linear-gradient(145deg, ${alpha('#0f172a', isDarkMode ? 0.9 : 0.78)} 0%, ${alpha(
                                    '#1e293b',
                                    isDarkMode ? 0.98 : 0.86
                                )} 100%)`,
                                color: '#e2e8f0',
                                border: `1px solid ${alpha('#94a3b8', 0.35)}`,
                                boxShadow: `0 8px 18px ${alpha('#020617', 0.42)}, inset 0 1px 0 ${alpha('#ffffff', 0.18)}`,
                                transition: 'all 180ms ease',
                                '&:hover': {
                                    transform: 'translateY(-50%) scale(1.06)',
                                    boxShadow: `0 10px 22px ${alpha('#020617', 0.54)}, inset 0 1px 0 ${alpha('#ffffff', 0.24)}`,
                                },
                            }}
                        >
                            {isSidebarCollapsed ? (
                                <ChevronRight strokeWidth={6} />
                            ) : (
                                <ChevronLeft strokeWidth={6} />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>

                <List sx={{ mt: 0, flex: 1, minHeight: 0 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to
                        const Icon = item.icon

                        const itemNode = (
                            <ListItemButton
                                key={item.to}
                                component={NavLink}
                                to={item.to}
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    mb: 0.65,
                                    borderRadius: '12px',
                                    px: isSidebarCollapsed ? 0.75 : 1.05,
                                    py: 0.75,
                                    minHeight: 39,
                                    backgroundColor: isActive ? visual.navActiveBg : visual.navIdleBg,
                                    border: `1px solid ${isActive ? visual.navActiveBorder : visual.navIdleBorder}`,
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: visual.navHoverBg,
                                        transform: 'translateY(-1px)',
                                        boxShadow: `0 6px 14px ${alpha('#020617', isDarkMode ? 0.24 : 0.1)}`,
                                    },
                                }}
                            >
                                <Icon
                                    size={17}
                                    strokeWidth={2.1}
                                    style={{
                                        marginRight: isSidebarCollapsed ? 0 : 8,
                                        color: isActive ? visual.primaryAccent : visual.textSecondary,
                                        flexShrink: 0,
                                    }}
                                />
                                {!isSidebarCollapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 700 : 600,
                                            color: isActive ? visual.primaryAccent : visual.textPrimary,
                                            fontSize: '11.8px',
                                            letterSpacing: '-0.01em',
                                            whiteSpace: 'nowrap',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        )

                        if (isSidebarCollapsed) {
                            return (
                                <Tooltip key={item.to} title={item.label} placement="right">
                                    {itemNode}
                                </Tooltip>
                            )
                        }

                        return itemNode
                    })}
                </List>

                <Box
                    sx={{
                        mt: 'auto',
                        p: isSidebarCollapsed ? 0.85 : 1,
                        borderRadius: '12px',
                        backgroundColor: visual.glassSurface,
                        border: `1px solid ${visual.glassBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                        gap: 1,
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <UserRound size={15} style={{ color: visual.textSecondary, flexShrink: 0 }} />
                    {!isSidebarCollapsed && (
                        <Typography
                            sx={{
                                color: visual.textSecondary,
                                fontSize: '10px',
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            Modo Administrador
                        </Typography>
                    )}
                </Box>
            </Box>
        ),
        [isSidebarCollapsed, isDarkMode, location.pathname, visual]
    )

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: visual.appBackground,
                transition: 'background 260ms ease',
            }}
        >
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                variant="temporary"
                ModalProps={{
                    keepMounted: true,
                    BackdropProps: {
                        sx: {
                            backgroundColor: alpha('#020617', 0.35),
                            backdropFilter: 'blur(8px)',
                        },
                    },
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: expandedDrawerWidth,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${visual.drawerBorder}`,
                        background: visual.drawerGradient,
                        boxShadow: visual.drawerShadow,
                        color: visual.textPrimary,
                        overflow: 'hidden',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                open
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: sidebarWidth,
                    flexShrink: 0,
                    transition: 'width 340ms cubic-bezier(0.22, 1, 0.36, 1)',
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                        boxSizing: 'border-box',
                        borderRight: `1px solid ${visual.drawerBorder}`,
                        background: visual.drawerGradient,
                        boxShadow: visual.drawerShadow,
                        backdropFilter: 'blur(22px) saturate(160%)',
                        transition: 'width 340ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms ease',
                        color: visual.textPrimary,
                        overflow: 'hidden',
                        '&:hover': {
                            boxShadow: visual.drawerHoverShadow,
                        },
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    transition: 'all 340ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
            >
                <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 10, px: { xs: 2, md: 3 }, pt: 1.8 }}>
                    <Toolbar
                        disableGutters
                        sx={{
                            px: 1.8,
                            minHeight: { xs: 56, md: 64 },
                            borderRadius: 3,
                            background: visual.toolbarBg,
                            backdropFilter: 'blur(14px) saturate(160%)',
                            border: `1px solid ${visual.toolbarBorder}`,
                            boxShadow: visual.toolbarShadow,
                            justifyContent: 'space-between',
                            gap: 1,
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0, flex: 1 }}>
                            <Button
                                onClick={() => setMobileOpen(true)}
                                sx={{
                                    display: { xs: 'inline-flex', md: 'none' },
                                    minWidth: 0,
                                    color: visual.textPrimary,
                                    backgroundColor: alpha(visual.glassSurface, 0.9),
                                    border: `1px solid ${visual.glassBorder}`,
                                    borderRadius: 2,
                                    px: 1.05,
                                }}
                            >
                                <Menu size={17} />
                            </Button>
                            <Typography
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    color: visual.textPrimary,
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.94rem',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                Plataforma H y M
                            </Typography>
                            <Typography
                                sx={{
                                    display: { xs: 'block', sm: 'none' },
                                    color: visual.textPrimary,
                                    fontWeight: 700,
                                    fontSize: '0.86rem',
                                }}
                            >
                                H y M
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                            <Tooltip title={isDarkMode ? 'Activar tema claro' : 'Activar tema oscuro'}>
                                <IconButton
                                    onClick={() => setIsDarkMode((prev) => !prev)}
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 2,
                                        color: visual.textPrimary,
                                        backgroundColor: alpha(visual.glassSurface, 0.9),
                                        border: `1px solid ${visual.glassBorder}`,
                                        '&:hover': { backgroundColor: visual.glassHover },
                                    }}
                                >
                                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                </IconButton>
                            </Tooltip>

                            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: visual.textPrimary, fontSize: '12px' }}>
                                    Administrador
                                </Typography>
                                <Typography variant="caption" sx={{ color: visual.textSecondary, fontSize: '10px' }}>
                                    Sesion activa
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    authService.logout()
                                    navigate('/login', { replace: true })
                                }}
                                sx={{
                                    textTransform: 'none',
                                    ml: { xs: 0, md: 0.6 },
                                    width: { xs: '100%', sm: 'auto' },
                                    whiteSpace: 'nowrap',
                                    borderColor: visual.glassBorder,
                                    color: visual.textPrimary,
                                    backgroundColor: alpha(visual.glassSurface, 0.55),
                                    fontSize: '0.74rem',
                                    '&:hover': {
                                        borderColor: visual.primaryAccent,
                                        backgroundColor: alpha(visual.navHoverBg, 0.8),
                                    },
                                }}
                            >
                                Cerrar sesion
                            </Button>
                        </Box>
                    </Toolbar>
                </Box>

                <Box component="main" sx={{ px: { xs: 2, md: 3 }, py: 2.5 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}
