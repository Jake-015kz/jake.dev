"use client";

import { useState } from "react";
import Preloader from "../components/ui/Preloader";
import GlobalBackground from "../components/ui/GlobalBackground";
import Header from "../components/ui/Header";
import Hero from "../components/ui/Hero";
import Projects from "../components/ui/Projects";
import Contact from "../components/ui/Contact";
import Footer from "../components/ui/Footer";
import CustomCursor from "../components/ui/CustomCursor";
import NoiseOverlay from "../components/ui/NoiseOverlay";
import ScrollToPolyfill from "../components/ui/ScrollToPolyfill";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <ScrollToPolyfill />
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <GlobalBackground />
      <CustomCursor />
      <NoiseOverlay />
      <Header />
      <main>
        <Hero />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
