// Booking Model & In-memory Store
import { initialBookings } from '../utils/seedData.js';

let bookings = [...initialBookings];

export const BookingModel = {
  getAll: () => [...bookings],

  getById: (id) => {
    return bookings.find((b) => b.id === id) || null;
  },

  create: (bookingData) => {
    const newBooking = {
      id: bookingData.id || `book_${Date.now()}`,
      ...bookingData,
      status: bookingData.status || 'Confirmed',
    };
    bookings.unshift(newBooking);
    return newBooking;
  },

  delete: (id) => {
    const prevLen = bookings.length;
    bookings = bookings.filter((b) => b.id !== id);
    return bookings.length < prevLen;
  },
};

export default BookingModel;
