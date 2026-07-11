export const PrayerCard = ({ title, icon, type, isDateBased, onAction }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex flex-col items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center gap-2 mb-3">
                <div className="text-[#3B6AB0] dark:text-blue-400">{icon}</div>
                <span className="font-bold text-slate-800 dark:text-white text-center">{title}</span>
            </div>
            <button onClick={() => onAction(title)} className="w-full py-2 rounded-full bg-[#3B6AB0] text-white font-medium hover:bg-[#2E5591]">
                {isDateBased ? 'Book This Date' : 'Pray Now'}
            </button>
        </div>
    );
};