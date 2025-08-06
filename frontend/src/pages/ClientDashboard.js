import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/css/TrainerDashboard.css';
import '../assets/css/ClientDashboard.css';

const ClientDashboard = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ activeTab, setActiveTab ] = useState('overview');
  const [ bookings, setBookings ] = useState([]);
  const [ programs, setPrograms ] = useState([]);
  const [ workoutEntries, setWorkoutEntries ] = useState([]);
  const [ loading, setLoading ] = useState([]);
  const [ error, setError ] = useState('');

  const [ newEntry, setNewEntry ] = useState({
    date: new Date().toISOString().split('T')[0],
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    notes: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'client') {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, [user, token, navigate]);

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchBookings(),
        fetchPrograms(),
        fetchWorkoutEntries()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/booking/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetch bookings: ', error);
    }
  }

  const fetchPrograms = async () => {
    // TODO: Implement when programs API ready
    // For now, using mock data
    setPrograms([
      { id: 1, title: 'The Minimalist', purchased: true, progress: 65 },
      { id: 2, title: 'Bodyweight Blueprint', purchased: false, progress: 0 }
    ]);
  };

  const fetchWorkoutEntries = async () => {
    // TODO: Implement workout journal API
    // For now, using mock data
    const savedEntries = localStorage.getItem(`workoutEntries_${user.userId}`);
    if (savedEntries) {
      setWorkoutEntries(JSON.parse(savedEntries));
    }
  };

  const addWorkoutEntry = () => {
    if (!newEntry.exercise || !newEntry.sets || !newEntry.reps) {
      setError('Please fill in exercise, sets, and reps.');
      return;
    }

    const entry = {
      id: Date.now(),
      ...newEntry,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [entry, ...workoutEntries];
    setWorkoutEntries(updatedEntries);
    localStorage.setItem(`workoutEntries_${user.userId}`,JSON.stringify(updatedEntries));

    setNewEntry({
      date: new Date().toISOString().split('T'[0]),
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
      notes: ''
    });
    setError('');
  }

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/booking/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchBookings();
        setError('');
      } else {
        const data = await response.json();
        setError('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking: ', error);
      setError('Failed to cancel booking');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColour = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => new Date(booking.timeslot) > now && (booking.status === 'confirmed' || booking.status === 'pending').slice(0, 3));
  }

  const getRecentWorkouts = () => {
    return workoutEntries.slice(0, 5);
  }

  if (loading) {
    return (
      <div className="client-dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      <div className="dashboard-header">
        <h1>My Fitness Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{getUpcomingBookings().length}</div>
            <div className="stat-label">Upcoming Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{programs.filter(p => p.purchased).length}</div>
            <div className="stat-label">Active Programs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{workoutEntries.length}</div>
            <div className="stat-label">Workout Entries</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fa-solid fa-chart-line"></i>
          Overview
        </button>
        <button 
          className={activeTab === 'programs' ? 'active' : ''}
          onClick={() => setActiveTab('programs')}
        >
          <i className="fa-solid fa-dumbbell"></i>
          My Programs
        </button>
        <button 
          className={activeTab === 'journal' ? 'active' : ''}
          onClick={() => setActiveTab('journal')}
        >
          <i className="fa-solid fa-book"></i>
          Workout Journal
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          <i className="fa-solid fa-calendar"></i>
          My Bookings
        </button>
        <button 
          className={activeTab === 'progress' ? 'active' : ''}
          onClick={() => setActiveTab('progress')}
        >
          <i className="fa-solid fa-chart-bar"></i>
          Progress
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-section">
                <h3>Upcoming Sessions</h3>
                {getUpcomingBookings().length > 0 ? (
                  <div className="upcoming-sessions">
                    {getUpcomingBookings().map(booking => (
                      <div key={booking._id} className="session-item">
                        <div className="session-date">
                          {formatDate(booking.timeslot)}
                        </div>
                        <div className="session-details">
                          <div className="session-time">{formatTime(booking.timeslot)}</div>
                          <div 
                            className="session-status"
                            style={{ color: getStatusColour(booking.status) }}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No upcoming sessions</p>
                )}
                <button 
                  className="action-btn"
                  onClick={() => navigate('/booking')}
                >
                  Book New Session
                </button>
              </div>

              <div className="overview-section">
                <h3>Recent Workouts</h3>
                {getRecentWorkouts().length > 0 ? (
                  <div className="recent-workouts">
                    {getRecentWorkouts().map(entry => (
                      <div key={entry.id} className="workout-item">
                        <div className="workout-exercise">{entry.exercise}</div>
                        <div className="workout-details">
                          {entry.sets} sets × {entry.reps} reps
                          {entry.weight && ` @ ${entry.weight}kgs`}
                        </div>
                        <div className="workout-date">{formatDate(entry.date)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No workout entries yet</p>
                )}
                <button 
                  className="action-btn"
                  onClick={() => setActiveTab('journal')}
                >
                  Add Workout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programs' && (
          <div className="programs-tab">
            <h3>My Training Programs</h3>
            <div className="programs-grid">
              {programs.map(program => (
                <div key={program.id} className="program-card">
                  <h4>{program.title}</h4>
                  {program.purchased ? (
                    <div className="program-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                      <span>{program.progress}% Complete</span>
                      <button className="continue-btn">Continue Program</button>
                    </div>
                  ) : (
                    <div className="program-purchase">
                      <p>Not purchased</p>
                      <button className="purchase-btn">Purchase Program</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="journal-tab">
            <div className="journal-header">
              <h3>Workout Journal</h3>
              <div className="add-entry-form">
                <h4>Log New Workout</h4>
                <div className="form-grid">
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Exercise"
                    value={newEntry.exercise}
                    onChange={(e) => setNewEntry({...newEntry, exercise: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={newEntry.sets}
                    onChange={(e) => setNewEntry({...newEntry, sets: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={newEntry.reps}
                    onChange={(e) => setNewEntry({...newEntry, reps: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Weight (kgs)"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  />
                  <textarea
                    placeholder="Notes (optional)"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  />
                </div>
                <button className="add-entry-btn" onClick={addWorkoutEntry}>
                  Add Entry
                </button>
              </div>
            </div>

            <div className="journal-entries">
              <h4>Recent Entries</h4>
              {workoutEntries.length > 0 ? (
                <div className="entries-list">
                  {workoutEntries.map(entry => (
                    <div key={entry.id} className="entry-card">
                      <div className="entry-header">
                        <h5>{entry.exercise}</h5>
                        <span className="entry-date">{formatDate(entry.date)}</span>
                      </div>
                      <div className="entry-details">
                        <span>{entry.sets} sets × {entry.reps} reps</span>
                        {entry.weight && <span>Weight: {entry.weight} kgs</span>}
                      </div>
                      {entry.notes && (
                        <div className="entry-notes">{entry.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No workout entries yet. Start logging your workouts!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-tab">
            <div className="bookings-header">
              <h3>My Bookings</h3>
              <button 
                className="book-new-btn"
                onClick={() => navigate('/booking')}
              >
                Book New Session
              </button>
            </div>
            
            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-info">
                      <div className="booking-date-time">
                        <h4>{formatDate(booking.timeslot)}</h4>
                        <p>{formatTime(booking.timeslot)} ({booking.duration} min)</p>
                      </div>
                      <div className="booking-trainer">
                        <p>with {booking.trainer.name}</p>
                      </div>
                      <div 
                        className="booking-status"
                        style={{ backgroundColor: getStatusColour(booking.status) }}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="booking-notes">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}
                    <div className="booking-actions">
                      {(booking.status === 'pending' || booking.status === 'confirmed') && 
                       new Date(booking.timeslot) > new Date() && (
                        <button 
                          className="cancel-booking-btn"
                          onClick={() => cancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings">
                <p>No bookings yet.</p>
                <button 
                  className="book-first-btn"
                  onClick={() => navigate('/booking')}
                >
                  Book Your First Session
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="progress-tab">
            <h3>Progress Tracking</h3>
            <div className="progress-sections">
              <div className="progress-section">
                <h4>Measurements</h4>
                <p className="coming-soon">Coming soon - Track your body measurements and progress photos</p>
              </div>
              <div className="progress-section">
                <h4>Trainer Feedback</h4>
                <p className="coming-soon">Coming soon - View feedback from your trainer</p>
              </div>
              <div className="progress-section">
                <h4>Workout Statistics</h4>
                <p className="coming-soon">Coming soon - Detailed workout analytics and charts</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;