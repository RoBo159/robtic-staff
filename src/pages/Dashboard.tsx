import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type ThreadSummary } from "../lib/api";

export default function Dashboard() {
    const [open, setOpen] = useState<ThreadSummary[]>([]);
    const [closed, setClosed] = useState<ThreadSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.getThreads()
            .then(({ open, closed }) => {
                setOpen(open);
                setClosed(closed);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[var(--color-discord-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-400 text-center mt-10">{error}</p>;
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Open Threads" value={open.length} color="var(--color-discord-green)" />
                <StatCard label="Closed Threads" value={closed.length} color="var(--color-discord-red)" />
                <StatCard label="Total" value={open.length + closed.length} color="var(--color-discord-blue)" />
            </div>

            {/* Open threads */}
            <Section title="Open Threads" threads={open} emptyText="No open threads" />

            {/* Closed threads */}
            <Section title="Closed Threads" threads={closed} emptyText="No closed threads" />
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-[var(--color-dark-800)] rounded-xl p-5 border border-white/5">
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold" style={{ color }}>
                {value}
            </p>
        </div>
    );
}

function Section({ title, threads, emptyText }: { title: string; threads: ThreadSummary[]; emptyText: string }) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
            {threads.length === 0 ? (
                <p className="text-gray-500 text-sm">{emptyText}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {threads.map((t) => (
                        <ThreadCard key={t.threadId} thread={t} />
                    ))}
                </div>
            )}
        </div>
    );
}

function ThreadCard({ thread }: { thread: ThreadSummary }) {
    const date = new Date(thread.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Link
            to={`/modmail/transcript/${thread.threadId}`}
            className="block bg-[var(--color-dark-700)] hover:bg-[var(--color-dark-600)] rounded-lg p-4 border border-white/5 transition-colors"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500">{thread.threadId.slice(0, 8)}...</span>
                <StatusBadge status={thread.status} />
            </div>
            <p className="text-sm text-gray-300 mb-1">
                User: <span className="text-white">{thread.userId}</span>
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                <span>{thread.messageCount} msgs</span>
                <span>{thread.language}</span>
                <span>{date}</span>
            </div>
        </Link>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isOpen = status === "open";
    return (
        <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isOpen ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
            }`}
        >
            {status}
        </span>
    );
}
