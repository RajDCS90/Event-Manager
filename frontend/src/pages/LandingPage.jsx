
import Header from "../components/Header";
import MobileMenu from "../components/MobileMenu";
import HeroCarousel from "../components/HeroCarousel";
import ContactBanner from "../components/ContactBanner";
import NewsSection from "../components/NewsSection";
import EventsSection from "../components/EventsSection";
import GrievancesSection from "../components/GrievancesSection";
import RegistrationButton from "../components/RegistrationButton";
import RegistrationForm from "../components/RegistrationForm";
import Footer from "../components/Footer";

import React, { useState } from 'react'
import EventDetail from "./EventDetail";

const LandingPage = () => {


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  return (
    <div className="min-h-screen bg-gray-50">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
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
