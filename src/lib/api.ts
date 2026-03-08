const BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
        credentials: "include",
        ...options,
    });

    if (res.status === 401) {
        throw new Error("UNAUTHORIZED");
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

export interface UserInfo {
    id: string;
    username: string;
    avatar: string | null;
    member: {
        roles: { id: string; name: string; color: string }[];
        joinedAt: string;
    } | null;
}

export interface ThreadSummary {
    threadId: string;
    userId: string;
    language: string;
    requestType: string;
    status: string;
    paused: boolean;
    claimedBy: string | null;
    closedBy: string | null;
    closedAt: string | null;
    createdAt: string;
    messageCount: number;
}

export interface TranscriptMessage {
    authorId: string;
    authorType: string;
    content: string;
    attachments: string[];
    timestamp: string;
}

export interface Transcript {
    threadId: string;
    userId: string;
    guildId: string;
    language: string;
    requestType: string;
    status: string;
    paused: boolean;
    claimedBy: string | null;
    closedBy: string | null;
    closedAt: string | null;
    createdAt: string;
    messages: TranscriptMessage[];
}

export const api = {
    getMe: () => request<UserInfo>("/auth/me"),
    logout: () => request<{ success: boolean }>("/auth/logout", { method: "POST" }),
    getThreads: () => request<{ open: ThreadSummary[]; closed: ThreadSummary[] }>("/api/modmail/threads"),
    getTranscript: (id: string) => request<Transcript>(`/api/modmail/transcript/${encodeURIComponent(id)}`),
};
