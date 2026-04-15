import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  KeyRound,
  Mail,
} from "lucide-react";
import DataLoomLogo from "../Components/common/DataLoomLogo";
import { useAuth } from "../context/AuthContext";

const GoogleMark = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.7 1.22 9.2 3.61l6.85-6.85C35.96 2.18 30.47 0 24 0 14.6 0 6.52 5.38 2.56 13.22l7.98 6.19C12.7 13.44 17.9 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.95-2.2 5.45-4.7 7.15l7.2 5.6C43.1 37.4 46.5 31.4 46.5 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.41c-.48-1.45-.75-2.99-.75-4.57s.27-3.12.75-4.57l-7.98-6.19C.92 16.13 0 19.96 0 24c0 4.04.92 7.87 2.56 11.19l7.98-6.78z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.2-5.6c-2 1.35-4.55 2.15-8.7 2.15-6.1 0-11.3-3.94-13.16-9.4l-7.98 6.78C6.52 42.62 14.6 48 24 48z"
    />
  </svg>
);

const FacebookMark = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#1877F2"
      d="M48 24c0 13.25-10.75 24-24 24S0 37.25 0 24 10.75 0 24 0s24 10.75 24 24z"
    />
    <path
      fill="#fff"
      d="M26.7 37.1V25.6h3.9l.6-4.5h-4.5V18c0-1.3.36-2.2 2.25-2.2h2.4V11.8c-1.1-.1-2.2-.2-3.3-.2-3.3 0-5.6 2-5.6 5.7v3.8h-3.8v4.5h3.8v11.5h4.3z"
    />
  </svg>
);

const GithubMark = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#111827"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.57.1.78-.25.78-.55v-2.03c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.52-2.55-.29-5.22-1.27-5.22-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.52-1.45.11-3.02 0 0 .97-.31 3.18 1.17.92-.26 1.9-.39 2.88-.39.98 0 1.96.13 2.88.39 2.21-1.48 3.18-1.17 3.18-1.17.63 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.41-2.68 5.38-5.24 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.2.66.79.55C20.71 21.39 24 17.08 24 12 24 5.65 18.35.5 12 .5z"
    />
  </svg>
);

const providers = [
  {
    key: "google",
    label: "Continue with Google",
    subtitle: "Use your Google account",
    Icon: GoogleMark,
  },
  {
    key: "facebook",
    label: "Continue with Facebook",
    subtitle: "Use your Facebook account",
    Icon: FacebookMark,
  },
  {
    key: "github",
    label: "Continue with GitHub",
    subtitle: "Use your GitHub account",
    Icon: GithubMark,
  },
];

export default function AuthPage() {
  const { isAuthenticated, signInWithProvider, signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) navigate(redirectPath, { replace: true });
  }, [isAuthenticated, navigate, redirectPath]);

  const subcopy = useMemo(
    () =>
      mode === "login"
        ? "Welcome back. Sign in to access your projects and pick up where you left off."
        : "Create your DataLoom account to explore datasets, collaborate, and manage transformations.",
    [mode]
  );

  const handleProvider = async (provider) => {
    setError("");
    setLoading(true);
    try {
      await signInWithProvider(provider);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmail({ ...form, mode });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (next) => {
    setMode(next);
    setError("");
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="space-y-6">
          <div className="auth-brand">
            <div className="auth-brand-logo">
              <DataLoomLogo className="w-6 h-6" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-slate-900">DataLoom</p>
              <p className="text-sm text-slate-500">Secure access to your workspace</p>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <p className="auth-kicker">Workspace access</p>
            <h1 className="auth-title">
              {mode === "login" ? "Sign in to DataLoom" : "Create your DataLoom account"}
            </h1>
            <p className="auth-subcopy mt-3">{subcopy}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  01
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upload files quickly</p>
                  <p className="text-xs text-slate-500">Drop a CSV and start exploring instantly.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  02
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Transform with confidence</p>
                  <p className="text-xs text-slate-500">Use a familiar ribbon and table view.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <header className="space-y-2 text-center">
            <p className="auth-kicker">Welcome</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {mode === "login" ? "Sign in" : "Create account"}
            </h2>
            <p className="text-sm text-slate-500">Use email or a trusted provider.</p>
          </header>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="text-xs font-semibold text-slate-600">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="input-field mt-2"
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-600">Email address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <div className="relative mt-2">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="input-field pl-10"
                  placeholder={mode === "login" ? "Your password" : "Create a strong password"}
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Working..." : mode === "login" ? "Continue" : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="auth-divider mt-6">or</div>

          <div className="mt-5 space-y-3">
            {providers.map(({ key, label, subtitle, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleProvider(key)}
                disabled={loading}
                className="auth-provider-btn"
              >
                <span className="auth-provider-icon">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1">
                  <span className="auth-provider-title">{label}</span>
                  <span className="auth-provider-subtitle block">{subtitle}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === "login" ? "New to DataLoom?" : "Already have an account?"} {" "}
            <button
              onClick={() => changeMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-slate-700 hover:text-slate-900"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
