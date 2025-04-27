import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import events from '../data/events.json';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getDayEvents = (date) => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.date), date));
    return dayEvents.map((event, index) => {
      const overlappingEvents = dayEvents.filter(e => 
        e.id !== event.id &&
        ((e.startTime <= event.startTime && e.endTime > event.startTime) ||
         (e.startTime < event.endTime && e.endTime >= event.endTime))
      );
      return { ...event, isOverlapping: overlappingEvents.length > 0, index };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 pb-4">
            {day}
          </div>
        ))}

        {daysInMonth.map(day => {
          const dayEvents = getDayEvents(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] rounded-lg p-2 transition-all ${isToday ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' : 'hover:bg-gray-50'}`}
            >
              <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded-md shadow-sm transition-transform hover:scale-105 relative ${event.isOverlapping ? 'hover:z-10' : ''}`}
                    style={{
                      backgroundColor: event.color + (event.isOverlapping ? '15' : '20'),
                      borderLeft: `3px solid ${event.color}`,
                      transform: event.isOverlapping ? `translateX(${event.index * 4}px)` : 'none',
                      marginRight: event.isOverlapping ? '-4px' : '0',
                      zIndex: event.isOverlapping ? 1 : 'auto'
                    }}
                  >
                    <div className="font-medium flex items-center gap-1" style={{ color: event.color }}>
                      {event.title}
                      {event.isOverlapping && (
                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                      )}
                    </div>
                    <div className="text-gray-600 mt-0.5">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;