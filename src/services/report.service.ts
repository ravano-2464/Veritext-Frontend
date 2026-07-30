import { apiClient } from '@/lib/api/client';

export const reportService = {
  async download(
    accessToken: string,
    detectionId: string,
    format: 'pdf' | 'docx' | 'csv' | 'json',
  ): Promise<void> {
    const response = await apiClient.get<Blob>(`/reports/${detectionId}/export/${format}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const disposition = response.headers['content-disposition'];
    const fileName =
      typeof disposition === 'string' ? disposition.match(/filename="([^"]+)"/)?.[1] : null;
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = fileName ?? `veritext-report.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  },
};
