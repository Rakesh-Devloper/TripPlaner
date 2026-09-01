// Destination Model & In-memory Store
import { initialDestinations } from '../utils/seedData.js';

let destinations = [...initialDestinations];

export const DestinationModel = {
  getAll: () => [...destinations],

  getById: (id) => {
    return destinations.find((d) => d.id === id) || null;
  },

  search: (query) => {
    const q = (query || '').toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }
};

export default DestinationModel;
