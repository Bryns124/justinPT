import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import HomePage from './pages/HomePage'
// import Booking from './pages/Booking'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/faqs" element={<Faqs />} /> */}
          {/* <Route path="/booking" element={<Booking />} /> */}
          {/* <Route path="/programs" element={<TrainingPrograms />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/quiz" element={<Quiz />} /> */}
          {/* Create more routes */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App