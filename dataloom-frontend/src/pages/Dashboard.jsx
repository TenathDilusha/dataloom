import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentProjects, uploadProject } from "../api";
import { useToast } from "../context/ToastContext";
import {
    FolderOpen,
    Plus,
    TrendingUp,
    Database,
    Clock,
    ArrowRight,
    Layers,
    Upload,
    FileSpreadsheet,
    Wand2,
    BarChart3,
    Download,
} from "lucide-react";

/**
 * Modern dashboard overview with stats, recent projects, and quick actions.
 */
export default function Dashboard() {
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [file, setFile] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const projects = await getRecentProjects();
            setRecentProjects(projects);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilePick = (event) => {
        const nextFile = event.target.files?.[0] || null;
        if (nextFile) {
            setFile(nextFile);
            setShowUploadModal(true);
        }
    };

    const handleSubmitUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            showToast("Please select a file to upload", "warning");
            return;
        }
        if (!projectName.trim()) {
            showToast("Project name is required", "warning");
            return;
        }
        if (!projectDescription.trim()) {
            showToast("Project description is required", "warning");
            return;
        }

        setUploading(true);
        try {
            const data = await uploadProject(file, projectName, projectDescription);
            if (data.project_id) {
                showToast("Dataset uploaded successfully!", "success");
                navigate(`/workspace/${data.project_id}`);
            } else {
                showToast("Error: Project ID is undefined.", "error");
            }
        } catch {
            showToast("Error uploading file. Please try again.", "error");
        } finally {
            setUploading(false);
            setShowUploadModal(false);
            setFile(null);
            setProjectName("");
            setProjectDescription("");
            fetchData();
        }
    };

    const stats = [
        {
            label: "Total Datasets",
            value: recentProjects.length,
            icon: Database,
        },
        {
            label: "Recent Transforms",
            value: "—",
            icon: Layers,
        },
        {
            label: "Active Projects",
            value: recentProjects.filter((p) => {
                const d = new Date(p.last_modified);
                return Date.now() - d.getTime() < 7 * 86400000;
            }).length,
            icon: TrendingUp,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                <div className="card p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_48%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.12),transparent_50%)]" />
                    <div className="relative">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
                        <h1 className="text-3xl font-display font-semibold text-slate-900 mt-2">
                            Welcome to <span className="text-gradient">DataLoom</span>
                        </h1>
                        <p className="text-sm text-slate-600 mt-3 max-w-xl">
                            Upload a dataset, explore it in the table, and use the ribbon to
                            transform your data just like a familiar office workspace.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={() => navigate("/projects")}
                                className="btn-primary"
                                id="dashboard-new-project"
                            >
                                <Plus className="w-4 h-4" />
                                New Project
                            </button>
                            <button
                                onClick={() => navigate("/projects")}
                                className="btn-secondary"
                                id="dashboard-browse-projects"
                            >
                                <FolderOpen className="w-4 h-4" />
                                Browse Projects
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick upload</p>
                            <h2 className="text-lg font-semibold text-slate-900 mt-2">Select a CSV file</h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Upload a file and jump straight into the table.
                            </p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-slate-600" />
                        </div>
                    </div>
                    <label className="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
                        <Upload className="w-6 h-6 text-slate-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Choose a file</p>
                            <p className="text-xs text-slate-500">CSV files up to 50MB</p>
                        </div>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFilePick} />
                    </label>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="card p-5 flex items-center gap-4 animate-fade-in-up"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <stat.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Projects */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Recent Projects
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Your recently modified datasets
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/projects")}
                        className="btn-ghost"
                    >
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 shimmer rounded-xl" />
                        ))}
                    </div>
                ) : recentProjects.length === 0 ? (
                    <div className="text-center py-12">
                        <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">No projects yet</p>
                        <p className="text-slate-500 text-sm mt-1">
                            Upload a CSV to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentProjects.slice(0, 5).map((project) => (
                            <button
                                key={project.project_id}
                                onClick={() => navigate(`/workspace/${project.project_id}`)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50 transition-all duration-200 group animate-fade-in-up"
                                id={`dashboard-project-${project.project_id}`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Database className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-slate-900 transition-colors">
                                        {project.name}
                                    </p>
                                    {project.description && (
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-500">
                                        {new Date(project.last_modified).toLocaleDateString(
                                            undefined,
                                            { month: "short", day: "numeric" }
                                        )}
                                    </span>
                                </div>
                                                {/* Static CSV for quick testing */}
                                                <div className="mt-6">
                                                    <a
                                                        href="/static_test.csv"
                                                        download
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition"
                                                    >
                                                        <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                                                        Download static test CSV
                                                    </a>
                                                    <button
                                                        className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold border border-green-200 transition"
                                                        onClick={() => navigate("/workspace/static-test")}
                                                        id="dashboard-open-static-csv"
                                                    >
                                                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                                        Open static CSV in table
                                                    </button>
                                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        title: "Upload Dataset",
                        desc: "Import CSV files",
                        icon: Upload,
                        action: () => navigate("/projects"),
                    },
                    {
                        title: "Transform Data",
                        desc: "Filter, sort, pivot",
                        icon: Wand2,
                        action: () => navigate("/projects"),
                    },
                    {
                        title: "Visualize",
                        desc: "Charts & graphs",
                        icon: BarChart3,
                        action: () => navigate("/projects"),
                    },
                    {
                        title: "Export",
                        desc: "Download results",
                        icon: Download,
                        action: () => navigate("/projects"),
                    },
                ].map((item) => (
                    <button
                        key={item.title}
                        onClick={item.action}
                        className="card-hover p-5 text-left group"
                        id={`quick-action-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900 mt-3 group-hover:text-slate-900 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </button>
                ))}
            </div>

            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowUploadModal(false)}
                    />
                    <div className="glass-card w-full max-w-lg z-50 animate-scale-in overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Upload new dataset</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Add details so you can find this dataset later.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitUpload} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Project name
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Customer feedback"
                                    className="input-field"
                                    id="dashboard-upload-project-name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="Monthly survey exports for Q1"
                                    rows={3}
                                    className="input-field resize-none"
                                    id="dashboard-upload-project-desc"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">
                                    Selected file
                                </label>
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <FileSpreadsheet className="w-5 h-5 text-slate-500" />
                                    <div>
                                        <p className="text-sm text-slate-700">{file?.name || "No file selected"}</p>
                                        <p className="text-xs text-slate-500">
                                            {file?.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="btn-primary"
                                    id="dashboard-upload-submit-btn"
                                >
                                    {uploading ? "Uploading..." : "Open in table"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
