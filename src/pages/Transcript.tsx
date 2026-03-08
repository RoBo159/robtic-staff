import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, type Transcript as TranscriptData, type TranscriptMessage } from "../lib/api";

export default function Transcript() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<TranscriptData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        api.getTranscript(id)
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[var(--color-discord-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return <p className="text-red-400 text-center mt-10">{error || "Not found"}</p>;
    }

    const created = new Date(data.createdAt).toLocaleString();
    const closedAt = data.closedAt ? new Date(data.closedAt).toLocaleString() : null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    ← Back
                </Link>
                <h1 className="text-xl font-bold text-white">Transcript</h1>
            </div>

            {/* Info Card */}
            <div className="bg-[var(--color-dark-800)] rounded-xl p-5 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <InfoItem label="Thread ID" value={data.threadId} />
                <InfoItem label="User" value={data.userId} />
                <InfoItem label="Status" value={data.status} />
                <InfoItem label="Language" value={data.language} />
                <InfoItem label="Type" value={data.requestType} />
                <InfoItem label="Claimed By" value={data.claimedBy || "—"} />
                <InfoItem label="Created" value={created} />
                <InfoItem label="Closed" value={closedAt || "—"} />
            </div>

            {/* Messages */}
            <div className="space-y-2">
                <h2 className="text-md font-semibold text-white mb-3">
                    Messages ({data.messages.length})
                </h2>
                {data.messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} isUser={data.userId === msg.authorId} />
                ))}
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-gray-500 text-xs mb-0.5">{label}</p>
            <p className="text-white font-medium truncate">{value}</p>
        </div>
    );
}

function MessageBubble({ message, isUser }: { message: TranscriptMessage; isUser: boolean }) {
    const time = new Date(message.timestamp).toLocaleString();
    const isStaff = message.authorType === "staff" || message.authorType === "system";

    return (
        <div className={`flex ${isStaff ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                    isStaff
                        ? "bg-[var(--color-discord-blue)]/15 border border-[var(--color-discord-blue)]/20"
                        : "bg-[var(--color-dark-700)] border border-white/5"
                }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${isStaff ? "text-[var(--color-discord-blue)]" : "text-gray-400"}`}>
                        {isUser ? "User" : message.authorType === "system" ? "System" : message.authorId}
                    </span>
                    <span className="text-[10px] text-gray-600">{time}</span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">
                    {message.content}
                </p>
                {message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {message.attachments.map((url, i) => (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[var(--color-discord-blue)] hover:underline block truncate"
                            >
                                📎 Attachment {i + 1}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
