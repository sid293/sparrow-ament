import { useState } from 'react';
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const Events = () => {
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'category'
  const [events] = useState([
    {
      id: 1,
      title: 'Summer Music Festival',
      date: '2024-07-15',
      time: '14:00',
      location: 'Central Park',
      description: 'Annual summer music festival featuring local artists',
      category: 'Music',
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      date: '2024-03-20',
      time: '09:00',
      location: 'Convention Center',
      description: 'Latest trends in technology and innovation',
      category: 'Technology',
    },
    {
      id: 3,
      title: 'Community Cleanup',
      date: '2023-12-10',
      time: '08:00',
      location: 'City Beach',
      description: 'Join us in keeping our beaches clean',
      category: 'Community',
    },
    {
      id: 4,
      title: 'Winter Art Exhibition',
      date: '2023-11-25',
      time: '10:00',
      location: 'Art Gallery',
      description: 'Showcasing local artists winter collections',
      category: 'Art',
    },
  ]);

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

  const EventCard = ({ event }) => {
    const isUpcoming = new Date(event.date) >= today;
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${isUpcoming ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-300'}`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
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
//   );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Events</h1>
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
    </div>
  );
};

export default Events;