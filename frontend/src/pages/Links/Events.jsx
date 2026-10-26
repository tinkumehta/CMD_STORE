
import React, { useState } from 'react';

const EVENTS = [
  {
    id: 1,
    title: 'Vishwakarma Puja Celebration',
    date: '17 September 2026',
    image: 'https://www.oneindia.com/img/1200x80/2017/09/vishwakarma-16-1505528036.jpg',
    description:
      'Vishwakarma Puja is a special occasion dedicated to Lord Vishwakarma, the divine architect and craftsman. The celebration honors engineering, craftsmanship, tools, machinery, and technology. We seek His blessings for workplace safety, prosperity, innovation, and continued success.',
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
    image: '/images/workshop.jpg',
    description:
      'A practical training session on the Government e-Marketplace (GeM) portal, covering seller registration, product listing, bid participation, tender management, order processing, and government procurement procedures.',
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
      'A collaborative vendor meeting in Hazaribagh focused on strengthening business relationships, discussing government procurement opportunities, sharing industry knowledge, and exploring new projects and partnerships.',
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
];

function Event() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openEvent = (event) => {
    setSelectedEvent(event);
    document.getElementById('events-content')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const showNextEvent = () => {
    const currentIndex = EVENTS.findIndex(
      (event) => event.id === selectedEvent?.id
    );
    setSelectedEvent(EVENTS[(currentIndex + 1) % EVENTS.length]);
  };

  return (
    <div className="w-full bg-linear-to-r from-[#EDE0D3] via-[#F0C9C9] to-[#EBDFF2] relative overflow-hidden">
     
      <div
        id="events-content"
        className="mx-auto min-h-screen max-w-7xl scroll-mt-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        {/* ATTRACTIVE HEADING */}
        <div className="relative mb-5 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-5 py-6 text-center shadow-md sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-12 -top-16 h-20 w-48 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-20 w-48 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-blue-600" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
                {selectedEvent ? 'Event Highlights' : "What's Happening"}
              </span>
            </div>

            <h1 className="break-words text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {selectedEvent ? (
                selectedEvent.title
              ) : (
                <>
                  Our{' '}
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    Events
                  </span>
                </>
              )}
            </h1>

            <div className="mx-auto mt-5 flex items-center justify-center gap-2">
              <span className="h-1 w-10 rounded-full bg-blue-300" />
              <span className="h-1.5 w-16 rounded-full bg-blue-700" />
              <span className="h-1 w-10 rounded-full bg-indigo-300" />
            </div>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {selectedEvent
                ? 'Discover the highlights, purpose, and complete details of this event.'
                : 'Discover our latest events, training programs, and business gatherings. Explore the moments that inspire learning, strengthen partnerships, and bring our community together.'}
            </p>

            {!selectedEvent && (
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                  ✦ Training Programs
                </span>
                <span className="rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                  ✦ Vendor Meets
                </span>
                <span className="rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                  ✦ Celebrations
                </span>
              </div>
            )}
          </div>
        </div>

        {/* EVENT DETAILS */}
        {selectedEvent ? (
          <div className="mx-auto max-w-5xl">
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="h-64 w-full bg-slate-100 object-cover sm:h-[420px]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://placehold.co/1200x600/e2e8f0/334155?text=Event+Image';
                }}
              />

              <div className="p-6 sm:p-10">
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-600">
                  {selectedEvent.date}
                </p>

                <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {selectedEvent.title}
                </h2>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    Event Description
                  </h3>
                  <p className="text-base leading-8 text-slate-600">
                    {selectedEvent.description}
                  </p>

                  <h3 className="mb-3 mt-8 text-xl font-bold text-slate-900">
                    About This Event
                  </h3>
                  <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                    {selectedEvent.details}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    ← Back to All Events
                  </button>

                  <button
                    onClick={showNextEvent}
                    className="rounded-lg border border-blue-700 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next Event →
                  </button>
                </div>
              </div>
            </article>
          </div>
        ) : (
          /* EVENT CARDS */
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((event) => (
              <article
                key={event.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  onClick={() => openEvent(event)}
                  className="block w-full overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  aria-label={`View ${event.title}`}
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    className="h-56 w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://placehold.co/800x500/e2e8f0/334155?text=Event+Image';
                    }}
                  />
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-600">
                    {event.date}
                  </p>

                  <h2 className="mb-3 text-xl font-bold text-slate-900">
                    {event.title}
                  </h2>

                  <p className="mb-5 flex-1 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>

                  <button
                    onClick={() => openEvent(event)}
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View Details <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Event;