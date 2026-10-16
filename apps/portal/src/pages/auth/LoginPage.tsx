import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router";
import { loginSchema, type LoginFormValues } from "../../schemas/loginSchema";
import { useAuth } from "../../hooks/useAuth";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import { useGoogleLoginMutation } from "../../hooks/useGoogleLoginMutation";
import { AuthError } from "../../services/authService";
import { PATHS } from "@/routes/paths";
import { useToast } from "@/hooks/useToast";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
      PATHS.app.dashboard;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const isBusy = isSubmitting || googleMutation.isPending;

  const handleAuthError = (error: unknown) => {
    const message =
      error instanceof AuthError && error.code === "INVALID_CREDENTIALS"
        ? error.message
        : "No pudimos iniciar sesión. Intentá nuevamente.";
    toast.error(message);
    setError("root.serverError", { message });
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { doctor } = await loginMutation.mutateAsync(values);
      signIn(doctor);
      toast.success("Sesión iniciada correctamente");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const onGoogleLogin = async () => {
    clearErrors("root.serverError");
    try {
      const { doctor } = await googleMutation.mutateAsync();
      signIn(doctor);
      toast.success("Sesión iniciada correctamente");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-sc-surface px-3 py-2.5 text-sm text-sc-text-primary outline-none transition focus:ring-2 focus:ring-sc-teal ${
      hasError ? "border-red-500" : "border-sc-border"
    }`;

  return (
    <div className="w-[calc(100vw-2rem)] max-w-[32rem] rounded-xl border border-sc-border bg-sc-surface p-6 shadow-sm sm:p-8 md:p-10">
      {/* Brand */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sc-teal text-base font-bold text-white">
          SC
        </div>
        <span className="text-2xl font-semibold text-sc-text-primary">
          SugarCoach
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs font-medium text-sc-text-primary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass(!!errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs font-medium text-sc-text-primary"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className={`${inputClass(!!errors.password)} pr-10`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute inset-y-0 right-3 flex items-center text-sc-text-secondary hover:text-sc-text-primary"
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="w-full rounded-full bg-sc-teal py-2.5 text-sm font-semibold text-white transition hover:bg-sc-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando…" : "Iniciar Sesión"}
        </button>

        <Link
          to={PATHS.auth.signup}
          aria-disabled={isBusy}
          className="block w-full rounded-full border border-sc-teal py-2.5 text-center text-sm font-semibold text-sc-teal-dark transition hover:bg-sc-teal-light"
        >
          Registrarse
        </Link>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3" role="separator">
        <span className="h-px flex-1 bg-sc-border" />
        {/* Change to "o" if the UI stays fully in Spanish */}
        <span className="text-xs text-sc-text-secondary">or</span>
        <span className="h-px flex-1 bg-sc-border" />
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isBusy}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-sc-border bg-white py-2.5 text-sm font-medium text-sc-text-primary shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {googleMutation.isPending
          ? "Conectando…"
          : "Iniciar sesión con Google"}
      </button>

      <p className="mt-6 text-center text-xs text-sc-text-secondary">
        {/* TODO: remove once a real backend exists */}
        Demo: doctor@sugarcoach.com / Password123
      </p>
    </div>
  );
}
