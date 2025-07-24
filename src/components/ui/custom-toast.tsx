"use client";

import type React from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
  Eye,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseToastProps {
  title: string;
  description?: string;
  onClose?: () => void;
  toastId?: string | number;
}

interface ActionToastProps extends BaseToastProps {
  onAction?: () => void;
  actionLabel?: string;
  onUndo?: () => void;
  undoLabel?: string;
}

// Base toast container
const ToastContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-background text-foreground w-full rounded-lg border shadow-lg",
      "sm:w-[var(--width)] sm:max-w-[420px]",
      "animate-in slide-in-from-bottom-2 duration-300",
      className
    )}
  >
    {children}
  </div>
);

// Success Toast Component
export const SuccessToast = ({
  title,
  description,
  onClose,
  toastId,
}: BaseToastProps) => (
  <ToastContainer className="border-emerald-200 dark:border-emerald-800">
    <div className="flex items-start gap-3 p-4">
      <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
        onClick={() => {
          onClose?.();
          if (toastId) toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </ToastContainer>
);

// Error Toast Component
export const ErrorToast = ({
  title,
  description,
  onClose,
  toastId,
}: BaseToastProps) => (
  <ToastContainer className="border-red-200 dark:border-red-800">
    <div className="flex items-start gap-3 p-4">
      <XCircle className="mt-0.5 h-5 w-5 text-red-500 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
        onClick={() => {
          onClose?.();
          if (toastId) toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </ToastContainer>
);

// Info Toast Component
export const InfoToast = ({
  title,
  description,
  onClose,
  toastId,
}: BaseToastProps) => (
  <ToastContainer className="border-blue-200 dark:border-blue-800">
    <div className="flex items-start gap-3 p-4">
      <Info className="mt-0.5 h-5 w-5 text-blue-500 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20"
        onClick={() => {
          onClose?.();
          if (toastId) toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </ToastContainer>
);

// Warning Toast Component
export const WarningToast = ({
  title,
  description,
  onClose,
  toastId,
}: BaseToastProps) => (
  <ToastContainer className="border-amber-200 dark:border-amber-800">
    <div className="flex items-start gap-3 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500 shrink-0" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/20"
        onClick={() => {
          onClose?.();
          if (toastId) toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </ToastContainer>
);

// Action Toast Component (with action buttons)
export const ActionToast = ({
  title,
  description,
  onAction,
  actionLabel = "View",
  onUndo,
  undoLabel = "Undo",
  onClose,
  toastId,
}: ActionToastProps) => (
  <ToastContainer className="border-emerald-200 dark:border-emerald-800">
    <div className="flex items-start gap-3 p-4">
      <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onAction && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-medium hover:underline"
              onClick={onAction}
            >
              <Eye className="mr-1 h-3 w-3" />
              {actionLabel}
            </Button>
          )}
          {onUndo && (
            <>
              <span className="text-muted-foreground text-xs">·</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-medium hover:underline"
                onClick={onUndo}
              >
                <Undo2 className="mr-1 h-3 w-3" />
                {undoLabel}
              </Button>
            </>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
        onClick={() => {
          onClose?.();
          if (toastId) toast.dismiss(toastId);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  </ToastContainer>
);

// Custom toast helper functions
export const customToast = {
  success: (title: string, description?: string) => {
    return toast.custom((t) => (
      <SuccessToast title={title} description={description} toastId={t} />
    ));
  },

  error: (title: string, description?: string) => {
    return toast.custom((t) => (
      <ErrorToast title={title} description={description} toastId={t} />
    ));
  },

  info: (title: string, description?: string) => {
    return toast.custom((t) => (
      <InfoToast title={title} description={description} toastId={t} />
    ));
  },

  warning: (title: string, description?: string) => {
    return toast.custom((t) => (
      <WarningToast title={title} description={description} toastId={t} />
    ));
  },

  action: (
    title: string,
    options?: {
      description?: string;
      onAction?: () => void;
      actionLabel?: string;
      onUndo?: () => void;
      undoLabel?: string;
    }
  ) => {
    return toast.custom((t) => (
      <ActionToast
        title={title}
        description={options?.description}
        onAction={options?.onAction}
        actionLabel={options?.actionLabel}
        onUndo={options?.onUndo}
        undoLabel={options?.undoLabel}
        toastId={t}
      />
    ));
  },
};
