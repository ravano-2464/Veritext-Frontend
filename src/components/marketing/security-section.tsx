'use client';

import { motion } from 'framer-motion';
import { useDashboardCopy } from '@/components/providers/i18n-provider';

export function SecuritySection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.security;

  const checkpoints = [
    [copy.checkpoints.securityHeaders.title, copy.checkpoints.securityHeaders.detail],
    [copy.checkpoints.inputHygiene.title, copy.checkpoints.inputHygiene.detail],
    [copy.checkpoints.promptDefense.title, copy.checkpoints.promptDefense.detail],
    [copy.checkpoints.operationalReliability.title, copy.checkpoints.operationalReliability.detail],
  ];

  return (
    <section
      id="security"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">{copy.description}</p>
        </div>

        <div className="space-y-3">
          {checkpoints.map(([title, detail], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-border/60 bg-background/70 p-4"
            >
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
