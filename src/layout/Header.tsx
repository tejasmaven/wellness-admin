import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
      <div className="font-semibold text-lg">
        Wellness Admin
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.email}
        </span>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
