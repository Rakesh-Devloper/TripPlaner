// Trip Model & In-memory Store
import { initialTrips } from '../utils/seedData.js';

let trips = [...initialTrips];

export const TripModel = {
  getAll: () => [...trips],

  getById: (id) => {
    return trips.find((t) => t.id === id) || null;
  },

  create: (tripData) => {
    const newTrip = {
      id: tripData.id || `trip_${Date.now()}`,
      title: tripData.title || tripData.destination || 'New Adventure',
      destination: tripData.destination || 'Global',
      country: tripData.country || 'Global',
      image: tripData.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      status: tripData.status || 'Planning',
      startDate: tripData.startDate || 'Jun 1, 2025',
      endDate: tripData.endDate || 'Jun 7, 2025',
      days: tripData.days || 6,
      travelers: tripData.travelers || '2 Travelers',
      travelersCount: tripData.travelersCount || 2,
      tripType: tripData.tripType || 'Adventure',
      estimatedCost: tripData.estimatedCost || 999,
      actualCost: tripData.actualCost || 0,
      activitiesCount: tripData.activitiesCount || 8,
      progress: tripData.progress || 20,
      budgetBreakdown: tripData.budgetBreakdown || { flights: 400, hotels: 300, activities: 150, food: 100, transport: 49 },
      daysItinerary: tripData.daysItinerary || [],
      travelTips: tripData.travelTips || [],
      recommendedHotels: tripData.recommendedHotels || [],
    };
    trips.unshift(newTrip);
    return newTrip;
  },

  update: (id, updates) => {
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) return null;
    trips[index] = { ...trips[index], ...updates };
    return trips[index];
  },

  delete: (id) => {
    const prevLen = trips.length;
    trips = trips.filter((t) => t.id !== id);
    return trips.length < prevLen;
  },
};

export default TripModel;
