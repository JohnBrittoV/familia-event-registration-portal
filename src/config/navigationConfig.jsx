import { LayoutDashboard, Users, Cross, 
         FileUser, ChartLine, HandHelping, 
         Download } from 'lucide-react'

export const adminNavItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin',
        icon: LayoutDashboard,
        allowedRoles: ['admin', 'owner']
    },

    {
        id: 'responsible-persons',
        label: 'Responsible Persons',
        path: '/admin/responsible-persons',
        icon: FileUser,
        allowedRoles: ['admin', 'owner']
    },

    {
        id: 'prayer-partners',
        label: 'Prayer Partners',
        path: '/admin/prayer-partners',
        icon: Cross,
        allowedRoles: ['admin', 'owner']
    },

    {
        id: 'participants',
        label: 'Participants List',
        path: '/admin/participants',
        icon: Users,
        allowedRoles: ['admin', 'responsible_person', 'owner']
    },

    {
        id: 'statistics',
        label: 'Global Statistics',
        path: '/admin/stats',
        icon: ChartLine,
        allowedRoles: ['admin', 'owner']
    },

    {
        id: 'prayer-offerings',
        label: 'Prayer Offerings',
        path: '/admin/prayer-bookings',
        icon: HandHelping,
        allowedRoles: ['admin', 'owner']
    },

    {
        id: 'export',
        label: 'Export Data',
        path: '/admin/export',
        icon: Download,
        allowedRoles: ['admin', 'owner']
    }

];

