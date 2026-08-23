import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import PageTransition from '@/components/PageTransition';
import IntroSplash from '@/components/IntroSplash';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Team from '@/pages/Team';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Achievements from '@/pages/Achievements';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';

/** Scroll to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroSplash onComplete={() => setIntroDone(true)} />}
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </PageTransition>
      <Footer />
    </>
  );
}
