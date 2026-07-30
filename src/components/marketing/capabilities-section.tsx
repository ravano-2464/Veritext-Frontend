'use client';

import { motion } from 'framer-motion';
import { BarChart3, BrainCog, FileSearch2, LineChart, Shield, Workflow } from 'lucide-react';
import { useDashboardCopy } from '@/components/providers/i18n-provider';

export function CapabilitiesSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.capabilities;

  const features = [
    {
      icon: FileSearch2,
      title: copy.features.sentenceForensics.title,
      body: copy.features.sentenceForensics.body,
    },
    {
      icon: BrainCog,
      title: copy.features.fusionEngine.title,
      body: copy.features.fusionEngine.body,
    },
    {
      icon: LineChart,
      title: copy.features.burstinessCurves.title,
      body: copy.features.burstinessCurves.body,
    },
    {
      icon: BarChart3,
      title: copy.features.analystDashboards.title,
      body: copy.features.analystDashboards.body,
    },
    {
      icon: Shield,
      title: copy.features.securityHardening.title,
      body: copy.features.securityHardening.body,
    },
    {
      icon: Workflow,
      title: copy.features.queueProcessing.title,
      body: copy.features.queueProcessing.body,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">{copy.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="rounded-2xl border border-border/60 bg-card/70 p-5"
              >
                <Icon className="mb-3" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
