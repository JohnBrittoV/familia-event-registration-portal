export const PrayerMarquee = ({ recentBookings }) => {
    if (!recentBookings.length) return <span className="text-slate-400 italic">Be the first to offer a prayer!</span>;
    return (
        <div className="flex animate-marquee w-max gap-6">
            {recentBookings.map(b => <span key={b.id} className="text-slate-600 dark:text-slate-300">{b.userName} • {b.prayerType}</span>)}
        </div>
    );
};