'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Globe2, ShieldCheck } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useDashboardCopy } from '@/components/providers/i18n-provider';

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const marketingCopy = useDashboardCopy('marketing');

  const proofPoints = [
    { icon: Globe2, label: marketingCopy.hero.proofPoints.multilingual },
    { icon: Building2, label: marketingCopy.hero.proofPoints.controls },
    { icon: ShieldCheck, label: marketingCopy.hero.proofPoints.features },
  ];

  return (
    <section className="relative w-full h-full min-h-[500px] overflow-hidden bg-zinc-950 text-white rounded-3xl shadow-2xl border border-white/5">
      <Image
        src="/veritext-hero-dashboard.webp"
        alt="VeriText dashboard showing sentence-level AI writing forensics"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-60"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.95)_0%,rgba(9,9,11,0.8)_36%,rgba(9,9,11,0.2)_80%)]" />
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-6 py-8 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl space-y-7"
        >
          <p className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase text-zinc-200 backdrop-blur">
            <ShieldCheck className="size-3.5" />
            {marketingCopy.hero.badge}
          </p>
          <div className="space-y-4">
            <h1 className="text-balance text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-none tracking-normal">
              {marketingCopy.hero.title}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-zinc-200 sm:text-xl">
              {marketingCopy.hero.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Link href={ROUTES.dashboard} className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                {marketingCopy.hero.dashboard}
                <ArrowRight data-icon="inline-end" />
              </Link>
            ) : (
              <Link href={ROUTES.register} className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                {marketingCopy.hero.startFree}
                <ArrowRight data-icon="inline-end" />
              </Link>
            )}
            <Link
              href={ROUTES.detector}
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
            >
              {marketingCopy.hero.openDetector}
            </Link>
          </div>
          <div className="grid max-w-2xl gap-4 border-t border-white/15 pt-5 sm:grid-cols-3">
            {proofPoints.map(({ icon: MetricIcon, label }) => {
              return (
                <div key={label} className="flex gap-2 text-sm text-zinc-200">
                  <MetricIcon className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
