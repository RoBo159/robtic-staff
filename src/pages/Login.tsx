import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Login() {
    const { user, loading, login } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-[var(--color-discord-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (user) return <Navigate to="/" replace />;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-[var(--color-dark-800)] rounded-2xl p-10 text-center max-w-sm w-full shadow-xl border border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2">Robtic Staff</h1>
                <p className="text-gray-400 text-sm mb-8">
                    Sign in with your Discord account to access the staff dashboard.
                </p>
                <button
                    onClick={login}
                    className="w-full py-3 px-6 bg-[var(--color-discord-blue)] hover:bg-[var(--color-discord-blue)]/80 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                    Login with Discord
                </button>
            </div>
        </div>
    );
}
