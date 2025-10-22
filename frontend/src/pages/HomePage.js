import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/HomePage.css';
import beforeImage1 from '../assets/imgs/asd1-1.png';
import afterImage1 from '../assets/imgs/asd1-2.png';
// import beforeImage2 from '../assets/imgs/asd2-1.png';
// import afterImage2 from '../assets/imgs/asd2-2.png';
import beforeImage3 from '../assets/imgs/asd3-1.png';
import afterImage3 from '../assets/imgs/asd3-2.png';
import programImage1 from '../assets/imgs/minimalistfitness.png';
import programImage2 from '../assets/imgs/bodyweightblueprint.png';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonialTransitioning, setTestimonialTransitioning] = useState(false);

  const testimonials = [
    {
      id: 1,
      beforeImage: beforeImage1,
      afterImage: afterImage1,
      quote: "JML Fitness changed my life! I've never felt stronger or more confident.",
      name: "Sarah M."
    },
    // {
    //   id: 2,
    //   beforeImage: beforeImage2,
    //   afterImage: afterImage2,
    //   quote: "The personalized approach made all the difference. Real results for real life!",
    //   name: "Mike T."
    // },
    {
      id: 3,
      beforeImage: beforeImage3,
      afterImage: afterImage3,
      quote: "Not just a workout, but a complete lifestyle transformation. Highly recommend!",
      name: "Lisa K."
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  const handleBooking = () => {
    navigate('/booking');
  };

  const changeTestimonial = (newIndex) => {
    setTestimonialTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(newIndex);
      setTestimonialTransitioning(false);
    }, 300);
  };

  const nextTestimonial = () => {
    const newIndex = (currentTestimonial + 1) % testimonials.length;
    changeTestimonial(newIndex);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1) % testimonials.length);
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
  }

  return (
    <div className="homepage">
      <div className="main-container">
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
            <Link to="/contact">Contact</Link>
            {user ? (
              <>
                <Link className="logout-link" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
            {/* <i class="fa-solid fa-bag-shopping"></i> */}
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
            <Link to="/booking" className="cta-button">
              Get Started
            </Link>
          </div>
        </main>
      </div>
      <section className="testimonials-section">
        <h2 className="testimonials-title">Testimonials</h2>
        <div className="testimonials-container">
          <div className={`testimonial-content ${testimonialTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="before-after-wrapper">
              <div className="image-container before">
                <div className="image-wrapper">
                  <img 
                    src={testimonials[currentTestimonial].beforeImage} 
                    alt="Before transformation"
                  />
                </div>
                <span className="image-label">Before</span>
              </div>
              
              <div className="quote-container">
                <i className="fa-solid fa-quote-left quote-icon"></i>
                <p className="testimonial-quote">{testimonials[currentTestimonial].quote}</p>
                <p className="testimonial-name">- {testimonials[currentTestimonial].name}</p>
              </div>
              
              <div className="image-container after">
                <img 
                  src={testimonials[currentTestimonial].afterImage} 
                  alt="After transformation"
                />
                <span className="image-label">After</span>
              </div>
            </div>
          </div>
          
          <div className="carousel-controls">
            <button className="carousel-arrow prev" onClick={prevTestimonial}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <div className="carousel-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button className="carousel-arrow next" onClick={nextTestimonial}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
      <section className="quiz-programs-section">
        <div className="quiz-programs-container">
          <div className="quiz-content">
            <h2>Find Your Perfect Training Program</h2>
            <h3>Not sure which program is right for you?</h3>
            <p>No worries — take our quick quiz! Just answer a few simple questions about your goals, experience, and lifestyle, and we'll recommend the best training plan to get you started. It only takes a minute!</p>
            <div className="quiz-btn-wrapper">
              <button className="quiz-btn" onClick={() => navigate('/quiz')}>
                TAKE QUIZ
              </button>
            </div>
          </div>
          
          <div className="programs-showcase">
            <h3>Popular Programs</h3>
            <div className="program-cards">
              <div className="program-card">
                <div className="program-image">
                  <img src={programImage1} alt="The Minimalist Program" />
                </div>
                <h4>The Minimalist</h4>
                <p className="program-price">$25</p>
                <button className="program-btn">Learn More</button>
              </div>
              
              <div className="program-card">
                <div className="program-image">
                  <img src={programImage2} alt="Bodyweight Blueprint" />
                </div>
                <h4>Bodyweight Blueprint</h4>
                <p className="program-price">$25</p>
                <button className="program-btn">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;