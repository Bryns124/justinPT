import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/HomePage.css';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleBooking = () => {
    navigate('/booking');
  };

  return (
    <div className="homepage">
      <div className="main-container">
        <header className="homepage-header">
          <div className="logo">JML Fitness</div>
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
            <i class="fa-solid fa-bag-shopping"></i>
            <button className="booking-btn" onClick={handleBooking}>Book Now</button>
          </nav>
        </header>
        <main className="homepage-hero">
          <div className="main-left">
            <h1>Functional Fitness for Real People</h1>
          </div>
          <div className="main-right">
            <p>Personal training that builds real strength, mobility and confidence - not just athletics. Designed for everyday people who want to feel and move better in real life</p><br></br>
            <p>Book your free 30 min consultation now.</p>
            <Link to="/signup" className="cta-button">
              Get Started
            </Link>
          </div>
        </main>
      </div>
      <section>

      </section>
    </div>
  );
};

export default HomePage;