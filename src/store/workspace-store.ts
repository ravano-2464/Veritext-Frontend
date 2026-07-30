import { create } from 'zustand';

interface WorkspaceState {
  organizationId: string | null;
  setOrganizationId: (organizationId: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  organizationId: null,
  setOrganizationId: (organizationId) => set({ organizationId }),
}));
