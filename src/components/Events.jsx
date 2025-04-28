import { useState } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { loadEventsFromStorage, saveEventsToFile } from '../utils/eventUtils';

const Events = () => {
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'category'
  const [editingEvent, setEditingEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events, setEvents] = useState(() => loadEventsFromStorage().map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.startTime,
    location: 'Event Location',
    description: event.title,
    category: 'Event',
  })));

  const today = new Date();
  const sortEvents = (eventList) => {
    return [...eventList].sort((a, b) => {
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return new Date(a.date) - new Date(b.date);
    });
  };

  const upcomingEvents = sortEvents(
    events.filter(event => new Date(event.date) >= today)
  );
  const pastEvents = sortEvents(
    events.filter(event => new Date(event.date) < today)
  ).reverse();

  const handleSaveEvent = async (updatedEvent) => {
    let newEvents;
    if (updatedEvent.id) {
      newEvents = events.map(event => event.id === updatedEvent.id ? updatedEvent : event);
    } else {
      const newEvent = {
        ...updatedEvent,
        id: Date.now().toString(),
      };
      newEvents = [...events, newEvent];
    }
    setEvents(newEvents);
    await saveEventsToFile(newEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      startTime: event.time,
      endTime: event.time,
      color: '#4287f5'
    })));
    setEditingEvent(null);
  };

  const EventEditModal = ({ event, onSave, onClose }) => {
    const [formData, setFormData] = useState(event);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Community">Community</option>
                <option value="Art">Art</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsAddingEvent(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EventCard = ({ event }) => {
    const isUpcoming = new Date(event.date) >= today;
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${isUpcoming ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-300'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <button
              onClick={() => setEditingEvent(event)}
              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <FaEdit className="w-4 h-4" />
            </button>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            {
              'Music': 'bg-purple-100 text-purple-800',
              'Technology': 'bg-blue-100 text-blue-800',
              'Community': 'bg-green-100 text-green-800',
              'Art': 'bg-pink-100 text-pink-800'
            }[event.category] || 'bg-gray-100 text-gray-800'
          }`}>
            {event.category}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FaCalendar className="mr-2 text-blue-500" />
            {new Date(event.date).toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 text-green-500" />
            {event.time}
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            {event.location}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Event
          </button>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md py-1 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-gray-500">No upcoming events scheduled</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Events</h2>
        {pastEvents.length > 0 ? (
          pastEvents.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-gray-500">No past events</p>
        )}
      </div>
      {(editingEvent || isAddingEvent) && (
        <EventEditModal
          event={editingEvent || {
            id: '',
            title: '',
            date: new Date().toISOString().split('T')[0],
            time: '',
            location: '',
            description: '',
            category: 'Music'
          }}
          onSave={handleSaveEvent}
          onClose={() => {
            setEditingEvent(null);
            setIsAddingEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default Events;