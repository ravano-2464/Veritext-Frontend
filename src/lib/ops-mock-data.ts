'use client';

import { create } from 'zustand';

export interface MetricCardValue {
  label: string;
  value: number;
  unit?: string;
  trend: { direction: 'up' | 'down' | 'stable'; value: string; positive?: boolean };
  status: 'healthy' | 'warning' | 'critical';
  sparkline: number[];
}

export interface QueueInfo {
  name: string;
  priority: number;
  active: number;
  waiting: number;
  completed: number;
  failed: number;
  throughput: number;
  avgProcessingTime: number;
  concurrency: number;
  sparkline: number[];
}

export interface WorkerInfo {
  id: string;
  status: 'active' | 'idle' | 'failed';
  currentJob: string;
  cpu: number;
  memory: number;
}

export interface ErrorEvent {
  id: string;
  timestamp: string;
  code: string;
  endpoint: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  stackTrace: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  timeLabel: string;
  type: 'deployment' | 'config' | 'alert' | 'spike';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface JobRow {
  jobId: string;
  queue: string;
  userId: string;
  type: 'TEXT' | 'FILE' | 'BATCH';
  wordCount: number;
  progress: number;
  startedAt: string;
  duration: string;
  stage: string;
}

export interface FailedJob {
  jobId: string;
  queue: string;
  failedAt: string;
  attempts: number;
  maxAttempts: number;
  error: string;
  stackTrace: string;
}

export interface LogLine {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE';
  service: string;
  requestId?: string;
  message: string;
  meta?: Record<
    string,
    string | number | boolean | Record<string, string | number | boolean> | undefined
  >;
}

export interface AlertRule {
  rule: string;
  condition: string;
  threshold: string;
  notify: string;
}

export interface Alert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  service: string;
  triggeredAt: string;
  duration: string;
  status: 'FIRING' | 'ACKNOWLEDGED' | 'RESOLVED';
  resolvedAt?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
}

export interface ServiceHealth {
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';
  uptime: string;
  latency: number;
  lastChecked: string;
  endpoint: string;
  uptimeHistory: boolean[];
}

export interface QueryPerf {
  hash: string;
  avgTime: number;
  maxTime: number;
  callCount: number;
  table: string;
  queryText: string;
}

export interface TableStat {
  table: string;
  rowCount: number;
  size: string;
  indexSize: string;
  lastVacuum: string;
  sizeBytes: number;
}

export interface Migration {
  name: string;
  appliedAt: string;
  duration: string;
  status: 'success' | 'failed' | 'running';
}

export interface RedisNamespace {
  prefix: string;
  keyCount: number;
  avgTtl: string;
  memory: string;
}

export interface RedisKey {
  pattern: string;
  memory: string;
  ttl: string;
  type: string;
}

export function generateTimeSeries(
  points: number,
  base: number,
  variance: number,
  trend: 'up' | 'down' | 'stable' = 'stable',
): { time: string; value: number }[] {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const trendEffect =
      trend === 'up'
        ? (points - i) * (variance * 0.1)
        : trend === 'down'
          ? -(points - i) * (variance * 0.1)
          : 0;
    const randomVal = base + trendEffect + (Math.random() - 0.5) * variance;
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    data.push({
      time: timeStr,
      value: Math.max(0, Math.round(randomVal * 100) / 100),
    });
  }
  return data;
}

const servicesList = [
  'API Server',
  'NLP Microservice',
  'PostgreSQL',
  'Redis',
  'BullMQ',
  'S3/R2',
  'Stripe',
  'OpenAI API',
  'Email Service',
];

const mockServicesEndpoints: Record<string, string> = {
  'API Server': 'https://api.veritext.com/healthz',
  'NLP Microservice': 'https://nlp.veritext.com/health',
  PostgreSQL: 'postgresql://db.veritext.com:5432',
  Redis: 'redis://cache.veritext.com:6379',
  BullMQ: 'redis://queue.veritext.com:6379',
  'S3/R2': 'https://s3.us-east-1.amazonaws.com',
  Stripe: 'https://api.stripe.com/v3',
  'OpenAI API': 'https://api.openai.com/v1',
  'Email Service': 'https://smtp.sendgrid.net',
};

function generateUptimeHistory(): boolean[] {
  const history: boolean[] = [];
  for (let i = 0; i < 90; i++) {
    history.push(Math.random() > 0.02);
  }
  return history;
}

const logMessages = [
  {
    level: 'INFO',
    service: 'system',
    message: 'Database Connection Pool initialized with 100 max connections',
    meta: { host: 'localhost:5432', pool: 'primary' },
  },
  {
    level: 'INFO',
    service: 'system',
    message: 'Queue Monitor listening to BullMQ channels',
    meta: { redis: 'localhost:6379', queues: 4 },
  },
  {
    level: 'INFO',
    service: 'system',
    message: 'NLP Microservice heartbeat detected (healthy)',
    meta: { host: 'localhost:8000', latency: '4ms' },
  },
  {
    level: 'INFO',
    service: 'system',
    message: 'Stripe webhook listener active',
    meta: { endpoint: '/v1/billing/webhook' },
  },
  {
    level: 'WARN',
    service: 'system',
    message: 'Redis cache memory usage exceeded 80% threshold',
    meta: { used: '52.1 MB', max: '64.0 MB' },
  },
  {
    level: 'ERROR',
    service: 'system',
    message: 'OpenAI API request failed: Rate Limit Exceeded',
    meta: { endpoint: 'v1/chat/completions', code: 429 },
  },
];

