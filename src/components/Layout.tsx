import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function avatarUrl(id: string, avatar: string | null) {
    if (!avatar) return `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(id) >> 22n) % 6}.png`;
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=64`;
}

export default function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-60 shrink-0 bg-[var(--color-dark-800)] flex flex-col border-r border-white/5">
                <div className="p-5 text-lg font-bold tracking-wide text-white">
                    Robtic Staff
                </div>

                <nav className="flex-1 px-3 space-y-1 text-sm">
                    <SideLink to="/" label="ModMail" icon="📬" />
                </nav>

                {/* User footer */}
                {user && (
                    <div className="p-3 border-t border-white/5 flex items-center gap-3">
                        <img
                            src={avatarUrl(user.id, user.avatar)}
                            className="w-8 h-8 rounded-full"
                            alt=""
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">
                                {user.username}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs text-gray-400 hover:text-red-400 cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}

function SideLink({ to, label, icon }: { to: string; label: string; icon: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                        ? "bg-[var(--color-discord-blue)]/15 text-[var(--color-discord-blue)]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
            }
        >
            <span>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
}
