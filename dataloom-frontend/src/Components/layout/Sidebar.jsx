import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FolderOpen,
    Wand2,
    History,
    User,
    ChevronLeft,
    ChevronRight,
    Database,
} from "lucide-react";
import DataLoomLogo from "../common/DataLoomLogo";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";

const mainNavItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: FolderOpen, label: "Projects" },
];

const workspaceNavItems = [
    { key: "explorer", icon: Database, label: "Data Explorer" },
    { key: "transform", icon: Wand2, label: "Transformations" },
    { key: "history", icon: History, label: "Version History" },
];

/**
 * Collapsible sidebar navigation with glassmorphism styling.
 */
export default function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();
    const { projectId, projectName } = useProjectContext();
    const { user } = useAuth();
    const isWorkspace = location.pathname.startsWith("/workspace/");

    return (
        <aside
            className={`relative flex flex-col bg-white/85 backdrop-blur border-r border-slate-200 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <DataLoomLogo className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <span className="text-lg font-semibold text-slate-900 tracking-tight font-display animate-fade-in">
                        DataLoom
                    </span>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Menu
                    </p>
                )}
                {mainNavItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `${isActive ? "nav-item-active" : "nav-item"} ${collapsed ? "justify-center px-0" : ""
                            }`
                        }
                        title={collapsed ? label : undefined}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium">{label}</span>}
                    </NavLink>
                ))}

                {/* Workspace section - only when in a project */}
                {isWorkspace && projectId && (
                    <>
                        {!collapsed && (
                            <div className="mt-6">
                                <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Workspace
                                </p>
                                <div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                                    <p className="text-xs font-medium text-blue-700 truncate">
                                        {projectName || "Untitled Project"}
                                    </p>
                                </div>
                            </div>
                        )}
                        {workspaceNavItems.map(({ key, icon: Icon, label }) => (
                            <button
                                key={key}
                                className={`nav-item w-full ${collapsed ? "justify-center px-0" : ""}`}
                                title={collapsed ? label : undefined}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && (
                                    <span className="text-sm font-medium">{label}</span>
                                )}
                            </button>
                        ))}
                    </>
                )}
            </nav>

            {/* Bottom: Profile & Collapse */}
            <div className="p-3 border-t border-slate-200 space-y-1">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `${isActive ? "nav-item-active" : "nav-item"} ${collapsed ? "justify-center px-0" : ""
                        }`
                    }
                    title={collapsed ? "Profile" : undefined}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                                {user?.name || "Guest"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || "Profile"}
                            </p>
                        </div>
                    )}
                </NavLink>

                <button
                    onClick={onToggle}
                    className={`nav-item w-full ${collapsed ? "justify-center px-0" : ""}`}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
