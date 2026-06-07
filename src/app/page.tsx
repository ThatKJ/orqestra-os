"use client";

import { useEffect, useRef } from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TraceSection } from "@/components/landing/TraceSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fadeEls = new Set<Element>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
            fadeEls.delete(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const liveObs = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(".fade-up:not(.visible):not(.observed)").forEach((el) => {
        el.classList.add("observed");
        fadeEls.add(el);
        obs.observe(el);
      });
    });

    liveObs.observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll<HTMLElement>(".fade-up:not(.visible)").forEach((el) => {
      el.classList.add("observed");
      fadeEls.add(el);
      obs.observe(el);
    });

    const heroFades = document.querySelectorAll(".hero .fade-up");
    heroFades.forEach((el) => {
      el.classList.add("visible");
      fadeEls.delete(el);
    });

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>(".section-parallax").forEach((el) => {
          const rect = el.getBoundingClientRect();
          const speed = parseFloat(el.dataset.parallaxSpeed || "0.15");
          const offset = rect.top * speed;
          el.style.backgroundPositionY = `${offset}px`;
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      obs.disconnect();
      liveObs.disconnect();
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div ref={sentinelRef} />
        <ProblemSection />
        <FeaturesSection />
        <TraceSection />
        <ExamplesSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
