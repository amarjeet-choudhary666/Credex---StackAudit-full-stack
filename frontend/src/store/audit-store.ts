import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ToolSelection {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditState {
  // Form data
  teamSize: number;
  primaryUseCase: string;
  selectedTools: ToolSelection[];
  
  // UI state
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  
  // Results
  auditResult: any | null;
  
  // Actions
  setTeamSize: (size: number) => void;
  setPrimaryUseCase: (useCase: string) => void;
  addTool: (tool: ToolSelection) => void;
  updateTool: (index: number, updates: Partial<ToolSelection>) => void;
  removeTool: (index: number) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuditResult: (result: any) => void;
  reset: () => void;
}

const initialState = {
  teamSize: 1,
  primaryUseCase: "",
  selectedTools: [],
  currentStep: 1,
  isLoading: false,
  error: null,
  auditResult: null,
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTeamSize: (size) => set({ teamSize: size }),
      
      setPrimaryUseCase: (useCase) => set({ primaryUseCase: useCase }),
      
      addTool: (tool) =>
        set((state) => ({
          selectedTools: [...state.selectedTools, tool],
        })),
      
      updateTool: (index, updates) =>
        set((state) => ({
          selectedTools: state.selectedTools.map((tool, i) =>
            i === index ? { ...tool, ...updates } : tool
          ),
        })),
      
      removeTool: (index) =>
        set((state) => ({
          selectedTools: state.selectedTools.filter((_, i) => i !== index),
        })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setAuditResult: (result) => set({ auditResult: result }),
      
      reset: () => set(initialState),
    }),
    {
      name: "audit-storage",
      partialize: (state) => ({
        teamSize: state.teamSize,
        primaryUseCase: state.primaryUseCase,
        selectedTools: state.selectedTools,
        currentStep: state.currentStep,
        auditResult: state.auditResult,
      }),
    }
  )
);