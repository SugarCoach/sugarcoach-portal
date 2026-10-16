import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ToastData, ToastVariant } from "@/contexts/toast-context";

const STYLES: Record<ToastVariant, { box: string; icon: string }> = {
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "text-emerald-600",
  },
  error: { box: "border-red-200 bg-red-50 text-red-900", icon: "text-red-600" },
  warning: {
    box: "border-amber-200 bg-amber-50 text-amber-900",
    icon: "text-amber-600",
  },
  info: { box: "border-sky-200 bg-sky-50 text-sky-900", icon: "text-sky-600" },
};

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ICONS: Record<ToastVariant, ReactNode> = {
  success: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </Svg>
  ),
  error: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </Svg>
  ),
  warning: (
    <Svg>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  ),
  info: (
    <Svg>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </Svg>
  ),
};

const EXIT_MS = 250;

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, variant, title, message, duration } = toast;
  const [paused, setPaused] = useState(false);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const closing = useRef(false);
  const exitTimer = useRef<number | undefined>(undefined);
  const styles = STYLES[variant];

  // Enter: mount in the "hidden" state, then flip on the next painted frame
  // so the browser has a starting point to transition from
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  // Exit: play the leave transition, then actually remove the toast
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setLeaving(true);
    exitTimer.current = window.setTimeout(() => onDismiss(id), EXIT_MS);
  }, [id, onDismiss]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  // Auto-dismiss; hovering or focusing the toast pauses it
  useEffect(() => {
    if (duration <= 0 || paused || leaving) return;
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [duration, paused, leaving, close]);

  const visible = entered && !leaving;

  return (
    <div
      // Errors and warnings interrupt screen readers, the rest are announced politely
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-out motion-reduce:transition-none sm:w-96 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
      } ${styles.box}`}
    >
      <span className={`mt-0.5 shrink-0 ${styles.icon}`}>{ICONS[variant]}</span>

      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p
          className={`break-words text-sm ${title ? "mt-0.5 opacity-90" : ""}`}
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label="Cerrar notificación"
        className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
