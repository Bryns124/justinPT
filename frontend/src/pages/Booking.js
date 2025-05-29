import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Booking.css';

const Booking = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ selectedDate, setSelectedDate ] = useState('');
  const [ availableSlots, setAvailableSlots ] = useState([]);
  const [ bookedSlots, setBookedSlots ] = useState([]);
  const [ selectedSlot, setSelectedSlot ] = useState('')
  const [ notes, setNotes ] = useState('');
  const [ bookingStatus, setBookingStatus ] = useState('');
  // const [ trainerID, setTrainerID ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ messageType, setMessageType ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      let displayTime = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
      if (hour === 12) displayTime = '12:00 PM';
      slots.push({ value: time, display: displayTime });
    }
    return slots;
  }

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/booking/availability?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const bookedTimes = data.bookedSlots.map(slot => {
          const date = new Date(slot);
          return `${date.getHours().toString().padStart(2, '0')}:00`;
        });
        setBookedSlots(bookedTimes);
      }
    } catch (error) {
      console.error('Error fetching unavailability: ', error);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date.length === 10) {
      const today = new Date().toISOString().split('T')[0];
      
      if (date < today) {
        setMessage('Please select a future date');
        setMessageType('error');
        return;
      }
    }

    setSelectedSlot('');
    setMessage('');
    setMessageType('');
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setMessage('');
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // if (!user) {
    //   navigate('/')
    // }
    if (!selectedDate || !selectedSlot) {
      setMessage('Please select both date and time');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      const [ hours, minutes ] = selectedSlot.split(':');
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          timeslot: bookingDateTime.toISOString(),
          notes
        })
      });

      if (response.ok) {
        setMessage('Booking created successfully! You will receive a confirmation email shortly.')
        setMessageType('success');
        // Reset form
        setSelectedDate('');
        setSelectedSlot('');
        setNotes('');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Booking failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Booking failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookingNav = () => {
    navigate('/booking');
  };

  // Minimum date (today) so previous dates aren't selectable
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <header className="homepage-header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo">JML Fitness</div>
        </Link>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/contact">Contact</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link className="logout-link" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <button className="booking-btn" onClick={handleBookingNav}>Book Now</button>
        </nav>
      </header>

      <div className="booking-container">
        <div className="booking-content">
          <h1>Book Your Session</h1>
          <p>Select your preferred date and time for your training session.</p>

          <form onSubmit={handleBooking} className="booking-form">
            {/* Service Selection
            <div className="form-group">
              <label htmlFor="service">Service Type</label>
              <select
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="form-select"
              >
                <option value="consultation">Free Consultation (30 min)</option>
                <option value="training">Personal Training (60 min)</option>
                <option value="assessment">Fitness Assessment (45 min)</option>
              </select>
            </div> */}

            {/* Date Selection */}
            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={today}
                className="form-input"
                required
              />
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="form-group">
                <label>Available Time Slots</label>
                <div className="time-slots-grid">
                  {timeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot.value);
                    const isSelected = selectedSlot === slot.value;
                    
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        className={`time-slot ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => !isBooked && handleSlotSelect(slot.value)}
                        disabled={isBooked}
                      >
                        {slot.display}
                        {isBooked && <span className="booked-label">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific goals, concerns, or requests..."
                className="form-textarea"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !selectedDate || !selectedSlot}
            >
              {loading ? 'Booking...' : 'Book Session'}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Booking;