import { create } from "zustand";

interface Toast {
  id: number;
  title: string;
  body: string;
  icon?: string;
  link?: string;
}

interface ToastState {
  toast: Toast | null;
  showToast: (params: {
    title: string;
    body: string;
    icon?: string;
    link?: string;
  }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (params) => {
    const id = Date.now();
    set({ toast: { id, ...params } });

    // 4초 후 자동으로 토스트 닫기
    setTimeout(() => {
      set((state) => {
        if (state.toast?.id === id) {
          return { toast: null };
        }
        return state;
      });
    }, 4000);
  },
  hideToast: () => set({ toast: null }),
}));
