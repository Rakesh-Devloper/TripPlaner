/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { ExplorePage } from './pages/ExplorePage';
import { TripsPage } from './pages/TripsPage';
import { BookingsPage } from './pages/BookingsPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { BudgetTrackerPage } from './pages/BudgetTrackerPage';
import { ItinerariesPage } from './pages/ItinerariesPage';
import { TravelAssistantPage } from './pages/TravelAssistantPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { AIPlannerModal } from './components/AIPlannerModal';
import { UpgradeModal } from './components/UpgradeModal';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { AuthModal } from './components/AuthModal';

const AppContent = () => {
  const { activePage, isDarkMode } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'AI Trip Planner':
        return <AIPlannerPage />;
      case 'Explore Destinations':
        return <ExplorePage />;
      case 'Trips':
        return <TripsPage />;
      case 'Pre-Trip Checklist':
        return <ChecklistPage />;
      case 'Bookings':
        return <BookingsPage />;
      case 'Saved Places':
        return <SavedPlacesPage />;
      case 'Budget Tracker':
        return <BudgetTrackerPage />;
      case 'Itineraries':
        return <ItinerariesPage />;
      case 'Travel Assistant':
        return <TravelAssistantPage />;
      case 'Reviews':
        return <ReviewsPage />;
      case 'Profile':
        return <ProfilePage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div
      id="app-root-wrapper"
      className={`min-h-screen w-full max-w-full overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif] ${
        isDarkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#f8fafc] text-slate-900'
      } flex relative`}
    >
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 md:pl-[240px] flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Content Container */}
        <main
          id="main-app-content-container"
          className="flex-1 px-3.5 sm:px-6 md:px-8 pb-10 max-w-[1700px] w-full mx-auto min-w-0 overflow-x-hidden"
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AIPlannerModal />
      <UpgradeModal />
      <DestinationDetailModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
