import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react'; // Added icon for better UI

const EVENTS = [
  {
    id: 1,
    title: 'Vishwakarma Puja Celebration',
    date: '17 September 2026',
    image: 'https://www.oneindia.com/img/1200x80/2017/09/vishwakarma-16-1505528036.jpg',
    description:
      'Vishwakarma Puja is a special occasion dedicated to Lord Vishwakarma, the divine architect and craftsman. The celebration honors engineering, craftsmanship, tools, machinery, and technology.',
    details: `Vishwakarma Puja Celebration

Vishwakarma Puja is celebrated with great devotion and enthusiasm to honor Lord Vishwakarma, who is revered as the divine architect, engineer, and craftsman.

Purpose of the Celebration

The main purpose of Vishwakarma Puja is to seek divine blessings for the safe and efficient operation of machinery, tools, equipment, and other workplace resources.

Puja and Rituals

Employees and team members come together to offer prayers to Lord Vishwakarma. Tools, machines, equipment, and work areas are cleaned and worshipped as a symbol of gratitude.

Importance of Workplace Safety

The celebration highlights workplace safety, proper equipment maintenance, teamwork, and responsible working practices.

Teamwork and Togetherness

Vishwakarma Puja brings employees together and strengthens unity, enthusiasm, and commitment toward common goals.

Our Wishes

May Lord Vishwakarma bless us with wisdom, creativity, technical excellence, prosperity, and success.

Happy Vishwakarma Puja!`,
  },
  {
    id: 2,
    title: 'GeM Training',
    date: '2026',
    image: 'gem.jpg',
    description:
      'A practical training session on the Government e-Marketplace (GeM) portal, covering seller registration, product listing, bid participation, tender management, and order processing.',
    details: `GeM Training Program

The GeM (Government e-Marketplace) Training Program is designed to help participants understand the online government procurement system and develop the skills required to use the GeM portal effectively.

About the Training

This training provides practical knowledge of the GeM portal and the procedures involved in selling products and services to eligible government buyers.

Key Training Topics

1. Introduction to GeM Portal
Understand the purpose, benefits, and working process of the Government e-Marketplace.

2. Seller Registration
Learn about seller registration, business profile setup, and account verification requirements.

3. Product and Service Listing
Learn how to list products and services, provide accurate descriptions, enter specifications, and maintain pricing information.

4. Bid and Tender Participation
Learn how to search for bids, read tender documents, understand eligibility criteria, and submit bids according to buyer requirements.

5. Order Management
Understand order acceptance, delivery requirements, invoice submission, and order tracking.

6. Documents and Compliance
Understand commonly required documents, applicable certifications, GST details where applicable, and bid-specific terms.

Benefits of the Training

The program aims to improve procurement knowledge, reduce common bid submission errors, and help businesses understand government procurement opportunities.

Who Can Participate?

Business owners, manufacturers, authorized sellers, service providers, entrepreneurs, and procurement professionals.

Expected Outcome

Participants will gain a better understanding of GeM registration, catalogue management, bid preparation, tender participation, and order processing.

Note: Actual eligibility and required documents depend on applicable GeM rules and individual bid requirements.`,
  },
  {
    id: 3,
    title: 'Vendor Meet in Hazaribagh',
    date: '2025',
    image: '/images/team-event.jpg',
    description:
      'A collaborative vendor meeting in Hazaribagh focused on strengthening business relationships, discussing government procurement opportunities, sharing industry knowledge, and exploring new partnerships.',
    details: `Vendor Meet in Hazaribagh

The Vendor Meet in Hazaribagh was organized as a platform for vendors, business representatives, and stakeholders to connect, exchange ideas, and discuss business development opportunities.

About the Event

The event focused on building stronger relationships between vendors and business partners while creating awareness about procurement opportunities and emerging business possibilities.

Objectives of the Vendor Meet

1. Vendor Networking
Establish professional connections and build long-term business relationships.

2. Government Tender Awareness
Discuss government tender opportunities, procurement procedures, GeM portal participation, and bid eligibility criteria.

3. Business Development
Explore potential business opportunities, upcoming projects, product requirements, and collaboration possibilities.

4. Knowledge Sharing
Exchange experiences and practical knowledge related to tender submission, documentation, pricing, and compliance.

5. Quality and Service Standards
Highlight product quality, timely delivery, transparent communication, and reliable after-sales support.

6. Discussion and Interaction
Provide a platform to raise questions, share suggestions, and discuss business challenges.

Importance of the Event

Vendor meetings improve communication, encourage partnerships, and help businesses understand market requirements.

Expected Outcomes

The event aimed to strengthen vendor relationships, promote knowledge sharing, and identify future business collaboration opportunities.

Our Vision

We believe collaboration, transparency, quality, and continuous learning are essential for sustainable business growth.

Thank You

We thank all participating vendors and business representatives for their valuable contributions.`,
  },
  {
    id: 3,
    title: '',
    date: '2025',
    image: 'frellwall.jpg',
    description:
      '',
    details: `


We believe collaboration, transparency, quality, and continuous learning are essential for sustainable business growth.

Thank You

We thank all participating vendors and business representatives for their valuable contributions.`,
  },
];

