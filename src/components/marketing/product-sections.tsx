'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpenCheck,
  Braces,
  Building2,
  Check,
  FileText,
  GraduationCap,
  KeyRound,
  Plug,
  Webhook,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { useDashboardCopy } from '@/components/providers/i18n-provider';

export function AnalyticsPreviewSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.analytics;
  const bars = [42, 78, 63, 88, 51, 72, 36, 69];

  return (
    <section
      id="analytics"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">{copy.title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">{copy.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              copy.list.heatmaps,
              copy.list.fingerprinting,
              copy.list.readability,
              copy.list.verification,
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-zinc-950/40 p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{copy.chart.title}</p>
              <p className="text-2xl font-semibold text-primary">{copy.chart.value}</p>
            </div>
            <BarChart3 className="text-primary size-6" />
          </div>
          <div className="flex h-56 items-end gap-3">
            {bars.map((value, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col justify-end items-center gap-2"
              >
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                  className="w-full rounded-t-md bg-primary"
                  style={{ opacity: 0.45 + value / 180 }}
                />
                <span className="text-xs text-muted-foreground">S{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function UseCaseSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.useCases;

  const useCases = [
    {
      icon: GraduationCap,
      title: copy.items.universities.title,
      body: copy.items.universities.body,
    },
    {
      icon: Building2,
      title: copy.items.enterprises.title,
      body: copy.items.enterprises.body,
    },
    {
      icon: BookOpenCheck,
      title: copy.items.publishers.title,
      body: copy.items.publishers.body,
    },
    {
      icon: FileText,
      title: copy.items.researchers.title,
      body: copy.items.researchers.body,
    },
  ];

  return (
    <section
      id="features"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">{copy.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map(({ icon: UseCaseIcon, title, body }, index) => {
            return (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-border/40 bg-zinc-950/20 p-5 shadow-lg backdrop-blur-sm"
              >
                <UseCaseIcon className="mb-4 text-primary size-7" />
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.integrations;

  const integrations = [
    {
      icon: KeyRound,
      title: copy.items.apiKeys.title,
      body: copy.items.apiKeys.body,
    },
    {
      icon: Webhook,
      title: copy.items.webhooks.title,
      body: copy.items.webhooks.body,
    },
    {
      icon: Plug,
      title: copy.items.platformFit.title,
      body: copy.items.platformFit.body,
    },
  ];

  return (
    <section
      id="integrations"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-3">
        {integrations.map(({ icon: IntegrationIcon, title, body }, index) => {
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-border/40 bg-zinc-950/20 p-6 shadow-lg"
            >
              <IntegrationIcon className="mb-4 text-primary size-7" />
              <h3 className="font-semibold text-foreground text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function ApiShowcaseSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.api;

  return (
    <section
      id="api"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">{copy.description}</p>
        </div>
        <motion.pre
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-x rounded-2xl border border-border/40 bg-zinc-950/60 p-6 text-sm text-zinc-100 shadow-2xl font-mono leading-relaxed"
        >
          {`POST /api/v1/detect
x-api-key: vt_live_...

{
  "text": "Long-form writing sample...",
  "language": "auto"
}`}
        </motion.pre>
      </div>
    </section>
  );
}

export function PricingSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.pricing;

  const plans = [
    {
      name: copy.plans.free.name,
      price: copy.plans.free.price,
      limit: copy.plans.free.limit,
      features: copy.plans.free.features,
    },
    {
      name: copy.plans.pro.name,
      price: copy.plans.pro.price,
      limit: copy.plans.pro.limit,
      features: copy.plans.pro.features,
    },
    {
      name: copy.plans.business.name,
      price: copy.plans.business.price,
      limit: copy.plans.business.limit,
      features: copy.plans.business.features,
    },
    {
      name: copy.plans.enterprise.name,
      price: copy.plans.enterprise.price,
      limit: copy.plans.enterprise.limit,
      features: copy.plans.enterprise.features,
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl text-foreground">
            {copy.title}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">{copy.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map(({ name, price, limit, features }, index) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-border/40 bg-zinc-950/20 p-5 shadow-lg backdrop-blur-sm"
            >
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="mt-3 text-3xl font-semibold text-primary">{price}</p>
              <p className="text-sm text-muted-foreground">{limit}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.testimonials;

  const testimonials = [
    {
      role: copy.academic.name,
      quote: copy.academic.quote,
      name: 'Dr. Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
      role: copy.enterprise.name,
      quote: copy.enterprise.quote,
      name: 'Michael Chang',
      avatar: 'https://i.pravatar.cc/150?u=michael',
    },
    {
      role: copy.publishing.name,
      quote: copy.publishing.quote,
      name: 'Elena Rodriguez',
      avatar: 'https://i.pravatar.cc/150?u=elena',
    },
  ];

  return (
    <section className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-3">
        {testimonials.map(({ role, quote, name, avatar }, index) => (
          <motion.figure
            key={role}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-2xl border border-border/40 bg-zinc-950/20 p-6 shadow-lg backdrop-blur-sm flex flex-col justify-between gap-6"
          >
            <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
              &quot;{quote}&quot;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-4 border-t border-border/40 pt-4">
              <Image
                src={avatar}
                alt={name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover border border-border/50"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{role}</span>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export function FaqSection() {
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.faq;

  const faqs = [
    [copy.q1.question, copy.q1.answer],
    [copy.q2.question, copy.q2.answer],
    [copy.q3.question, copy.q3.answer],
  ];

  return (
    <section
      id="faq"
      className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12"
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-3xl font-semibold tracking-normal text-foreground mb-6">
          {copy.title}
        </h2>
        <div className="space-y-4">
          {faqs.map(([question, answer], index) => (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-2xl border border-border/40 bg-zinc-950/20 p-5 shadow-lg backdrop-blur-sm"
            >
              <h3 className="font-semibold text-foreground">{question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  const { isAuthenticated } = useAuth();
  const marketingCopy = useDashboardCopy('marketing');
  const copy = marketingCopy.products.cta;

  return (
    <section className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/40 rounded-3xl border border-border/40 backdrop-blur-md p-6 sm:p-8 lg:p-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Braces className="text-primary size-12" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-4xl text-foreground"
        >
          {copy.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mt-2"
        >
          {isAuthenticated ? (
            <Link href={ROUTES.dashboard} className={buttonVariants({ size: 'lg' })}>
              {copy.dashboard}
            </Link>
          ) : (
            <Link href={ROUTES.register} className={buttonVariants({ size: 'lg' })}>
              {copy.workspace}
            </Link>
          )}
          <Link
            href={ROUTES.detector}
            className={buttonVariants({ size: 'lg', variant: 'outline' })}
          >
            {copy.detector}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
