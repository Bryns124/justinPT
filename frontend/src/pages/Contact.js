import React, { useState, useContext } from 'react';
import '../assets/css/Contact.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import handleBooking from './HomePage';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ submitStatus, setSubmitStatus ] = useState('');
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      const serviceID = "service_fj8g3p8";
      const templateID = "template_434djud";
      const publicKey = "XFc-ZyqcWXtIBSt56";
      const templateParams = {
        name: `${firstName} ${lastName}`,
        message: message,
        email: email
      }
      
      await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      setSubmitStatus('Success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus('Error');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <>
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
    <div className='contact-container'>
      <div className='contact-content'>
        <div className='contact-info'>
          <h1>Contact Me</h1>
          <p>Looking for 1-on-1 coaching tailored to you? Or just have a few questions?</p>
          <p>Reach out today - I'll personally get back to you!</p>
        </div>
        <form className='contact-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name (required)</label>
            <div className='name-inputs'>
              <input
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <input
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email (required)</label>
            <input
                type='email'
                placeholder='email@domain.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
          </div>
          <div className='form-group'>
            <label htmlFor='message'>Message</label>
            <textarea
                rows='5'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
          </div>
          {/* {submitStatus !== 'Success' && ( */}
            <button type="submit" className="send-btn" disabled={isSubmitting}>
              {isSubmitting ? 'SENDING..' : 'SEND'}
            </button>
          {/* )} */}
          {submitStatus === 'Success' && (
            <div className="status-message success-message">
              <div className="message-icon">✓</div>
              <div className="message-content">
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            </div>
          )}
          
          {submitStatus === 'Error' && (
            <div className="status-message error-message">
              <div className="message-icon">✕</div>
              <div className="message-content">
                <h3>Failed to Send Message</h3>
                <p>Something went wrong. Please try again or email me directly.</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
    </>
  );
};

export default Contact;