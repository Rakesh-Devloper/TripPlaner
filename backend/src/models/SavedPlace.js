// SavedPlace Model & In-memory Store
import { initialSavedPlaces } from '../utils/seedData.js';

let savedPlaces = [...initialSavedPlaces];

export const SavedPlaceModel = {
  getAll: () => [...savedPlaces],

  create: (placeData) => {
    const newSaved = {
      id: placeData.id || `sav_${Date.now()}`,
      ...placeData,
      addedAt: 'Just now',
    };
    savedPlaces.unshift(newSaved);
    return newSaved;
  },

  delete: (id) => {
    const prevLen = savedPlaces.length;
    savedPlaces = savedPlaces.filter((s) => s.id !== id);
    return savedPlaces.length < prevLen;
  },
};

export default SavedPlaceModel;
