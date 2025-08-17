// File: src/hooks/useToast.ts
// Toast system for recruitment actions with undo functionality

import { toast as sonnerToast } from "sonner";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: ToastAction;
  duration?: number;
  type?: "success" | "error" | "info" | "warning";
}

export const useToast = () => {
  const toast = (options: ToastOptions) => {
    const { title, description, action, duration = 4000, type = "info" } = options;
    
    const message = title ? (description ? `${title}: ${description}` : title) : description || "";

    switch (type) {
      case "success":
        return sonnerToast.success(message, {
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
      case "error":
        return sonnerToast.error(message, {
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
      case "warning":
        return sonnerToast.warning(message, {
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
      default:
        return sonnerToast.info(message, {
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
    }
  };

  return { toast };
};