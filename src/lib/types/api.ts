export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  locale: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface FindAccountResponse {
  found: boolean;
  account: {
    email: string;
    fullName: string;
    provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
    canResetPassword: boolean;
  } | null;
}

export interface ForgotPasswordResponse {
  ok: true;
  resetToken: string;
}

export interface SentenceAnalysis {
  id?: string;
  sentenceIndex: number;
  sentence: string;
  aiProbability: number;
  confidence: number;
  perplexity: number;
  burstiness: number;
  stylometry: number;
  semantic: number;
  entropy: number;
  complexity: number;
  tokenProbability: number;
  readability: number;
  isSuspicious?: boolean;
}

export interface ModelVerification {
  id: string;
  provider: 'OPENAI' | 'ANTHROPIC' | 'GOOGLE' | 'META' | 'LOCAL' | 'ENSEMBLE';
  modelName: string;
  aiProbability: number;
  confidence: number;
  latencyMs: number;
  createdAt: string;
}

export interface DetectionRecord {
  id: string;
  userId: string;
  title: string | null;
  language: string;
  sourceType: 'TEXT' | 'FILE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  content: string;
  fileName: string | null;
  fileMimeType: string | null;
  fileSize: number | null;
  overallAiProbability: number;
  confidenceScore: number;
  humanLikelihoodScore: number;
  perplexityScore: number;
  burstinessScore: number;
  stylometryScore: number;
  semanticScore: number;
  entropyScore: number;
  complexityScore: number;
  tokenProbabilityScore: number;
  readabilityScore: number;
  aiFingerprint: 'CHATGPT' | 'CLAUDE' | 'GEMINI' | 'LLAMA' | 'MIXED' | 'UNKNOWN';
  fingerprintConfidence: number;
  processingLatencyMs: number | null;
  suspiciousSentences: number[];
  createdAt: string;
  updatedAt: string;
  sentenceAnalyses: SentenceAnalysis[];
  modelVerifications: ModelVerification[];
}

export interface HistoryResponse {
  page: number;
  limit: number;
  count: number;
  items: DetectionRecord[];
}

export interface QueueResponse {
  detectionId: string;
  jobId?: string;
  status: DetectionRecord['status'];
}

export interface JobStatus {
  jobId?: string;
  state: string;
  attemptsMade: number;
  failedReason: string | null;
  returnValue: unknown;
}

export interface DetectionSnapshot {
  overallAiProbability: number;
  confidenceScore: number;
  humanLikelihoodScore: number;
  perplexityScore: number;
  burstinessScore: number;
  stylometryScore: number;
  semanticScore: number;
  entropyScore: number;
  complexityScore: number;
  suspiciousSentenceIndexes: number[];
  sentenceAnalysis: Array<{
    sentenceIndex: number;
    sentence: string;
    perplexity: number;
    burstiness: number;
    stylometry: number;
    semantic: number;
    entropy: number;
    complexity: number;
    tokenProbability: number;
    readability: number;
    aiProbability: number;
    confidence: number;
  }>;
}

export interface HumanizerResponse {
  originalText: string;
  humanizedText: string;
  language: string;
  intensity: number;
  style: 'balanced' | 'casual' | 'professional';
  targetedSentenceCount: number;
  rewriteStats: {
    targetedSentences: number;
    rewrittenSentences: number;
    phraseReplacements: number;
    contractionsApplied: number;
    sentenceSplits: number;
  };
  before: DetectionSnapshot;
  after: DetectionSnapshot;
  improvement: {
    aiProbabilityDelta: number;
    suspiciousSentenceDelta: number;
    confidenceDelta: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  planTier: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  createdAt: string;
  updatedAt: string;
  subscription?: Subscription | null;
}

export interface Subscription {
  id: string;
  organizationId: string;
  tier: Organization['planTier'];
  status: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE';
  seats: number;
  monthlyDetectionLimit: number;
}

export interface CreatedApiKey {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  scopes: string[];
  expiresAt: string | null;
  rateLimitPerMinute: number;
}

export interface ApiKeyRecord {
  id: string;
  organizationId: string | null;
  userId: string;
  name: string;
  keyPrefix: string;
  status: 'ACTIVE' | 'REVOKED';
  scopes: string[];
  rateLimitPerMinute: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsResponse {
  totals: {
    detections: number;
    completed: number;
    failed: number;
    completionRate: number;
  };
  scores: {
    averageAiProbability: number;
    averageConfidence: number;
    averageLatencyMs: number;
    averageReadability: number;
  };
  usage: Array<{
    id: string;
    type: string;
    quantity: number;
    createdAt: string;
    apiKeyName?: string;
    detectionTitle?: string | null;
    overallAiProbability?: number;
  }>;
  fingerprints: Array<{ style: string; count: number }>;
  trend: Array<{
    date: string;
    detections: number;
    completed: number;
    aiProbability: number;
  }>;
  recentDetections: Array<{
    id: string;
    title: string | null;
    language: string;
    status: DetectionRecord['status'];
    overallAiProbability: number;
    confidenceScore: number;
    aiFingerprint: DetectionRecord['aiFingerprint'];
    createdAt: string;
  }>;
}

export interface Plan {
  tier: Organization['planTier'];
  monthlyDetectionLimit: number;
  seats: number;
  priceMonthlyUsd: number | null;
  features: string[];
}

export interface CheckoutResponse {
  mode: 'development' | 'stripe';
  url: string | null;
  id?: string;
  message?: string;
}
