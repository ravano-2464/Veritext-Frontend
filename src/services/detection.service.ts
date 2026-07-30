import { apiRequest } from '@/lib/api/client';
import {
  DetectionRecord,
  HistoryResponse,
  HumanizerResponse,
  JobStatus,
  QueueResponse,
} from '@/lib/types/api';
import { DetectionTextValues, HumanizeTextValues } from '@/lib/validators/detection.schemas';

export const detectionService = {
  detectText(accessToken: string, payload: DetectionTextValues): Promise<DetectionRecord> {
    return apiRequest<DetectionRecord>('/detections/text', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },

  queueText(accessToken: string, payload: DetectionTextValues): Promise<QueueResponse> {
    return apiRequest<QueueResponse>('/detections/queue', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },

  humanizeText(accessToken: string, payload: HumanizeTextValues): Promise<HumanizerResponse> {
    return apiRequest<HumanizerResponse>('/detections/humanize', {
      method: 'POST',
      token: accessToken,
      body: JSON.stringify(payload),
    });
  },

  uploadTextFile(
    accessToken: string,
    file: File,
    options?: { title?: string; language?: string },
  ): Promise<DetectionRecord> {
    const form = new FormData();
    form.append('file', file);

    if (options?.title) {
      form.append('title', options.title);
    }

    if (options?.language) {
      form.append('language', options.language);
    }

    return apiRequest<DetectionRecord>('/detections/upload', {
      method: 'POST',
      token: accessToken,
      body: form,
    });
  },

  history(accessToken: string, page = 1, limit = 10): Promise<HistoryResponse> {
    return apiRequest<HistoryResponse>(`/detections/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      token: accessToken,
    });
  },

  byId(accessToken: string, detectionId: string): Promise<DetectionRecord> {
    return apiRequest<DetectionRecord>(`/detections/${detectionId}`, {
      method: 'GET',
      token: accessToken,
    });
  },

  jobStatus(accessToken: string, jobId: string): Promise<JobStatus> {
    return apiRequest<JobStatus>(`/detections/jobs/${jobId}`, {
      method: 'GET',
      token: accessToken,
    });
  },
};
