import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Booking.css';

const Booking = () => {
  const { user, logout, token } = useContext(AuthContext);
  const role = user?.role;
  const navigate = useNavigate();

  const [ selectedDate, setSelectedDate ] = useState('');
  const [ availableSlots, setAvailableSlots ] = useState([]);
  const [ selectedSlot, setSelectedSlot ] = useState('');
  const [ duration, setDuration ] = useState(60);
  const [ notes, setNotes ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');
  const [ myBookings, setMyBookings ] = useState([]);
  const [ confirmCancel, setConfirmCancel] = useState(null);
  // const [ bookedSlots, setBookedSlots ] = useState([]);
  // const [ bookingStatus, setBookingStatus ] = useState('');
  // const [ trainerID, setTrainerID ] = useState('');
  // const [ message, setMessage ] = useState('');
  // const [ messageType, setMessageType ] = useState('');

  // most likely want non-logged-in users to be able to make bookings.
  // useEffect(() => {
  //   if (!user) {
  //     navigate('/login');
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    if (user && token) {
      fetchMyBookings();
    }
  }, [user, token]);

  const fetchMyBookings = async () => {
    try {
      const response = await fetch('/api/booking/my-bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      console.log('response status is: ', response.status);
      console.log('response is: ', response);

      const data = await response.json();
      console.log('Data: ', data);
      setMyBookings(data.bookings);
      console.log('Data.bookings: ', data.bookings);
    } catch (error) {
      console.error('Error fetchiing bookings: ', error);
    }
  }

  const fetchAvailability = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/booking/availability/${date}`, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${token}`
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }

      const data = await response.json();
      setAvailableSlots(data.availableSlots);
      setError('')
    } catch (error) {
      console.error('Error fetching unavailability: ', error);
      setError('Failed to get available slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot('');

    if (date) {
      fetchAvailability(date);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const timeslotToSend = selectedSlot instanceof Date 
      ? selectedSlot.toISOString() 
      : selectedSlot;

      console.log('Timeslot to send:', timeslotToSend);

      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeslot: selectedSlot,
          duration,
          notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setSuccess('Booking created successfully!');
      setSelectedDate('');
      setSelectedSlot('');
      setNotes('');
      setAvailableSlots([]);
      fetchMyBookings();
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // update status to cancelled immediately
        setMyBookings(prev => prev.map(booking => booking._id === bookingId ? {...booking, status: 'cancelled' } : booking));
        setConfirmCancel(null);
      }
      
      setSuccess('Booking cancelled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to cancel booking');
      setConfirmCancel(null);
    }
  };

  const handleCancelConfirmation = (bookingId, confirm) => {
    if (confirm) {
      handleCancelBooking(bookingId);
    } else {
      setConfirmCancel(null); // Just hide the confirmation
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const removeExistingCancelledBookings = async () => {
    try {
      const response = await fetch('/api/booking/clear-cancelled', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMyBookings(prev => prev.filter(booking => booking.status !== 'cancelled'));
      }
    } catch (error) {
      console.error('Error clearing cancelled bookings: ', error);
    }
  };

  // Minimum date (today) so previous dates aren't selectable
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-container">
      <header className="homepage-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">JML Fitness</div>
        </Link>
        <nav>
          {user && (
            <>
            <Link to="/dashboard">Dashboard</Link>
            </>
          )}
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/faqs">FAQs</Link>
          {role !== 'trainer' && <Link to="/contact">Contact</Link>}
          {user ? (
            <>
              <button className="logout-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          {/* <i class="fa-solid fa-bag-shopping"></i> */}
          <button className="booking-btn" onClick={handleBooking}>Book Now</button>
        </nav>
      </header>
      <div className="booking-header">
        <h1>Book Your Consultation</h1>
        <p>Schedule a personalised session with our expert trainer</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="booking-content">
        <div className="booking-form-section">
          <h2>Schedule New Booking</h2>
          <form onSubmit={handleBooking} className="booking-form">
            <div className="form-group">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                required
              />
            </div>

            {selectedDate && (
              <div className="form-group">
                <label>Available Time Slots:</label>
                {loading ? (
                  <div className="loading">Loading available slots...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="time-slots">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-slot ${selectedSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-slots">No available slots for this date</div>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="duration">Session Duration:</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific goals or requirements..."
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className="book-button"
              disabled={loading || !selectedSlot}
            >
              {loading ? 'Booking...' : 'Book Session'}
            </button>
          </form>
        </div>

        <div className="my-bookings-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Bookings</h2>
            {myBookings.some(booking => booking.status === 'cancelled') && (
              <button 
                className="clear-cancelled-btn"
                onClick={removeExistingCancelledBookings}
              >
                Clear Cancelled
              </button>
            )}
          </div>
          {myBookings.length > 0 ? (
            <div className="bookings-list">
              {myBookings.map((booking) => (
                <div key={booking._id} className={`booking-card ${booking.status}}`}>
                  <div className="booking-info">
                    <div className="booking-date">
                      {formatDate(booking.timeslot)}
                    </div>
                    <div className="booking-time">
                      {formatTime(booking.timeslot)} ({booking.duration} min)
                    </div>
                    <div className="booking-trainer">
                      Trainer: {booking.trainer.name}
                    </div>
                    <div className={`booking-status ${booking.status}`}>
                      Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    {booking.notes && (
                      <div className="booking-notes">
                        Notes: {booking.notes}
                      </div>
                    )}
                  </div>
                  {booking.status !== 'cancelled' && (
                    <div className="cancel-section">
                      {confirmCancel === booking._id ? (
                        <div className="cancel-confirmation">
                          <div className="cancel-confirmation-text">
                            Are you sure you want to cancel?
                          </div>
                          <div className="cancel-confirmation-buttons">
                            <button
                              className="confirm-yes-button"
                              onClick={() => handleCancelConfirmation(booking._id, true)}
                            >
                              Yes
                            </button>
                            <button
                              className="confirm-no-button"
                              onClick={() => handleCancelConfirmation(booking._id, false)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="cancel-button"
                          onClick={() => setConfirmCancel(booking._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-bookings">No bookings yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;