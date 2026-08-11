import { LayoutDashboard, Users, ClipboardList, Cross, FileText, UserCog, UserCheck,
         FileUser, ChartNoAxesCombined, ListPlus, UserPlus, HandHeart,
         FileDown, Heart, MessageSquare, Clock3, ShieldCheck } from 'lucide-react'

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
                id: 'pending-access',
                label: 'Pending Access',
                path: '/admin/pending-access',
                icon: Clock3, 
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'prayer-partners',
                label: 'Prayer Partners',
                path: '/admin/prayer-partners',
                icon: HandHeart,
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'responsible-persons',
                label: 'Responsible Persons',
                path: '/admin/responsible-persons',
                icon: UserCog,
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'confirm-list',
                label: 'Confirm Participants',
                path: '/admin/participants-confirmation',
                icon: UserCheck,
                allowedRoles: ['admin', 'owner']
            },
            
        ]
    },
    {
        category: 'CONTENT & SERVICES',
        items: [
            {
                id: 'registration-list',
                label: 'Registration Data',
                path: '/admin/participants',
                icon: ClipboardList,
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'statistics',
                label: 'Global Overview',
                path: '/admin/stats',
                icon: ChartNoAxesCombined,
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'prayer-offerings',
                label: 'Manage Prayers',
                path: '/admin/prayer-bookings',
                icon: ListPlus,
                allowedRoles: ['admin', 'owner']
            },

            {
                id: 'export',
                label: 'Reports',
                path: '/admin/export',
                icon: FileDown,
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
        id: 'rp-registration-list',
        label: 'Registration List',
        path: '/rp/global-registrations',
        icon: Users,
        allowedRoles: ['responsible_person'],
    },

     {
        id: 'rp-prayer-offerings',
        label: 'Prayer Offerings',
        path: '/prayer-dashboard',
        icon: Heart,
        allowedRoles: ['responsible_person'],
    },

    {
        id: 'rp-export',
        label: 'Export Attendees',
        path: '/rp/reports',
        icon: FileDown,
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

export const ownerItems = [
    {
        id: 'admin-control',
        label: 'Admin Controls',
        path: '/admin/admin-controls',
        icon: ShieldCheck,
        allowedRoles: ['owner']
    },
]
