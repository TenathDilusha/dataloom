import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, LogOut } from "lucide-react";
import { useProjectContext } from "../../context/ProjectContext";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * Top navigation bar with search, breadcrumbs, and quick actions.
 */
export default function TopBar({ sidebarCollapsed, onToggleSidebar }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { projectName } = useProjectContext();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

    const getBreadcrumbs = () => {
        const path = location.pathname;
        if (path === "/dashboard") return [{ label: "Dashboard" }];
        if (path === "/projects") return [{ label: "Projects" }];
        if (path === "/profile") return [{ label: "Profile" }];
        if (path.startsWith("/workspace/"))
            return [
                { label: "Projects", to: "/projects" },
                { label: projectName || "Workspace" },
            ];
        return [{ label: "DataLoom" }];
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center justify-between px-6 flex-shrink-0">
            {/* Left: Menu toggle + Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="btn-ghost p-2 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
                    {breadcrumbs.map((crumb, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                            {idx > 0 && (
                                <span className="text-slate-400 mx-1">/</span>
                            )}
                            {crumb.to ? (
                                <button
                                    onClick={() => navigate(crumb.to)}
                                    className="text-slate-500 hover:text-slate-900 transition-colors duration-200"
                                >
                                    {crumb.label}
                                </button>
                            ) : (
                                <span className="text-slate-900 font-medium">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right: Search + Notifications */}
            <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        ⌘K
                    </kbd>
                </div>

                <button className="btn-ghost p-2 relative" aria-label="Notifications">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                </button>

                <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 text-white flex items-center justify-center font-semibold">
                        {initials}
                    </div>
                    <div className="hidden sm:block min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Guest"}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email || "Signed in"}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-ghost p-2"
                        aria-label="Sign out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
