
import React, { useState } from 'react'
import EventDetail from "./EventDetail";
import HeroCarousel from "../components/Landing/HeroCarousel";
import Header from "../components/Landing/Header";
import ContactBanner from "../components/Landing/ContactBanner";
import NewsSection from "../components/Landing/NewsSection";
import EventsSection from "../components/Landing/EventsSection";
import GrievancesSection from "../components/Landing/GrievancesSection";
import RegistrationButton from "../components/Landing/RegistrationButton";
import RegistrationForm from "../components/Landing/RegistrationForm";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  return (
    <div className="min-h-screen bg-gray-50">
        <Header isMenuOpen={isMenuOpen} setShowRegisterForm={setShowRegisterForm} setIsMenuOpen={setIsMenuOpen} />
        {/* <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /> */}
        <HeroCarousel />
        <ContactBanner />
        <NewsSection />
        <EventsSection setSelectedEvent={setSelectedEvent} />
        <GrievancesSection />
        <RegistrationButton setShowRegisterForm={setShowRegisterForm} />
        {showRegisterForm && (
          <RegistrationForm setShowRegisterForm={setShowRegisterForm} />
        )}
        <Footer />
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
  )
}

export default LandingPage
