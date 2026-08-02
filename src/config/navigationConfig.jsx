import { LayoutDashboard, Users, Cross, FileText,
         FileUser, ChartLine, HandHelping, UserPlus,
         Download, Heart, MessageSquare } from 'lucide-react'

export const navItems = [
    
    // Admin / owner sidebar
    
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
        allowedRoles: ['admin', 'owner']
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
        label: 'Reports',
        path: '/admin/export',
        icon: Download,
        allowedRoles: ['admin', 'owner']
    },

    // Responsible persons sidebar
    {
        id: 'rp-dashboard',
        label: 'Overview',
        path: '/rp/dashboard',
        icon: LayoutDashboard,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'rp-new-participant',
        label: 'New Registration',
        path: '/rp/new-participant',
        icon: UserPlus,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'rp-my-registrations',
        label: 'My Submissions',
        path: '/rp/my-registrations',
        icon: FileText,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'rp-participants-list',
        label: 'Global Roster',
        path: '/rp/participants-list',
        icon: Users,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'prayer-dashboard',
        label: 'Prayer Offerings',
        path: '/prayer-dashboard',
        icon: Heart,
        allowedRoles: ['admin', 'owner', 'responsible_person', 'standard'],
    },

    {
        id: 'rp-export',
        label: 'Report',
        path: '/rp/export',
        icon: Download,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'rp-tech-support',
        label: 'Help & Support',
        path: '/rp/tech-support',
        icon: MessageSquare,
        allowedRoles: ['responsible_person'],
    },

];

