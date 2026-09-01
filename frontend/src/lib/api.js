export const api = {
  // AI Endpoints
  async planTrip(params) {
    try {
      const res = await fetch('/api/ai/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err) {
      console.error('API planTrip failed, falling back:', err);
      return { success: false };
    }
  },

  async askChat(message, context) {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      return await res.json();
    } catch (err) {
      console.error('API askChat error:', err);
      return {
        success: true,
        text: 'I can assist you with recommendations for flights, villas, dining, and scenic trails! What would you like to plan?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  },

  // Trips
  async getTrips() {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      return data.trips || [];
    } catch {
      return [];
    }
  },

  async createTrip(trip) {
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });
      const data = await res.json();
      return data.trip;
    } catch {
      return null;
    }
  },

  async deleteTrip(id) {
    await fetch(`/api/trips/${id}`, { method: 'DELETE' });
  },

  // Bookings
  async getBookings() {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      return data.bookings || [];
    } catch {
      return [];
    }
  },

  async createBooking(booking) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return await res.json();
  },

  // Saved places
  async getSavedPlaces() {
    try {
      const res = await fetch('/api/saved-places');
      const data = await res.json();
      return data.savedPlaces || [];
    } catch {
      return [];
    }
  },

  async toggleSavedPlace(place) {
    const res = await fetch('/api/saved-places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(place),
    });
    return await res.json();
  },

  // Expenses
  async getExpenses() {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      return data.expenses || [];
    } catch {
      return [];
    }
  },

  async addExpense(expense) {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return await res.json();
  },

  // Notifications
  async markNotificationRead(id) {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead() {
    await fetch('/api/notifications/read-all', { method: 'PUT' });
  },
};
