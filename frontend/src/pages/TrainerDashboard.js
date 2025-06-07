import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/css/TrainerDashboard.css';

const TrainerDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ bookings, setBookings ] = useState([]);
  const [ pendingCount, setPendingCount ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState('');
  const [ activeTab, setActiveTab ] = useState('pending');
  const [ rejectionReason, setRejectionReason ] = useState('');
  const [ showRejectionModal, setShowRejectionModal ] = useState(false);
  const [ selectedBookingId, setSelectedBookingId ] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'trainer') {
      navigate('/');
      return;
    }
    fetchBookings();
    fetchPendingCount();
  });

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/booking/trainer-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/booking/pending-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.pendingCount);
      } else {
        setError('Failed to fetch pending count');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } 
  }

  const confirmBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBookings();
        await fetchPendingCount();
        setError('');
      } else {
        const data = await response.json();
        setError('Failed to confirm booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError('Failed to confirm booking');
    }
  }

  const rejectBooking = async () => {
    try {
      const response = await fetch(`/api/booking/${selectedBookingId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason })
      });

      if (response.ok) {
        await fetchBookings();
        await fetchPendingCount();
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedBookingId(null);
        setError('');
      } else {
        const data = await response.json();
        setError('Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setError('Failed to reject booking');
    }
  }

  const handleRejectClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowRejectionModal(true);
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/booking/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchBookings();
        await fetchPendingCount();
        setError('');
      } else {
        const data = await response.json();
        setError('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColour = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  const filterBookings = (status) => {
    if (status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  }

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => booking.status === 'confirmed' && new Date(booking.timeslot) > now).slice(0, 3);
  }
  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filterBookings('confirmed').length}</div>
            <div className="stat-label">Confirmed Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Quick Actions Section */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="upcoming-bookings">
          <h4>Next Upcoming Sessions</h4>
          {getUpcomingBookings().length > 0 ? (
            <div className="upcoming-list">
              {getUpcomingBookings().map(booking => (
                <div key={booking._id} className="upcoming-item">
                  <div className="upcoming-client">{booking.client.name}</div>
                  <div className="upcoming-time">
                    {formatDate(booking.timeslot)} at {formatTime(booking.timeslot)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-upcoming">No upcoming confirmed sessions</p>
          )}
        </div>
      </div>

      {/* Bookings Management */}
      <div className="bookings-section">
        <div className="section-header">
          <h3>Manage Bookings</h3>
          <div className="tab-buttons">
            <button 
              className={activeTab === 'pending' ? 'active' : ''}
              onClick={() => setActiveTab('pending')}
            >
              Pending {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
            </button>
            <button 
              className={activeTab === 'confirmed' ? 'active' : ''}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
            <button 
              className={activeTab === 'all' ? 'active' : ''}
              onClick={() => setActiveTab('all')}
            >
              All Bookings
            </button>
          </div>
        </div>

        <div className="bookings-list">
          {filterBookings(activeTab).length > 0 ? (
            filterBookings(activeTab).map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="client-info">
                    <h4>{booking.client.name}</h4>
                    <p>{booking.client.email}</p>
                  </div>
                  <div 
                    className="booking-status"
                    style={{ backgroundColor: getStatusColour(booking.status) }}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <i className="fa-solid fa-calendar"></i>
                    <span>{formatDate(booking.timeslot)}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fa-solid fa-clock"></i>
                    <span>{formatTime(booking.timeslot)} ({booking.duration} min)</span>
                  </div>
                  {booking.notes && (
                    <div className="detail-item">
                      <i className="fa-solid fa-note-sticky"></i>
                      <span>{booking.notes}</span>
                    </div>
                  )}
                </div>

                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        className="confirm-btn"
                        onClick={() => confirmBooking(booking._id)}
                      >
                        <i className="fa-solid fa-check"></i>
                        Confirm
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectClick(booking._id)}
                      >
                        <i className="fa-solid fa-times"></i>
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button 
                      className="cancel-btn"
                      onClick={() => cancelBooking(booking._id)}
                    >
                      <i className="fa-solid fa-ban"></i>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-bookings">
              <p>No {activeTab === 'all' ? '' : activeTab} bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Reject Booking</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRejectionModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <label htmlFor="rejectionReason">Reason for rejection (optional):</label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Let the client know why you're rejecting this booking..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-modal-btn"
                onClick={() => setShowRejectionModal(false)}
              >
                Cancel
              </button>
              <button 
                className="reject-confirm-btn"
                onClick={rejectBooking}
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;