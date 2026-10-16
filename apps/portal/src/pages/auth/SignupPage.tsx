import { Link } from "react-router";
import { PATHS } from "@/routes/paths";

export default function RegisterPage() {
  // TODO: implement the registration form once the design and BFF endpoint exist
  return (
    <main className="flex min-h-screen items-center justify-center bg-sc-bg px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-xl font-semibold text-sc-text-primary">
          Registro
        </h1>
        <p className="mb-6 text-sm text-sc-text-secondary">Próximamente.</p>
        <Link
          to={PATHS.auth.login}
          className="text-sm font-medium text-sc-teal-dark hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </main>
  );
}
