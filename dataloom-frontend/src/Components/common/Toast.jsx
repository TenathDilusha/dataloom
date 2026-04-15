import { useEffect } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const typeConfig = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-700",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    textColor: "text-red-700",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
  },
  info: {
    icon: Info,
    bg: "bg-slate-50 border-slate-200",
    iconColor: "text-slate-600",
    textColor: "text-slate-700",
  },
};

/**
 * Toast notification component with auto-dismiss.
 */
export default function Toast({ message, type = "info", onDismiss, duration = 4000 }) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-md animate-slide-in-right ${config.bg}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${config.textColor}`}>
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  onDismiss: PropTypes.func.isRequired,
  duration: PropTypes.number,
};
