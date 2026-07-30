'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CapabilitiesSection } from '@/components/marketing/capabilities-section';
import { HeroSection } from '@/components/marketing/hero-section';
import {
  AnalyticsPreviewSection,
  ApiShowcaseSection,
  CtaSection,
  FaqSection,
  IntegrationsSection,
  PricingSection,
  TestimonialsSection,
  UseCaseSection,
} from '@/components/marketing/product-sections';
import { SecuritySection } from '@/components/marketing/security-section';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'hero', component: <HeroSection /> },
    { id: 'use-cases', component: <UseCaseSection /> },
    { id: 'capabilities', component: <CapabilitiesSection /> },
    { id: 'analytics', component: <AnalyticsPreviewSection /> },
    { id: 'integrations', component: <IntegrationsSection /> },
    { id: 'api', component: <ApiShowcaseSection /> },
    { id: 'testimonials', component: <TestimonialsSection /> },
    { id: 'pricing', component: <PricingSection /> },
    { id: 'security', component: <SecuritySection /> },
    { id: 'faq', component: <FaqSection /> },
    { id: 'cta', component: <CtaSection /> },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const contents = gsap.utils.toArray('.parallax-content') as HTMLElement[];

      contents.forEach((content) => {
        gsap.fromTo(
          content,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: content.parentElement,
              scroller: container,
              start: 'top 85%',
              end: 'top 30%',
              scrub: 1,
            },
          },
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-background flex flex-col">
      <MarketingHeader />

      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar">
        {sections.map((section) => (
          <div
            key={section.id}
            className="w-full min-h-[600px] flex items-center justify-center relative border-b border-border/10 overflow-hidden"
          >
            <div className="parallax-content w-full max-w-7xl mx-auto px-4 py-8">
              {section.component}
            </div>
          </div>
        ))}
        <div className="w-full bg-card py-10">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
