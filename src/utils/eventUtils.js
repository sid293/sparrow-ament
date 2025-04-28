import eventsData from '../data/events.json';

let events = eventsData.events;

export const saveEventsToFile = async (newEvents) => {
  try {
    events = newEvents;
    return true;
  } catch (error) {
    console.error('Error saving events:', error);
    return false;
  }
};

export const loadEventsFromStorage = () => {
  try {
    return events;
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};