function Event() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (selectedEvent) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [selectedEvent]);

  const openEvent = (event) => {
    setSelectedEvent(event);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleBack = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % EVENTS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);

  return (
    <div className="w-full bg-linear-to-r from-[#EDE0D3] via-[#F0C9C9] to-[#EBDFF2] relative overflow-hidden min-h-screen">
      
      <div id="events-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        
        {/* ======================= EVENT DETAILS VIEW ======================= */}
        {selectedEvent ? (
          <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* TOP BACK BUTTON */}
            <button
              onClick={handleBack}
              className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 transition hover:bg-slate-50 hover:text-blue-600"
            >
              <ArrowLeft size={16} /> Back to All Events
            </button>

            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
              <div className="relative">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="h-64 w-full bg-slate-100 object-cover sm:h-[420px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/1200x600/e2e8f0/334155?text=Event+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-10">
                  <div>
                    <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-300 drop-shadow">
                      {selectedEvent.date}
                    </p>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                      {selectedEvent.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-10">
                <h3 className="mb-3 text-xl font-bold text-slate-900">Event Description</h3>
                <p className="text-base leading-8 text-slate-600 mb-8">{selectedEvent.description}</p>

                <h3 className="mb-3 text-xl font-bold text-slate-900 border-t border-gray-100 pt-8">About This Event</h3>
                <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                  {selectedEvent.details}
                </p>
                
                {/* Removed the bottom back button to keep it clean */}
              </div>
            </article>
          </div>
        ) : (
          /* ======================= MAIN VIEW (SLIDESHOW + CARDS) ======================= */
          <div className="space-y-12">
            
            {/* 1. HERO SLIDESHOW */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              {/* Background Images (Crossfade) */}
              {EVENTS.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/1600x800/1e293b/ffffff?text=Event+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
              ))}

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
                <div className="max-w-2xl">
                  <span className="inline-block px-2.5 py-1 bg-blue-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md mb-3 shadow-lg">
                    {EVENTS[currentSlide].date}
                  </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
                    {EVENTS[currentSlide].title}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed mb-6 line-clamp-2 md:line-clamp-3 drop-shadow">
                    {EVENTS[currentSlide].description}
                  </p>
                  <button
                    onClick={() => openEvent(EVENTS[currentSlide])}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs md:text-sm font-bold text-gray-900 transition-all hover:bg-blue-600 hover:text-white hover:scale-105 shadow-lg"
                  >
                    View Details <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>

              {/* Nav Arrows */}
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">‹</button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/40 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">›</button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {EVENTS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 2. EVENT CARDS GRID */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">All Events</h2>
                <div className="h-px bg-slate-300 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {EVENTS.map((event) => (
                  <article
                    key={event.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <button
                      onClick={() => openEvent(event)}
                      className="block w-full overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        loading="lazy"
                        className="h-48 w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://placehold.co/800x500/e2e8f0/334155?text=Event+Image';
                        }}
                      />
                    </button>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-600">
                        {event.date}
                      </p>
                      <h2 className="mb-3 text-lg font-bold text-slate-900 line-clamp-2">
                        {event.title}
                      </h2>
                      <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {event.description}
                      </p>
                      <button
                        onClick={() => openEvent(event)}
                        className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-700 hover:text-white"
                      >
                        Read More <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Event;