import { useNavigate } from "react-router";
import { PATHS } from "@/routes/paths";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mb-6 text-lg text-gray-600">Página no encontrada</p>
        <button
          onClick={() => navigate(PATHS.auth.login)}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
}