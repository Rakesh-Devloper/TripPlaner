import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  currentUser as initialUser,
  defaultTrip,
  recommendedDestinations,
  initialTripsList,
  initialBookings,
  initialExpenses,
  initialSavedPlaces,
  initialReviews,
  initialNotifications,
} from '../data/seedData';
import { initialChecklistItems, checklistTemplates } from '../data/checklistSeed';
import { generateInitialsAvatar } from '../lib/avatars';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  // Saved profiles registry for remembering previous logins and custom profile images
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('tp_saved_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out legacy names if any
        return parsed.filter(
          (p) =>
            p.user &&
            p.user.name !== 'Alex Morgan' &&
            p.user.name !== 'Guest Explorer' &&
            p.user.name !== 'Explorer' &&
            p.user.name !== 'Guest' &&
            p.user.email !== 'alex.morgan@example.com' &&
            !!p.user.email
        );
      } catch (e) {
        console.error('Error parsing saved profiles', e);
      }
    }
    return [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tp_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.name ||
          parsed.name === 'Alex Morgan' ||
          parsed.name === 'Guest Explorer' ||
          parsed.name === 'Explorer' ||
          parsed.name === 'Guest' ||
          parsed.email === 'alex.morgan@example.com' ||
          parsed.role === 'Guest Explorer' ||
          parsed.role === 'Guest'
        ) {
          const cleanUser = {
            ...initialUser,
            name: 'Traveler',
            email: '',
            avatar: generateInitialsAvatar('Traveler', 'indigo'),
            role: 'Member',
          };
          localStorage.setItem('tp_user', JSON.stringify(cleanUser));
          return cleanUser;
        }
        return parsed;
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
    return initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('tp_auth_status');
    const savedUser = localStorage.getItem('tp_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (
          parsed.name === 'Alex Morgan' ||
          parsed.name === 'Guest Explorer' ||
          parsed.name === 'Explorer' ||
          parsed.name === 'Guest' ||
          parsed.email === 'alex.morgan@example.com' ||
          !parsed.email
        ) {
          localStorage.setItem('tp_auth_status', 'false');
          return false;
        }
      } catch (e) {}
    }
    return savedAuth === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const [activePage, setActivePageState] = useState('Dashboard');
  const [pageHistory, setPageHistory] = useState([]);

  const setActivePage = (page) => {
    if (page === activePage) return;
    setPageHistory((prev) => [...prev, activePage]);
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const prevPage = pageHistory[pageHistory.length - 1];
      setPageHistory((prev) => prev.slice(0, prev.length - 1));
      setActivePageState(prevPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (activePage !== 'Dashboard') {
      setActivePageState('Dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = pageHistory.length > 0 || activePage !== 'Dashboard';
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('tp_trips');
    return saved ? JSON.parse(saved) : initialTripsList;
  });
  const [activeTrip, setActiveTrip] = useState(() => trips[0] || defaultTrip);
  const [destinations] = useState(recommendedDestinations);
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('tp_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('tp_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });
  const [savedPlaces, setSavedPlaces] = useState(() => {
    const saved = localStorage.getItem('tp_saved_places');
    return saved ? JSON.parse(saved) : initialSavedPlaces;
  });
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('tp_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('tp_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [checklists, setChecklists] = useState(() => {
    const saved = localStorage.getItem('tp_checklists');
    return saved ? JSON.parse(saved) : initialChecklistItems;
  });

  // Modal States
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGenerationStep, setAiGenerationStep] = useState(0);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState(null);
  const [showAIResultModal, setShowAIResultModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedDestinationForDetail, setSelectedDestinationForDetail] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapModalLocation, setMapModalLocation] = useState('Bali, Indonesia');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tp_theme');
    if (saved) return saved === 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('tp_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tp_saved_profiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    localStorage.setItem('tp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tp_auth_status', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tp_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('tp_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tp_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('tp_saved_places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem('tp_checklists', JSON.stringify(checklists));
  }, [checklists]);

  // Helper to persist user state & data to savedProfiles registry
  const syncAccountData = (
    updatedUser,
    dataUpdates
  ) => {
    if (!updatedUser.email) return;
    const emailKey = updatedUser.email.trim().toLowerCase();

    setSavedProfiles((prev) => {
      const idx = prev.findIndex((p) => p.user.email.trim().toLowerCase() === emailKey);
      const existing = idx >= 0 ? prev[idx] : null;

      const updatedRecord = {
        user: { ...existing?.user, ...updatedUser },
        trips: dataUpdates?.trips || existing?.trips || trips,
        bookings: dataUpdates?.bookings || existing?.bookings || bookings,
        expenses: dataUpdates?.expenses || existing?.expenses || expenses,
        savedPlaces: dataUpdates?.savedPlaces || existing?.savedPlaces || savedPlaces,
        reviews: dataUpdates?.reviews || existing?.reviews || reviews,
        notifications: dataUpdates?.notifications || existing?.notifications || notifications,
        checklists: dataUpdates?.checklists || existing?.checklists || checklists,
        lastActive: new Date().toISOString(),
      };

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      } else {
        return [updatedRecord, ...prev];
      }
    });
  };

  // Auth methods
  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginWithProfile = (profile) => {
    if (!profile || !profile.user) return;
    
    // Restore profile and all data
    setUser(profile.user);
    if (profile.trips && profile.trips.length > 0) {
      setTrips(profile.trips);
      setActiveTrip(profile.trips[0]);
    }
    if (profile.bookings) setBookings(profile.bookings);
    if (profile.expenses) setExpenses(profile.expenses);
    if (profile.savedPlaces) setSavedPlaces(profile.savedPlaces);
    if (profile.notifications) setNotifications(profile.notifications);
    if (profile.checklists) setChecklists(profile.checklists);

    setIsAuthenticated(true);
    setAuthModalOpen(false);

    // Refresh last active timestamp
    syncAccountData(profile.user);

    const welcomeNotif = {
      id: `notif_${Date.now()}`,
      title: `Welcome back, ${profile.user.name}!`,
      description: 'Your itineraries, bookings, pre-trip checklists, and travel budget have been loaded.',
      time: 'Just now',
      read: false,
      type: 'trip',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);
  };

  const removeSavedProfile = (emailToRemove) => {
    const target = emailToRemove.trim().toLowerCase();
    setSavedProfiles((prev) => prev.filter((p) => p.user.email.trim().toLowerCase() !== target));
  };

  const login = async (email, _password) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Check if this user exists in savedProfiles
    const existingProfile = savedProfiles.find(
      (p) => p.user.email.trim().toLowerCase() === trimmedEmail
    );

    if (existingProfile) {
      loginWithProfile(existingProfile);
      return { success: true };
    }

    // New email login fallback: derive name & create fresh profile
    const derivedName = trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    const newUser = {
      id: `user_${Date.now()}`,
      name: derivedName || 'Traveler',
      email: trimmedEmail,
      avatar: generateInitialsAvatar(derivedName || 'Traveler', 'indigo'),
      role: 'Member',
      tripsCount: initialTripsList.length,
      countriesVisited: 3,
      moneySaved: 450,
      co2Saved: 35,
      plan: 'free',
      memberSince: 'Today',
    };

    setUser(newUser);
    setTrips(initialTripsList);
    setActiveTrip(initialTripsList[0] || defaultTrip);
    setBookings(initialBookings);
    setExpenses(initialExpenses);
    setSavedPlaces(initialSavedPlaces);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    syncAccountData(newUser, {
      trips: initialTripsList,
      bookings: initialBookings,
      expenses: initialExpenses,
      savedPlaces: initialSavedPlaces,
      notifications: initialNotifications,
      checklists: initialChecklistItems,
    });

    const welcomeNotif = {
      id: `notif_${Date.now()}`,
      title: `Welcome, ${newUser.name}!`,
      description: 'Your personal travel workspace is ready with itinerary and booking tools.',
      time: 'Just now',
      read: false,
      type: 'trip',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return { success: true };
  };

  const signup = async (name, email, _password, avatar) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, message: 'Please provide both your name and email.' };
    }

    const finalAvatar = avatar || generateInitialsAvatar(trimmedName, 'indigo');

    const newUser = {
      id: `user_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      avatar: finalAvatar,
      role: 'Member',
      tripsCount: initialTripsList.length,
      countriesVisited: 3,
      moneySaved: 450,
      co2Saved: 35,
      plan: 'free',
      memberSince: 'Today',
    };

    setUser(newUser);
    setTrips(initialTripsList);
    setActiveTrip(initialTripsList[0] || defaultTrip);
    setBookings(initialBookings);
    setExpenses(initialExpenses);
    setSavedPlaces(initialSavedPlaces);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    syncAccountData(newUser, {
      trips: initialTripsList,
      bookings: initialBookings,
      expenses: initialExpenses,
      savedPlaces: initialSavedPlaces,
      notifications: initialNotifications,
      checklists: initialChecklistItems,
    });

    const welcomeNotif = {
      id: `notif_${Date.now()}`,
      title: `Welcome to TripPlanner AI, ${trimmedName}!`,
      description: 'Start exploring curated destinations or generate an AI itinerary in seconds.',
      time: 'Just now',
      read: false,
      type: 'ai',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return { success: true };
  };

  const logout = () => {
    // Preserve current user's profile and data before logging out
    if (user.email) {
      syncAccountData(user, {
        trips,
        bookings,
        expenses,
        savedPlaces,
        notifications,
        checklists,
      });
    }

    setIsAuthenticated(false);
    setUser({
      ...initialUser,
      name: 'Traveler',
      role: 'Member',
      email: '',
      avatar: generateInitialsAvatar('Traveler', 'indigo'),
    });
  };

  const quickDemoLogin = () => {
    const demoUser = {
      id: 'user_demo_traveler',
      name: 'Jordan Reed',
      email: 'jordan.reed@tripplanner.ai',
      avatar: generateInitialsAvatar('Jordan Reed', 'ocean'),
      role: 'Global Adventurer',
      bio: 'Exploring scenic coastal sanctuaries, mountain trails, and cultural landmarks worldwide.',
      phone: '+1 (555) 438-9012',
      homeCity: 'Seattle, WA',
      travelStyle: 'Scenic & Cultural Discovery',
      tripsCount: 12,
      countriesVisited: 8,
      moneySaved: 1250,
      co2Saved: 120,
      plan: 'pro',
      memberSince: 'January 2024',
    };

    setUser(demoUser);
    setTrips(initialTripsList);
    setActiveTrip(initialTripsList[0] || defaultTrip);
    setBookings(initialBookings);
    setExpenses(initialExpenses);
    setSavedPlaces(initialSavedPlaces);
    setIsAuthenticated(true);
    setAuthModalOpen(false);

    syncAccountData(demoUser, {
      trips: initialTripsList,
      bookings: initialBookings,
      expenses: initialExpenses,
      savedPlaces: initialSavedPlaces,
      notifications: initialNotifications,
      checklists: initialChecklistItems,
    });
  };

  const updateUserProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      syncAccountData(updated);
      return updated;
    });
  };

  const changeAvatar = (avatarUrl) => {
    if (!avatarUrl) return;
    setUser((prev) => {
      const updated = { ...prev, avatar: avatarUrl };
      syncAccountData(updated);
      return updated;
    });
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    api.markNotificationRead(id);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    api.markAllNotificationsRead();
  };

  const triggerAIPlan = async (params) => {
    setIsGeneratingAI(true);
    setAiGenerationStep(1);

    const stepInterval = setInterval(() => {
      setAiGenerationStep((curr) => {
        if (curr < 5) return curr + 1;
        return curr;
      });
    }, 600);

    try {
      const response = await api.planTrip(params);
      clearInterval(stepInterval);
      setAiGenerationStep(5);

      setTimeout(() => {
        setIsGeneratingAI(false);
        if (response && response.plan) {
          setAiGeneratedPlan(response.plan);
          setShowAIResultModal(true);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#3b82f6', '#6366f1', '#a855f7', '#ec4899'],
            });
          } catch (e) {
            // Ignore confetti errors
          }
        }
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsGeneratingAI(false);
    }
  };

  const saveGeneratedTrip = () => {
    if (!aiGeneratedPlan) return;
    const newTrip = {
      id: `trip_${Date.now()}`,
      title: aiGeneratedPlan.title || `${aiGeneratedPlan.destination} Adventure`,
      destination: aiGeneratedPlan.destination,
      country: aiGeneratedPlan.country || 'Global',
      image: aiGeneratedPlan.destination.toLowerCase().includes('japan')
        ? 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80'
        : aiGeneratedPlan.destination.toLowerCase().includes('swiss')
        ? 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
      status: 'Confirmed',
      startDate: 'Jun 15, 2025',
      endDate: 'Jun 21, 2025',
      days: aiGeneratedPlan.days?.length || 6,
      travelers: '2 Travelers',
      travelersCount: 2,
      tripType: 'AI Curated Experience',
      estimatedCost: aiGeneratedPlan.totalEstimatedCost || 1149,
      actualCost: 0,
      activitiesCount: aiGeneratedPlan.days ? aiGeneratedPlan.days.reduce((acc, d) => acc + (d.activities?.length || 0), 0) : 12,
      progress: 30,
      daysItinerary: aiGeneratedPlan.days?.map((d, idx) => ({
        dayNumber: d.dayNumber || idx + 1,
        title: d.title || `Day ${idx + 1}`,
        subtitle: d.subtitle || 'Explore & Discover',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
        activities: d.activities || [],
      })) || [],
      budgetBreakdown: aiGeneratedPlan.budgetBreakdown || {
        flights: 450,
        hotels: 350,
        activities: 200,
        food: 100,
        transport: 49,
      },
    };

    setTrips((prev) => {
      const updatedTrips = [newTrip, ...prev];
      if (user.email) {
        syncAccountData(user, { trips: updatedTrips });
      }
      return updatedTrips;
    });
    setActiveTrip(newTrip);
    setUser((prev) => ({ ...prev, tripsCount: prev.tripsCount + 1 }));
    setShowAIResultModal(false);
    setActivePage('Itineraries');
  };

  const isPlaceSaved = (destId) => {
    return savedPlaces.some((p) => p.destinationId === destId);
  };

  const toggleSavePlace = (dest) => {
    if (isPlaceSaved(dest.id)) {
      setSavedPlaces((prev) => {
        const next = prev.filter((p) => p.destinationId !== dest.id);
        if (user.email) syncAccountData(user, { savedPlaces: next });
        return next;
      });
    } else {
      const newPlace = {
        id: `sav_${Date.now()}`,
        destinationId: dest.id,
        destinationName: dest.name,
        country: dest.country,
        image: dest.image,
        rating: dest.rating,
        price: dest.price,
        category: dest.category,
        addedAt: 'Just now',
      };
      setSavedPlaces((prev) => {
        const next = [newPlace, ...prev];
        if (user.email) syncAccountData(user, { savedPlaces: next });
        return next;
      });
    }
  };

  const addNewBooking = (bookingData) => {
    const newB = {
      ...bookingData,
      id: `book_${Date.now()}`,
    };
    setBookings((prev) => {
      const next = [newB, ...prev];
      if (user.email) syncAccountData(user, { bookings: next });
      return next;
    });
  };

  const addNewExpense = (expenseData) => {
    const newE = {
      ...expenseData,
      id: `exp_${Date.now()}`,
    };
    setExpenses((prev) => {
      const next = [newE, ...prev];
      if (user.email) syncAccountData(user, { expenses: next });
      return next;
    });
  };

  const addReview = (reviewData) => {
    const newRev = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      likes: 0,
      date: 'Just now',
    };
    setReviews((prev) => {
      const next = [newRev, ...prev];
      if (user.email) syncAccountData(user, { reviews: next });
      return next;
    });
  };

  const likeReview = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  const deleteTripById = (id) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (user.email) syncAccountData(user, { trips: next });
      return next;
    });
    if (activeTrip.id === id && trips.length > 1) {
      setActiveTrip(trips.find((t) => t.id !== id) || defaultTrip);
    }
  };

  // Checklist action handlers
  const addChecklistItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setChecklists((prev) => {
      const next = [newItem, ...prev];
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const updateChecklistItem = (id, updates) => {
    setChecklists((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const toggleChecklistItem = (id) => {
    setChecklists((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      const willBeCompleted = !target.completed;
      const next = prev.map((item) => (item.id === id ? { ...item, completed: willBeCompleted } : item));

      // If toggling completed, check if all items for that trip are completed to trigger confetti!
      if (willBeCompleted && target.tripId) {
        const tripItems = next.filter((i) => i.tripId === target.tripId);
        if (tripItems.length > 0 && tripItems.every((i) => i.completed)) {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }

      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const deleteChecklistItem = (id) => {
    setChecklists((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const bulkToggleChecklist = (ids, completed) => {
    const idSet = new Set(ids);
    setChecklists((prev) => {
      const next = prev.map((item) => (idSet.has(item.id) ? { ...item, completed } : item));
      if (completed) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const bulkDeleteChecklist = (ids) => {
    const idSet = new Set(ids);
    setChecklists((prev) => {
      const next = prev.filter((item) => !idSet.has(item.id));
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const clearCompletedChecklist = (tripId) => {
    setChecklists((prev) => {
      const next = prev.filter((item) => {
        if (tripId && tripId !== 'all') {
          return item.tripId !== tripId || !item.completed;
        }
        return !item.completed;
      });
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  const applyChecklistTemplate = (templateId, tripId) => {
    const tpl = checklistTemplates.find((t) => t.id === templateId);
    if (!tpl) return;

    const newItems = tpl.items.map((it, idx) => ({
      id: `chk_tpl_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`,
      tripId,
      title: it.title,
      category: it.category,
      type: it.type,
      completed: false,
      priority: it.priority,
      quantity: it.quantity,
      notes: it.notes,
      dueDate: it.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    setChecklists((prev) => {
      const next = [...newItems, ...prev];
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });

    const notif = {
      id: `notif_${Date.now()}`,
      title: `Template "${tpl.name}" applied`,
      description: `Added ${tpl.items.length} items to your pre-trip checklist.`,
      time: 'Just now',
      read: false,
      type: 'trip',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const generateAIChecklist = async (tripId) => {
    const targetTrip = trips.find((t) => t.id === tripId) || activeTrip;

    const isBeach =
      targetTrip.tripType.toLowerCase().includes('beach') ||
      targetTrip.destination.toLowerCase().includes('bali') ||
      targetTrip.destination.toLowerCase().includes('amalfi');
    const isCold =
      targetTrip.tripType.toLowerCase().includes('mountain') ||
      targetTrip.destination.toLowerCase().includes('swiss') ||
      targetTrip.destination.toLowerCase().includes('alps') ||
      targetTrip.destination.toLowerCase().includes('snow');
    const isAsia =
      targetTrip.destination.toLowerCase().includes('japan') ||
      targetTrip.destination.toLowerCase().includes('kyoto') ||
      targetTrip.destination.toLowerCase().includes('bali') ||
      targetTrip.destination.toLowerCase().includes('asia');
    const isEurope =
      targetTrip.destination.toLowerCase().includes('europe') ||
      targetTrip.destination.toLowerCase().includes('swiss') ||
      targetTrip.destination.toLowerCase().includes('amalfi') ||
      targetTrip.destination.toLowerCase().includes('paris');

    const generated = [
      {
        tripId,
        title: `Verify passport expiry is beyond 6 months from ${targetTrip.endDate || 'departure'}`,
        category: 'Documents & ID',
        type: 'task',
        completed: false,
        priority: 'high',
        dueDate: '14 days before',
        notes: `Mandatory entry requirement for travel to ${targetTrip.country || targetTrip.destination}.`,
      },
      {
        tripId,
        title: `Activate international travel roaming or download eSIM QR profile for ${targetTrip.country || targetTrip.destination}`,
        category: 'Pre-Trip Tasks',
        type: 'task',
        completed: false,
        priority: 'high',
        dueDate: '2 days before',
        notes: 'Pre-installing profile saves up to 75% on carrier roaming charges.',
      },
      {
        tripId,
        title: `Notify credit & debit card issuers for travel in ${targetTrip.country || targetTrip.destination}`,
        category: 'Pre-Trip Tasks',
        type: 'task',
        completed: false,
        priority: 'high',
        dueDate: '3 days before',
        notes: 'Prevents security flags and card freezes on overseas merchant terminals.',
      },
      {
        tripId,
        title: `Download offline maps & translation dictionary for ${targetTrip.destination}`,
        category: 'Pre-Trip Tasks',
        type: 'task',
        completed: false,
        priority: 'medium',
        dueDate: '1 day before',
      },
      {
        tripId,
        title: isEurope
          ? 'Universal Europlug (Type C/F) 45W travel adapter'
          : isAsia
          ? 'Universal Type A/C compact travel adapter'
          : 'Multi-country universal travel adapter with USB-C PD',
        category: 'Electronics & Gadgets',
        type: 'packing',
        completed: false,
        priority: 'high',
        quantity: 1,
      },
      {
        tripId,
        title: 'Airline-compliant 20,000mAh portable battery pack (keep in carry-on)',
        category: 'Electronics & Gadgets',
        type: 'packing',
        completed: false,
        priority: 'high',
        quantity: 1,
        notes: 'FAA/IATA regulations require power banks to remain in hand luggage.',
      },
      {
        tripId,
        title: isCold
          ? 'Merino wool thermal underlayers & windproof softshell'
          : isBeach
          ? 'UV-protective sun shirts & breathable quick-dry linen'
          : 'Wrinkle-resistant travel capsules & smart layering',
        category: 'Clothing & Apparel',
        type: 'packing',
        completed: false,
        priority: 'medium',
        quantity: targetTrip.days ? Math.min(targetTrip.days, 6) : 4,
      },
      {
        tripId,
        title: isBeach
          ? 'Reef-compliant SPF 50+ mineral sunscreen & aloe soothing gel'
          : isCold
          ? 'High-altitude lip balm (SPF 30) & heavy-duty moisturizing balm'
          : 'TSA 3-1-1 travel toiletry kit with clear pouch',
        category: 'Toiletries & Care',
        type: 'packing',
        completed: false,
        priority: 'high',
        quantity: 1,
      },
      {
        tripId,
        title: 'Travel health kit (pain relief, motion sickness tablets, electrolyte powder)',
        category: 'Health & Medication',
        type: 'packing',
        completed: false,
        priority: 'high',
        quantity: 1,
      },
      {
        tripId,
        title: 'RFID blocking passport & card pouch / neck wallet',
        category: 'Accessories & Gear',
        type: 'packing',
        completed: false,
        priority: 'medium',
        quantity: 1,
      },
    ];

    const newItems = generated.map((it, idx) => ({
      ...it,
      id: `chk_ai_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    setChecklists((prev) => {
      const next = [...newItems, ...prev];
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });

    const notif = {
      id: `notif_${Date.now()}`,
      title: `AI Pre-Trip Checklist Generated!`,
      description: `Created 10 smart packing items and task reminders tailored for ${targetTrip.destination}.`,
      time: 'Just now',
      read: false,
      type: 'ai',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const resetTripChecklist = (tripId) => {
    setChecklists((prev) => {
      const next = prev.filter((i) => i.tripId !== tripId);
      if (user.email) syncAccountData(user, { checklists: next });
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        savedProfiles,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithProfile,
        removeSavedProfile,
        signup,
        logout,
        updateUserProfile,
        changeAvatar,
        quickDemoLogin,
        activePage,
        setActivePage,
        pageHistory,
        goBack,
        canGoBack,
        activeTrip,
        setActiveTrip,
        trips,
        setTrips,
        destinations,
        bookings,
        setBookings,
        expenses,
        setExpenses,
        savedPlaces,
        setSavedPlaces,
        reviews,
        setReviews,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        checklists,
        setChecklists,
        checklistTemplates,
        addChecklistItem,
        updateChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        bulkToggleChecklist,
        bulkDeleteChecklist,
        clearCompletedChecklist,
        applyChecklistTemplate,
        generateAIChecklist,
        resetTripChecklist,
        isGeneratingAI,
        aiGenerationStep,
        aiGeneratedPlan,
        showAIResultModal,
        setShowAIResultModal,
        showUpgradeModal,
        setShowUpgradeModal,
        selectedDestinationForDetail,
        setSelectedDestinationForDetail,
        showMapModal,
        setShowMapModal,
        mapModalLocation,
        setMapModalLocation,
        triggerAIPlan,
        saveGeneratedTrip,
        toggleSavePlace,
        isPlaceSaved,
        addNewBooking,
        addNewExpense,
        addReview,
        likeReview,
        deleteTripById,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
