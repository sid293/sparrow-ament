import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { loadEventsFromStorage } from '../utils/eventUtils';
import { saveEventsToFile } from '../utils/eventUtils';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState(() => loadEventsFromStorage().map(event => ({
    ...event,
    location: event.location || 'Event Location',
    description: event.description || event.title,
    category: event.category || 'Event'
  })));
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getDayEvents = (date) => {
    const dayEvents = eventsList.filter(event => isSameDay(new Date(event.date), date));
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
            onClick={() => setSelectedEvent({id: '', title: '', date: format(new Date(), 'yyyy-MM-dd'), startTime: '', endTime: '', color: '#4287f5', location: '', description: '', category: 'Event'})}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Event
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
              className={`min-h-[120px] rounded-lg p-2 transition-all border border-gray-200 ${isToday ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md' : 'hover:bg-gray-50'}`}
            >
              <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="mt-2 space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`text-xs p-2 rounded-md shadow-sm transition-transform hover:scale-105 relative cursor-pointer ${event.isOverlapping ? 'hover:z-10' : ''}`}
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

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Event</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={selectedEvent.date}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={selectedEvent.startTime}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, startTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={selectedEvent.endTime}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, endTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={selectedEvent.location}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedEvent.category}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Music">Music</option>
                  <option value="Technology">Technology</option>
                  <option value="Community">Community</option>
                  <option value="Art">Art</option>
                </select>
              </div>
              <div className="flex justify-between space-x-3 mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    const updatedEvents = eventsList.filter(e => e.id !== selectedEvent.id);
                    await saveEventsToFile(updatedEvents);
                    setEventsList(updatedEvents);
                    setSelectedEvent(null);
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      let updatedEvents;
                      if (selectedEvent.id) {
                        updatedEvents = eventsList.map(e => e.id === selectedEvent.id ? selectedEvent : e);
                      } else {
                        const newEvent = {
                          ...selectedEvent,
                          id: Date.now().toString()
                        };
                        updatedEvents = [...eventsList, newEvent];
                      }
                      await saveEventsToFile(updatedEvents);
                      setEventsList(updatedEvents);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;