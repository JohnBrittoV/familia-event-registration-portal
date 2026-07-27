import React from "react";
import { usePrayerHistory } from "../hooks/usePrayerHistory";

export const PrayerHistoryTable = ({ currentUser }) => {
  const { userBookings, isLoading } = usePrayerHistory(currentUser.mobile);

  // Helper to format the prayer names beautifully
  const formatPrayerName = (prayerId) => {
    if (prayerId === 'holy_mass') return '⛪ Holy Mass';
    if (prayerId === 'fasting') return '🙏 Fasting Prayer';
    return prayerId;
  };

  if (isLoading) {
    return (
      <div className="card-table p-8 text-center text-slate-500">
        Loading your prayer offerings...
      </div>
    );
  }

  if (userBookings.length === 0) {
    return null; // Don't render the table if they haven't booked anything yet
  }

  return (
    <div className="card-table">
      {/* Table Header */}
      <div className="card-header">
        <h3 className="card-header-title">My Prayer Offerings</h3>
        <p className="card-header-subtitle">Your upcoming and past prayer commitments.</p>
      </div>

      {/* Table Body */}
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-thead">
            <tr>
              <th className="table-th">Date</th>
              <th className="table-th">Dedication Name</th>
              <th className="table-th">Prayers Offered</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {userBookings.map((booking) => (
              <tr key={booking.id} className="table-tr">
                {/* Date */}
                <td className="table-td font-medium text-slate-900 dark:text-slate-200">
                  {booking.date}
                </td>
                
                {/* Dedication Name */}
                <td className="table-td">
                  <div className="table-user-name">{booking.name}</div>
                  <div className="table-user-sub">Recorded by +91 {booking.mobile}</div>
                </td>
                
                {/* Prayers Array mapped nicely */}
                <td className="table-td">
                  <div className="flex flex-col gap-1">
                    {booking.prayers.map((prayer, index) => (
                      <span key={index} className="text-slate-700 dark:text-slate-300 font-medium">
                        {formatPrayerName(prayer)}
                      </span>
                    ))}
                  </div>
                </td>
                
                {/* Status Badge */}
                <td className="table-td">
                  <span className={`badge-status ${
                    new Date(booking.date) >= new Date().setHours(0,0,0,0) 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {new Date(booking.date) >= new Date().setHours(0,0,0,0) ? 'Upcoming' : 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
