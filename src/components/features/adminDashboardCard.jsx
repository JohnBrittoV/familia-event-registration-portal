import { HeartHandshake, Users, CalendarCheck, ShieldAlert } from "lucide-react";
import prayerPicture from '../../assets/images/Prayer.svg';
import admissionPicture from '../../assets/images/Family.svg';
import resourcePicture from '../../assets/images/Resource.svg';
import trackPicture from '../../assets/images/History.svg';

export const adminDashboardCards = [
    {
        title: "Prayer Intentions Review",
        description: "Moderate, organize, prayers and view prayer offerings",
        buttonText: "Moderate Intentions",
        path: "/admin/prayer-intentions",
        icon: HeartHandshake,
        illustration: prayerPicture,
    },
    {
        title: "Participants Confirmation",
        description: "Confirm participant registrations, manage room allocations",
        buttonText: "Manage Admissions",
        path: "/admin/admissions",
        icon: Users,
        illustration: admissionPicture,
    },
    {
        title: "Resource Caring & Schedule",
        description: "Manage resource details, room allocating, and the event schedule.",
        buttonText: "Resource Caring Schedule",
        path: "/admin/schedule-resources",
        icon: CalendarCheck,
        illustration: resourcePicture,
    },
    {
        title: "Acitivity & History",
        description: "Monitor responsible persons activities and track history.",
        buttonText: "Responsible Audit Log",
        path: "/admin/rp-audit",
        icon: ShieldAlert,
        illustration: trackPicture,
    }
];