function generateRandomLog(levelFilter?: string): LogLine {
  const index = Math.floor(Math.random() * logMessages.length);
  let msgTemplate = logMessages[index];
  if (levelFilter && levelFilter !== 'ALL') {
    const matches = logMessages.filter((m) => m.level === levelFilter);
    if (matches.length > 0) {
      msgTemplate = matches[Math.floor(Math.random() * matches.length)];
    }
  }

  const reqId =
    Math.random() > 0.5 ? `req-${Math.random().toString(36).substring(2, 8)}` : undefined;
  const now = new Date();

  return {
    id: Math.random().toString(),
    timestamp: now.toISOString(),
    level: msgTemplate.level as 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE',
    service: msgTemplate.service.toLowerCase(),
    requestId: reqId,
    message: msgTemplate.message,
    meta: msgTemplate.meta,
  };
}

interface OpsState {
  environment: 'Production' | 'Staging' | 'Dev';
  systemStatus: 'All Systems Operational' | 'Degraded Performance' | 'Critical Incident';
  lastUpdated: Date;
  isSidebarCollapsed: boolean;
  isLiveLogsStreaming: boolean;
  refreshCounter: number;

  metrics: {
    requestsPerMin: MetricCardValue;
    p95Latency: MetricCardValue;
    errorRate: MetricCardValue;
    activeJobs: MetricCardValue;
    dbConnections: MetricCardValue;
    cpuUsage: MetricCardValue;
    memoryUsage: MetricCardValue;
    redisHitRate: MetricCardValue;
  };

  requestsTimeline: { time: string; value: number }[];
  errorsTimeline: { time: string; value: number }[];

  dbPool: {
    total: number;
    active: number;
    idle: number;
    waiting: number;
    avgAcquireTime: number;
  };
  slowQueries: QueryPerf[];
  tableStats: TableStat[];
  migrations: Migration[];

  redisMemory: {
    used: number;
    max: number;
    evicted: number;
    hits: number;
    misses: number;
  };
  redisNamespaces: RedisNamespace[];
  redisKeys: RedisKey[];
  redisCommandsTimeline: { time: string; GET: number; SET: number; DEL: number }[];

  queues: QueueInfo[];
  activeJobsList: JobRow[];
  failedJobsList: FailedJob[];
  queueThroughputTimeline: {
    time: string;
    enterprise: number;
    business: number;
    pro: number;
    free: number;
  }[];

  workers: WorkerInfo[];

  recentErrors: ErrorEvent[];
  logs: LogLine[];
  logLevelFilter: string;
  logServiceFilter: string;
  logSearchQuery: string;

  timelineEvents: SystemEvent[];

  alerts: Alert[];
  alertRules: AlertRule[];

  servicesHealth: ServiceHealth[];
  diskUsage: number;
  cpuTimeline: number[];
  memTimeline: number[];
  diskTimeline: number[];
  latencyHeatmap: Record<string, number[]>;

  setEnvironment: (env: 'Production' | 'Staging' | 'Dev') => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLiveLogsStreaming: (streaming: boolean) => void;
  setLogLevelFilter: (level: string) => void;
  setLogServiceFilter: (service: string) => void;
  setLogSearchQuery: (query: string) => void;

  acknowledgeAlert: (alertId: string, user?: string) => void;
  resolveAlert: (alertId: string, user?: string) => void;
  retryFailedJob: (jobId: string) => void;
  deleteFailedJob: (jobId: string) => void;
  retryAllFailedJobs: () => void;
  deleteAllFailedJobs: () => void;
  cancelActiveJob: (jobId: string) => void;
  clearLogs: () => void;
  manualRefresh: () => void;

  tickMetrics: () => void;
  tickQueues: () => void;
  tickLogs: () => void;
  tickHealth: () => void;
}

