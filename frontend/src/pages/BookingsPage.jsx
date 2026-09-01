import React, { useState } from 'react';
import { Plane, Hotel, Ticket, Plus, CheckCircle2, QrCode, Download, ExternalLink, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/BackButton';

export const BookingsPage = () => {
  const { bookings, addNewBooking } = useApp();
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // New Booking Form State
  const [newType, setNewType] = useState('flight');
  const [newProvider, setNewProvider] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newPrice, setNewPrice] = useState(150);

  const filteredBookings = bookings.filter((b) => {
    if (filterType === 'all') return true;
    return b.type === filterType;
  });

  const handleDownloadVoucher = (book) => {
    const voucherText = `========================================
TRIPPLANNER AI - OFFICIAL BOOKING VOUCHER
========================================
Booking Reference: ${book.bookingCode}
Status: ${book.status}
Service: ${book.title}
Provider: ${book.provider}
Type: ${book.type.toUpperCase()}
Date & Schedule: ${book.date}
Amount: $${book.price}

Details:
${Object.entries(book.details || {}).map(([k, v]) => `• ${k}: ${v}`).join('\n')}

Issued via TripPlanner AI Verified Booking Desk
Authorized for Apple Wallet / Google Wallet Sync
========================================`;

    const blob = new Blob([voucherText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Voucher_${book.bookingCode}_${book.provider.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded e-ticket for ${book.bookingCode}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!newProvider || !newTitle) return;

    addNewBooking({
      type: newType,
      provider: newProvider,
      title: newTitle,
      bookingCode: `TP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: newDate || 'Jun 15, 2025',
      status: 'Confirmed',
      price: Number(newPrice),
      details: {
        ConfirmedBy: 'TripPlanner AI Instant Booking Desk',
        EPass: 'Available in Apple Wallet & Offline PDF',
      },
      image:
        newType === 'flight'
          ? 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&auto=format&fit=crop&q=80'
          : newType === 'hotel'
          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&auto=format&fit=crop&q=80',
    });

    setShowAddModal(false);
    setNewProvider('');
    setNewTitle('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-blue-600" />;
      case 'hotel':
        return <Hotel className="w-5 h-5 text-indigo-600" />;
      case 'activity':
        return <Ticket className="w-5 h-5 text-amber-600" />;
      default:
        return <Ticket className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div id="bookings-management-page" className="space-y-6">
      {/* Top Breadcrumb / Back Button Bar */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Dashboard" fallbackPage="Dashboard" />
        <span className="text-xs font-semibold text-slate-400">Bookings & Tickets</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bookings & Reservations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access your flight e-tickets, hotel confirmation vouchers, and activity passes in one place.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Booking Voucher</span>
        </button>
      </div>

      {/* Download Success Banner */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { key: 'all', label: 'All Bookings' },
          { key: 'flight', label: 'Flights' },
          { key: 'hotel', label: 'Hotels' },
          { key: 'activity', label: 'Activities & Tours' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredBookings.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-3xl border border-slate-100/90 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getIcon(book.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {book.provider}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {book.title}
                    </h3>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  {book.status}
                </span>
              </div>

              {/* Booking Details Table */}
              <div className="mt-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Date & Time</span>
                  <span className="font-bold text-slate-800">{book.date}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">Confirmation Code</span>
                  <span className="font-mono font-bold text-indigo-600">{book.bookingCode}</span>
                </div>

                {book.details &&
                  Object.entries(book.details).map(([k, v]) => (
                    <div key={k} className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-semibold text-slate-400 block">{k}</span>
                      <span className="font-medium text-slate-700 truncate block">{v}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-normal">Amount Paid</span>
                <span className="text-base font-extrabold text-slate-900">${book.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadVoucher(book)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Voucher</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Booking Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto my-auto animate-in zoom-in-95 duration-150 relative overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Add New Reservation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['flight', 'hotel', 'activity'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`p-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                        newType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Provider / Airline / Hotel
                </label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="e.g. Emirates Airlines or Marriott Resort"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                  Title & Details
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Flight EK 202: DXB → JFK"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Jun 15, 2025"
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
