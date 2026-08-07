import { LayoutDashboard, Users, Cross, FileText,
         FileUser, ChartLine, HandHelping, UserPlus,
         Download, Heart, MessageSquare, Clock } from 'lucide-react'

// 1. Categorized configuration strictly for Admin / Owner
export const adminNavigation = [
    {
        category: 'CORE',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                path: '/admin',
                icon: LayoutDashboard,
                allowedRoles: ['admin', 'owner']
            }
        ]
    },
    {
        category: 'USER MANAGEMENT',
        items: [
            {
                id: 'responsible-persons',
                label: 'Responsible Persons',
                path: '/admin/responsible-persons',
                icon: FileUser,
                allowedRoles: ['admin', 'owner']
            },
            {
                id: 'participants',
                label: 'Participants List',
                path: '/admin/participants',
                icon: Users,
                allowedRoles: ['admin', 'owner']
            },
            // Note: Added Pending Access here as seen in your screenshot design
            {
                id: 'pending-access',
                label: 'Pending Access',
                path: '/admin/pending',
                icon: Clock, // Make sure to import Clock from lucide-react if used
                allowedRoles: ['admin', 'owner']
            }
        ]
    },
    {
        category: 'CONTENT & SERVICES',
        items: [
            {
                id: 'statistics',
                label: 'Global Statistics',
                path: '/admin/stats',
                icon: ChartLine,
                allowedRoles: ['admin', 'owner']
            },
            {
                id: 'prayer-offerings',
                label: 'Prayer control',
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
            }
        ]
    }
];

// Responsible persons sidebar
export const navItems = [ 
    {
        id: 'rp-dashboard',
        label: 'Dashborad Overview',
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
        label: 'Participants List',
        path: '/rp/global-participants',
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
        label: 'Export Attendees',
        path: '/rp/reports',
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