export const useOpsStore = create<OpsState>((set) => {
  const now = new Date();

  const initialQueues: QueueInfo[] = [
    {
      name: 'enterprise',
      priority: 10,
      active: 5,
      waiting: 12,
      completed: 124,
      failed: 2,
      throughput: 15.5,
      avgProcessingTime: 180,
      concurrency: 10,
      sparkline: [12, 14, 15, 12, 13, 16, 15],
    },
    {
      name: 'business',
      priority: 5,
      active: 3,
      waiting: 45,
      completed: 89,
      failed: 5,
      throughput: 8.2,
      avgProcessingTime: 420,
      concurrency: 5,
      sparkline: [6, 8, 7, 9, 8, 7, 8],
    },
    {
      name: 'pro',
      priority: 3,
      active: 1,
      waiting: 203,
      completed: 54,
      failed: 12,
      throughput: 4.1,
      avgProcessingTime: 950,
      concurrency: 3,
      sparkline: [3, 4, 3, 5, 4, 3, 4],
    },
    {
      name: 'free',
      priority: 1,
      active: 0,
      waiting: 1204,
      completed: 12,
      failed: 48,
      throughput: 1.2,
      avgProcessingTime: 2400,
      concurrency: 1,
      sparkline: [1, 1, 2, 1, 1, 0, 1],
    },
  ];

  const initialWorkers: WorkerInfo[] = [
    { id: 'worker-node-1', status: 'active', currentJob: 'job_ent_902', cpu: 78, memory: 56 },
    { id: 'worker-node-2', status: 'active', currentJob: 'job_bus_412', cpu: 62, memory: 48 },
    { id: 'worker-node-3', status: 'idle', currentJob: 'None', cpu: 4, memory: 22 },
    { id: 'worker-node-4', status: 'active', currentJob: 'job_pro_703', cpu: 94, memory: 88 },
    { id: 'worker-node-5', status: 'failed', currentJob: 'job_free_819', cpu: 0, memory: 0 },
    { id: 'worker-node-6', status: 'idle', currentJob: 'None', cpu: 2, memory: 21 },
  ];

  const initialActiveJobs: JobRow[] = [
    {
      jobId: 'job_ent_902',
      queue: 'enterprise',
      userId: 'usr_ent_88',
      type: 'FILE',
      wordCount: 8420,
      progress: 68,
      startedAt: new Date(now.getTime() - 45000).toISOString(),
      duration: '45s',
      stage: 'Running perplexity analysis...',
    },
    {
      jobId: 'job_bus_412',
      queue: 'business',
      userId: 'usr_bus_14',
      type: 'TEXT',
      wordCount: 1240,
      progress: 41,
      startedAt: new Date(now.getTime() - 25000).toISOString(),
      duration: '25s',
      stage: 'Tokenizing content...',
    },
    {
      jobId: 'job_pro_703',
      queue: 'pro',
      userId: 'usr_pro_02',
      type: 'BATCH',
      wordCount: 18450,
      progress: 12,
      startedAt: new Date(now.getTime() - 110000).toISOString(),
      duration: '1m 50s',
      stage: 'Requesting OpenAI API...',
    },
  ];

  const initialFailedJobs: FailedJob[] = [
    {
      jobId: 'job_fail_101',
      queue: 'free',
      failedAt: new Date(now.getTime() - 1200000).toISOString(),
      attempts: 3,
      maxAttempts: 3,
      error: 'OpenAI API rate limit exceeded',
      stackTrace:
        'Error: Rate limit reached at OpenAIClient.post (openai.ts:142)\n    at Object.analyzeText (analyzer.ts:88)\n    at QueueProcessor.processJob (queue.ts:204)',
    },
    {
      jobId: 'job_fail_102',
      queue: 'pro',
      failedAt: new Date(now.getTime() - 2800000).toISOString(),
      attempts: 3,
      maxAttempts: 3,
      error: 'PostgreSQL pool connection timeout',
      stackTrace:
        'Error: Connection timeout after 5000ms at Database.acquire (db.ts:32)\n    at Object.saveResult (db.ts:119)\n    at QueueProcessor.processJob (queue.ts:211)',
    },
    {
      jobId: 'job_fail_103',
      queue: 'business',
      failedAt: new Date(now.getTime() - 3600000).toISOString(),
      attempts: 2,
      maxAttempts: 3,
      error: 'SentenceTokenizerError: Failed parsing sentence tokens',
      stackTrace:
        'TokenizerError: Offset index out of range at Tokenizer.split (tokenizer.ts:42)\n    at Tokenizer.tokenize (tokenizer.ts:12)\n    at QueueProcessor.processJob (queue.ts:182)',
    },
  ];

  const initialErrorsList: ErrorEvent[] = [
    {
      id: 'err-1',
      timestamp: new Date(now.getTime() - 300000).toISOString(),
      code: '504',
      endpoint: 'POST /v1/detect/file',
      severity: 'CRITICAL',
      message: 'Perplexity API timeout after 5000ms',
      stackTrace:
        'TimeoutError: Request timed out at Request.Timeout (request.ts:52)\n    at Object.sendDetect (perplexity.ts:89)\n    at Router.handle (router.ts:22)',
    },
    {
      id: 'err-2',
      timestamp: new Date(now.getTime() - 900000).toISOString(),
      code: '429',
      endpoint: 'POST /v1/detect/text',
      severity: 'HIGH',
      message: 'Too many requests for IP 192.168.1.1',
      stackTrace:
        'RateLimitError: Limit exceeded at RateLimiter.check (rate-limiter.ts:24)\n    at Router.handle (router.ts:18)',
    },
    {
      id: 'err-3',
      timestamp: new Date(now.getTime() - 1800000).toISOString(),
      code: '500',
      endpoint: 'GET /v1/user/billing',
      severity: 'MEDIUM',
      message: 'Stripe API authentication failure',
      stackTrace:
        'StripeAuthenticationError: Invalid API key provided at Stripe.request (stripe.ts:112)',
    },
    {
      id: 'err-4',
      timestamp: new Date(now.getTime() - 3600000).toISOString(),
      code: '503',
      endpoint: 'POST /v1/detect/batch',
      severity: 'HIGH',
      message: 'NLP Microservice connection refused',
      stackTrace:
        'ConnectionRefusedError: connect ECONNREFUSED 10.0.1.4:8000 at NLPClient.post (nlp.ts:33)',
    },
  ];

  const initialAlerts: Alert[] = [
    {
      id: 'alert-1',
      severity: 'CRITICAL',
      title: 'OpenAI API High Latency',
      description: 'Avg latency spike at 4.2s (threshold 2.0s)',
      service: 'OpenAI API',
      triggeredAt: new Date(now.getTime() - 720000).toISOString(),
      duration: '12 minutes ago',
      status: 'FIRING',
    },
    {
      id: 'alert-2',
      severity: 'HIGH',
      title: 'BullMQ Queue Congestion',
      description: 'PRO queue has 203 waiting jobs (threshold 150)',
      service: 'BullMQ',
      triggeredAt: new Date(now.getTime() - 1500000).toISOString(),
      duration: '25 minutes ago',
      status: 'ACKNOWLEDGED',
      acknowledgedBy: 'admin@veritext.com',
    },
    {
      id: 'alert-3',
      severity: 'MEDIUM',
      title: 'Database Pool Connections High',
      description: 'DB connections at 87% pool capacity',
      service: 'PostgreSQL',
      triggeredAt: new Date(now.getTime() - 2400000).toISOString(),
      duration: '40 minutes ago',
      status: 'RESOLVED',
      resolvedAt: new Date(now.getTime() - 600000).toISOString(),
      resolvedBy: 'devops@veritext.com',
    },
    {
      id: 'alert-4',
      severity: 'LOW',
      title: 'High Redis Memory Usage',
      description: 'Redis memory used is at 81.2% (threshold 80%)',
      service: 'Redis',
      triggeredAt: new Date(now.getTime() - 5400000).toISOString(),
      duration: '1.5 hours ago',
      status: 'RESOLVED',
      resolvedAt: new Date(now.getTime() - 4800000).toISOString(),
      resolvedBy: 'devops@veritext.com',
    },
  ];

  const initialAlertRules: AlertRule[] = [
    {
      rule: 'API Response P95 Latency',
      condition: 'p95_latency > 300ms',
      threshold: '300ms',
      notify: 'Slack (#ops-alerts), Email, PagerDuty',
    },
    {
      rule: 'API Error Rate Warning',
      condition: 'error_rate > 1.0%',
      threshold: '1.0% (15m)',
      notify: 'Slack (#ops-alerts), Email',
    },
    {
      rule: 'API Error Rate Critical',
      condition: 'error_rate > 3.0%',
      threshold: '3.0% (5m)',
      notify: 'Slack (#ops-alerts), PagerDuty, SMS',
    },
    {
      rule: 'Queue Waiting Job Count',
      condition: 'waiting_jobs > 150',
      threshold: '150 jobs',
      notify: 'Slack (#ops-alerts)',
    },
    {
      rule: 'Database Max Connections',
      condition: 'db_connections > 90',
      threshold: '90 connections',
      notify: 'Slack (#ops-alerts), PagerDuty',
    },
    {
      rule: 'Server Disk space critical',
      condition: 'disk_usage > 90%',
      threshold: '90%',
      notify: 'PagerDuty, SMS',
    },
  ];

  const initialTimelineEvents: SystemEvent[] = [
    {
      id: 'ev-1',
      timestamp: new Date(now.getTime() - 1500000).toISOString(),
      timeLabel: '25m ago',
      type: 'deployment',
      title: 'Deploy veritext-api@1.4.2',
      description: 'Production API update pushed. Sentence-level caching refactored.',
      severity: 'success',
    },
    {
      id: 'ev-2',
      timestamp: new Date(now.getTime() - 2700000).toISOString(),
      timeLabel: '45m ago',
      type: 'config',
      title: 'DB Pool Configuration Changed',
      description: 'Max connections pool raised from 80 to 100.',
      severity: 'info',
    },
    {
      id: 'ev-3',
      timestamp: new Date(now.getTime() - 4200000).toISOString(),
      timeLabel: '1.2h ago',
      type: 'alert',
      title: 'Alert fired: OpenAI API High Latency',
      description: 'Latency breached 2.0s threshold.',
      severity: 'error',
    },
    {
      id: 'ev-4',
      timestamp: new Date(now.getTime() - 6000000).toISOString(),
      timeLabel: '1.6h ago',
      type: 'spike',
      title: 'Traffic spike detected',
      description: 'Requests/min increased by 45% (Enterprise user batch upload).',
      severity: 'warning',
    },
  ];

  const initialSlowQueries: QueryPerf[] = [
    {
      hash: 'db48a28f',
      avgTime: 420,
      maxTime: 1420,
      callCount: 124,
      table: 'DocumentAnalysis',
      queryText:
        'SELECT * FROM "DocumentAnalysis" WHERE "userId" = $1 AND "status" = $2 ORDER BY "createdAt" DESC LIMIT 50 OFFSET 100;',
    },
    {
      hash: 'a12ef880',
      avgTime: 230,
      maxTime: 890,
      callCount: 382,
      table: 'User',
      queryText:
        'SELECT u.*, s."planName", count(d.id) FROM "User" u LEFT JOIN "Subscription" s ON u."subscriptionId" = s.id LEFT JOIN "Document" d ON d."userId" = u.id GROUP BY u.id, s.id;',
    },
    {
      hash: 'e89cba41',
      avgTime: 145,
      maxTime: 480,
      callCount: 2045,
      table: 'SentenceScore',
      queryText: 'SELECT * FROM "SentenceScore" WHERE "documentId" = ANY($1) AND "score" > $2;',
    },
    {
      hash: 'c561aaef',
      avgTime: 95,
      maxTime: 340,
      callCount: 892,
      table: 'AuditLog',
      queryText:
        'INSERT INTO "AuditLog" ("action", "metadata", "userId", "createdAt") VALUES ($1, $2, $3, NOW());',
    },
  ];

  const initialTableStats: TableStat[] = [
    {
      table: 'SentenceScore',
      rowCount: 1420389,
      size: '284 MB',
      indexSize: '112 MB',
      lastVacuum: '3 hours ago',
      sizeBytes: 284000000,
    },
    {
      table: 'DocumentAnalysis',
      rowCount: 124892,
      size: '148 MB',
      indexSize: '48 MB',
      lastVacuum: '5 hours ago',
      sizeBytes: 148000000,
    },
    {
      table: 'AuditLog',
      rowCount: 892401,
      size: '92 MB',
      indexSize: '36 MB',
      lastVacuum: '12 hours ago',
      sizeBytes: 92000000,
    },
    {
      table: 'User',
      rowCount: 14203,
      size: '8.4 MB',
      indexSize: '3.2 MB',
      lastVacuum: '1 day ago',
      sizeBytes: 8400000,
    },
    {
      table: 'Subscription',
      rowCount: 1847,
      size: '1.2 MB',
      indexSize: '450 KB',
      lastVacuum: '2 days ago',
      sizeBytes: 1200000,
    },
  ];

  const initialMigrations: Migration[] = [
    {
      name: '20260515124021_add_sentence_cache',
      appliedAt: '2026-05-15 14:02:11',
      duration: '2.1s',
      status: 'success',
    },
    {
      name: '20260601091544_upgrade_user_tiers',
      appliedAt: '2026-06-01 09:18:23',
      duration: '14.8s',
      status: 'success',
    },
    {
      name: '20260607101500_create_audit_indexes',
      appliedAt: '2026-06-07 10:15:22',
      duration: '45.1s',
      status: 'success',
    },
  ];

  const initialRedisNamespaces: RedisNamespace[] = [
    { prefix: 'ratelimit:*', keyCount: 14203, avgTtl: '58s', memory: '2.1 MB' },
    { prefix: 'session:*', keyCount: 1847, avgTtl: '6h', memory: '892 KB' },
    { prefix: 'cache:*', keyCount: 423, avgTtl: '4m', memory: '1.4 MB' },
    { prefix: 'queue:*', keyCount: 8291, avgTtl: 'none', memory: '3.2 MB' },
  ];

  const initialRedisKeys: RedisKey[] = [
    { pattern: 'ratelimit:192.168.1.1', memory: '150 B', ttl: '22s', type: 'string' },
    { pattern: 'session:usr_abc123', memory: '4.2 KB', ttl: '5h 42m', type: 'hash' },
    { pattern: 'cache:nlp:perplexity:hash898', memory: '12.4 KB', ttl: '3m 12s', type: 'string' },
    { pattern: 'queue:free:jobs', memory: '240 KB', ttl: 'none', type: 'list' },
    { pattern: 'queue:enterprise:active', memory: '1.2 KB', ttl: 'none', type: 'zset' },
  ];

  const initialServicesHealth: ServiceHealth[] = servicesList.map((name) => {
    let status: ServiceHealth['status'] = 'HEALTHY';
    if (name === 'OpenAI API') status = 'DEGRADED';

    let latency = 85;
    if (name === 'OpenAI API') latency = 2300;
    else if (name === 'NLP Microservice') latency = 320;
    else if (name === 'PostgreSQL') latency = 8;
    else if (name === 'Redis') latency = 1;

    return {
      name,
      status,
      uptime: name === 'OpenAI API' ? '99.85%' : '99.99%',
      latency,
      lastChecked: '5s ago',
      endpoint: mockServicesEndpoints[name] || 'https://unknown.com',
      uptimeHistory: generateUptimeHistory(),
    };
  });

  const initialLatencyHeatmap: Record<string, number[]> = {};
  servicesList.forEach((s) => {
    const list: number[] = [];
    const base = s === 'OpenAI API' ? 800 : s === 'NLP Microservice' ? 200 : 50;
    const varRange = s === 'OpenAI API' ? 600 : s === 'NLP Microservice' ? 100 : 15;
    for (let i = 0; i < 24; i++) {
      list.push(Math.round(base + Math.random() * varRange));
    }
    initialLatencyHeatmap[s] = list;
  });

  const initialLogs: LogLine[] = [
    {
      id: 'start-1',
      timestamp: new Date(now.getTime() - 5000).toISOString(),
      level: 'INFO',
      service: 'system',
      message: 'VeriText Ops Center starting up...',
    },
    {
      id: 'start-2',
      timestamp: new Date(now.getTime() - 4000).toISOString(),
      level: 'INFO',
      service: 'system',
      message: 'API Server running on port 3001 (http://localhost:3001)',
    },
    {
      id: 'start-3',
      timestamp: new Date(now.getTime() - 3500).toISOString(),
      level: 'INFO',
      service: 'system',
      message: 'Queue Monitor listening on port 6379 (redis://localhost:6379)',
    },
    {
      id: 'start-4',
      timestamp: new Date(now.getTime() - 3000).toISOString(),
      level: 'INFO',
      service: 'system',
      message: 'NLP Microservice listening on port 8000 (http://localhost:8000)',
    },
    {
      id: 'start-5',
      timestamp: new Date(now.getTime() - 2500).toISOString(),
      level: 'INFO',
      service: 'system',
      message: 'PostgreSQL database connected (postgresql://localhost:5432/veritext)',
    },
  ];
  for (let i = 0; i < 20; i++) {
    initialLogs.push(generateRandomLog());
  }

  const initialRedisCommandsTimeline = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 1000);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    initialRedisCommandsTimeline.push({
      time: timeStr,
      GET: Math.round(1800 + Math.random() * 400),
      SET: Math.round(300 + Math.random() * 100),
      DEL: Math.round(80 + Math.random() * 30),
    });
  }

  const initialThroughputTimeline = [];
  for (let i = 60; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 1000);
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    initialThroughputTimeline.push({
      time: timeStr,
      enterprise: Math.round(12 + Math.random() * 8),
      business: Math.round(8 + Math.random() * 5),
      pro: Math.round(4 + Math.random() * 3),
      free: Math.round(1 + Math.random() * 1),
    });
  }

  return {
    environment: 'Production',
    systemStatus: 'Degraded Performance',
    lastUpdated: now,
    isSidebarCollapsed: false,
    isLiveLogsStreaming: true,
    refreshCounter: 0,

    metrics: {
      requestsPerMin: {
        label: 'Requests/min',
        value: 1247,
        unit: '',
        trend: { direction: 'up', value: '12%', positive: true },
        status: 'healthy',
        sparkline: [1020, 1140, 1201, 1198, 1250, 1221, 1247],
      },
      p95Latency: {
        label: 'P95 Latency',
        value: 142,
        unit: 'ms',
        trend: { direction: 'down', value: '8ms', positive: true },
        status: 'healthy',
        sparkline: [168, 154, 150, 149, 146, 141, 142],
      },
      errorRate: {
        label: 'Error Rate',
        value: 0.23,
        unit: '%',
        trend: { direction: 'down', value: '0.04%', positive: true },
        status: 'healthy',
        sparkline: [0.34, 0.28, 0.21, 0.29, 0.22, 0.24, 0.23],
      },
      activeJobs: {
        label: 'Active Jobs',
        value: 47,
        unit: '',
        trend: { direction: 'up', value: '5', positive: true },
        status: 'healthy',
        sparkline: [38, 41, 40, 44, 42, 45, 47],
      },
      dbConnections: {
        label: 'DB Connections',
        value: 23,
        unit: '',
        trend: { direction: 'stable', value: 'stable', positive: true },
        status: 'healthy',
        sparkline: [21, 23, 22, 23, 23, 23, 23],
      },
      cpuUsage: {
        label: 'CPU Usage',
        value: 34,
        unit: '%',
        trend: { direction: 'up', value: '2%', positive: false },
        status: 'healthy',
        sparkline: [28, 30, 31, 35, 33, 32, 34],
      },
      memoryUsage: {
        label: 'Memory Usage',
        value: 61,
        unit: '%',
        trend: { direction: 'stable', value: 'stable', positive: true },
        status: 'healthy',
        sparkline: [60, 61, 61, 61, 61, 61, 61],
      },
      redisHitRate: {
        label: 'Redis Hit Rate',
        value: 94.7,
        unit: '%',
        trend: { direction: 'up', value: '0.2%', positive: true },
        status: 'healthy',
        sparkline: [94.1, 94.3, 94.5, 94.2, 94.6, 94.7, 94.7],
      },
    },

    requestsTimeline: generateTimeSeries(24, 1100, 300),
    errorsTimeline: generateTimeSeries(24, 0.22, 0.1),

    dbPool: {
      total: 100,
      active: 23,
      idle: 77,
      waiting: 0,
      avgAcquireTime: 1.4,
    },
    slowQueries: initialSlowQueries,
    tableStats: initialTableStats,
    migrations: initialMigrations,

    redisMemory: {
      used: 7759462,
      max: 67108864,
      evicted: 0,
      hits: 429012,
      misses: 24001,
    },
    redisNamespaces: initialRedisNamespaces,
    redisKeys: initialRedisKeys,
    redisCommandsTimeline: initialRedisCommandsTimeline,

    queues: initialQueues,
    activeJobsList: initialActiveJobs,
    failedJobsList: initialFailedJobs,
    queueThroughputTimeline: initialThroughputTimeline,

    workers: initialWorkers,
    recentErrors: initialErrorsList,
    logs: initialLogs,
    logLevelFilter: 'ALL',
    logServiceFilter: 'ALL',
    logSearchQuery: '',

    timelineEvents: initialTimelineEvents,
    alerts: initialAlerts,
    alertRules: initialAlertRules,

    servicesHealth: initialServicesHealth,
    diskUsage: 42,
    cpuTimeline: Array.from({ length: 30 }, () => 30 + Math.random() * 15),
    memTimeline: Array.from({ length: 30 }, () => 58 + Math.random() * 4),
    diskTimeline: Array.from({ length: 30 }, () => 42),
    latencyHeatmap: initialLatencyHeatmap,

    setEnvironment: (environment) => set({ environment }),
    setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
    setLiveLogsStreaming: (isLiveLogsStreaming) => set({ isLiveLogsStreaming }),
    setLogLevelFilter: (logLevelFilter) => set({ logLevelFilter }),
    setLogServiceFilter: (logServiceFilter) => set({ logServiceFilter }),
    setLogSearchQuery: (logSearchQuery) => set({ logSearchQuery }),

    acknowledgeAlert: (alertId, user = 'admin@veritext.com') =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId ? { ...a, status: 'ACKNOWLEDGED', acknowledgedBy: user } : a,
        ),
      })),

    resolveAlert: (alertId, user = 'admin@veritext.com') =>
      set((state) => ({
        alerts: state.alerts.map((a) =>
          a.id === alertId
            ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString(), resolvedBy: user }
            : a,
        ),
      })),

    retryFailedJob: (jobId) =>
      set((state) => {
        const target = state.failedJobsList.find((j) => j.jobId === jobId);
        if (!target) return {};

        const newActiveJob: JobRow = {
          jobId: target.jobId,
          queue: target.queue,
          userId: 'retry_usr',
          type: 'TEXT',
          wordCount: 1500,
          progress: 0,
          startedAt: new Date().toISOString(),
          duration: '0s',
          stage: 'Re-initializing job...',
        };
        return {
          failedJobsList: state.failedJobsList.filter((j) => j.jobId !== jobId),
          activeJobsList: [...state.activeJobsList, newActiveJob],
        };
      }),

    deleteFailedJob: (jobId) =>
      set((state) => ({
        failedJobsList: state.failedJobsList.filter((j) => j.jobId !== jobId),
      })),

    retryAllFailedJobs: () =>
      set((state) => {
        const newActiveJobs = state.failedJobsList.map((target) => ({
          jobId: target.jobId,
          queue: target.queue,
          userId: 'retry_usr',
          type: 'TEXT' as const,
          wordCount: 1000,
          progress: 0,
          startedAt: new Date().toISOString(),
          duration: '0s',
          stage: 'Re-initializing job...',
        }));
        return {
          failedJobsList: [],
          activeJobsList: [...state.activeJobsList, ...newActiveJobs],
        };
      }),

    deleteAllFailedJobs: () =>
      set({
        failedJobsList: [],
      }),

    cancelActiveJob: (jobId) =>
      set((state) => ({
        activeJobsList: state.activeJobsList.filter((j) => j.jobId !== jobId),
      })),

    clearLogs: () => set({ logs: [] }),

    manualRefresh: () =>
      set((state) => ({
        refreshCounter: state.refreshCounter + 1,
        lastUpdated: new Date(),
      })),

    tickMetrics: () =>
      set((state) => {
        const newRpmVal = Math.round(
          state.metrics.requestsPerMin.value + (Math.random() - 0.5) * 40,
        );
        const newLatVal = Math.round(state.metrics.p95Latency.value + (Math.random() - 0.5) * 10);
        const newErrRate = Math.max(
          0,
          Math.round((state.metrics.errorRate.value + (Math.random() - 0.5) * 0.05) * 100) / 100,
        );
        const newCpuVal = Math.max(
          10,
          Math.min(100, Math.round(state.metrics.cpuUsage.value + (Math.random() - 0.5) * 6)),
        );
        const newMemVal = Math.max(
          10,
          Math.min(100, Math.round(state.metrics.memoryUsage.value + (Math.random() - 0.5) * 2)),
        );

        const updateCardSparkline = (card: MetricCardValue, newVal: number) => {
          const spark = [...card.sparkline.slice(1), newVal];
          const trendDir = newVal > card.value ? ('up' as const) : ('down' as const);
          const diffStr = Math.abs(newVal - card.value).toFixed(
            card.label.includes('Rate') ? 2 : 0,
          );
          return {
            ...card,
            value: newVal,
            trend: {
              direction: trendDir,
              value: `${diffStr}${card.unit || ''}`,
              positive:
                card.label.includes('Latency') || card.label.includes('Rate')
                  ? trendDir === 'down'
                  : trendDir === 'up',
            },
            sparkline: spark,
          };
        };

        return {
          lastUpdated: new Date(),
          metrics: {
            ...state.metrics,
            requestsPerMin: updateCardSparkline(state.metrics.requestsPerMin, newRpmVal),
            p95Latency: updateCardSparkline(state.metrics.p95Latency, newLatVal),
            errorRate: updateCardSparkline(state.metrics.errorRate, newErrRate),
            cpuUsage: updateCardSparkline(state.metrics.cpuUsage, newCpuVal),
            memoryUsage: updateCardSparkline(state.metrics.memoryUsage, newMemVal),
          },

          cpuTimeline: [...state.cpuTimeline.slice(1), newCpuVal],
          memTimeline: [...state.memTimeline.slice(1), newMemVal],

          redisCommandsTimeline: [
            ...state.redisCommandsTimeline.slice(1),
            {
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }),
              GET: Math.round(1800 + Math.random() * 400),
              SET: Math.round(300 + Math.random() * 100),
              DEL: Math.round(80 + Math.random() * 30),
            },
          ],
        };
      }),

    tickQueues: () =>
      set((state) => {
        const logsToPush: LogLine[] = [];
        const newActiveJobsList = state.activeJobsList
          .map((job) => {
            const nextProgress = job.progress + Math.round(Math.random() * 15 + 5);
            const durationSec = parseInt(job.duration) || 0;
            const newDuration = `${durationSec + 5}s`;

            if (nextProgress >= 100) {
              const finishedTime = new Date().toISOString();

              logsToPush.push({
                id: Math.random().toString(),
                timestamp: finishedTime,
                level: 'INFO',
                service: 'queueprocessor',
                requestId: `req-${job.jobId.split('_')[2]}`,
                message: `Job ${job.jobId} completed successfully. Processed ${job.wordCount} words.`,
                meta: { jobId: job.jobId, duration: newDuration },
              });
              return null;
            }

            let newStage = job.stage;
            if (nextProgress > 80) newStage = 'Finalizing report...';
            else if (nextProgress > 50) newStage = 'Computing perplexity metrics...';
            else if (nextProgress > 30) newStage = 'Running stylometry checks...';

            return {
              ...job,
              progress: nextProgress,
              duration: newDuration,
              stage: newStage,
            };
          })
          .filter(Boolean) as JobRow[];

        const updatedQueues = state.queues.map((q) => {
          let activeDiff = 0;
          let waitingDiff = 0;
          let completedDiff = 0;

          const completedJobsThisTick = state.activeJobsList.filter(
            (j) => j.queue === q.name && !newActiveJobsList.some((n) => n.jobId === j.jobId),
          ).length;

          completedDiff += completedJobsThisTick;
          activeDiff -= completedJobsThisTick;

          if (q.waiting > 0 && q.active + activeDiff < q.concurrency && Math.random() > 0.4) {
            const jobsToStart = Math.min(q.waiting, q.concurrency - (q.active + activeDiff));
            waitingDiff -= jobsToStart;
            activeDiff += jobsToStart;

            for (let i = 0; i < jobsToStart; i++) {
              const rId = Math.random().toString(36).substring(2, 7);
              newActiveJobsList.push({
                jobId: `job_${q.name.substring(0, 3)}_${rId}`,
                queue: q.name,
                userId: `usr_${Math.floor(Math.random() * 900 + 100)}`,
                type: Math.random() > 0.7 ? 'BATCH' : Math.random() > 0.4 ? 'FILE' : 'TEXT',
                wordCount: Math.round(500 + Math.random() * 5000),
                progress: 0,
                startedAt: new Date().toISOString(),
                duration: '0s',
                stage: 'Pending worker assignment...',
              });
            }
          }

          if (Math.random() > 0.3) {
            waitingDiff += Math.round(Math.random() * 3);
          }

          const newActiveVal = Math.max(0, q.active + activeDiff);
          const newWaitingVal = Math.max(0, q.waiting + waitingDiff);
          const newCompletedVal = q.completed + completedDiff;

          return {
            ...q,
            active: newActiveVal,
            waiting: newWaitingVal,
            completed: newCompletedVal,
            throughput: Math.max(
              0.5,
              Math.round((q.throughput + (Math.random() - 0.5) * 1) * 10) / 10,
            ),
            sparkline: [...q.sparkline.slice(1), newActiveVal + newWaitingVal],
          };
        });

        const totalActiveJobsCount = newActiveJobsList.length;

        const queueThroughputTimeline = [
          ...state.queueThroughputTimeline.slice(1),
          {
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            enterprise: updatedQueues[0].throughput,
            business: updatedQueues[1].throughput,
            pro: updatedQueues[2].throughput,
            free: updatedQueues[3].throughput,
          },
        ];

        return {
          activeJobsList: newActiveJobsList,
          queues: updatedQueues,
          queueThroughputTimeline,
          logs: [...logsToPush, ...state.logs].slice(0, 500),
          metrics: {
            ...state.metrics,
            activeJobs: {
              ...state.metrics.activeJobs,
              value: totalActiveJobsCount,
            },
          },
        };
      }),

    tickLogs: () =>
      set((state) => {
        if (!state.isLiveLogsStreaming) return {};

        const newLogsCount = Math.floor(Math.random() * 3) + 1;
        const newLogsList: LogLine[] = [];
        for (let i = 0; i < newLogsCount; i++) {
          newLogsList.push(generateRandomLog());
        }

        const newErrors = [...state.recentErrors];
        newLogsList.forEach((l) => {
          if (l.level === 'ERROR') {
            newErrors.unshift({
              id: Math.random().toString(),
              timestamp: l.timestamp,
              code: '500',
              endpoint: typeof l.meta?.api === 'string' ? l.meta.api : 'POST /v1/detect',
              severity: 'HIGH',
              message: l.message,
              stackTrace:
                'Error: An internal service error occurred.\n    at Service.execute (' +
                l.service +
                '.ts:42)',
            });
          }
        });

        return {
          logs: [...newLogsList, ...state.logs].slice(0, 500),
          recentErrors: newErrors.slice(0, 20),
        };
      }),

    tickHealth: () =>
      set((state) => {
        const updatedServices = state.servicesHealth.map((s) => {
          const latChange = Math.round(
            (Math.random() - 0.5) * (s.name === 'OpenAI API' ? 300 : 20),
          );
          const newLat = Math.max(1, s.latency + latChange);
          let newStatus = s.status;

          if (Math.random() > 0.98) {
            newStatus = Math.random() > 0.8 ? 'DEGRADED' : 'HEALTHY';
          }

          const newUptimeHistory = [...s.uptimeHistory.slice(1), newStatus === 'HEALTHY'];

          return {
            ...s,
            latency: newLat,
            status: newStatus,
            uptimeHistory: newUptimeHistory,
            lastChecked: 'Just now',
          };
        });

        const updatedHeatmap: Record<string, number[]> = {};
        servicesList.forEach((s) => {
          const currentList = state.latencyHeatmap[s] || [];
          const nextVal = Math.round(
            (updatedServices.find((ser) => ser.name === s)?.latency || 50) *
              (0.8 + Math.random() * 0.4),
          );
          updatedHeatmap[s] = [...currentList.slice(1), nextVal];
        });

        return {
          servicesHealth: updatedServices,
          latencyHeatmap: updatedHeatmap,
        };
      }),
  };
});
