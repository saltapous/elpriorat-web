// app/login/page.tsx
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm bg-neutral-900/40 border border-neutral-800 rounded-xl p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Entra</h1>

        <div className="space-y-1">
          <label className="text-sm text-neutral-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md bg-neutral-950 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-neutral-200" htmlFor="password">
            Contrasenya
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md bg-neutral-950 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-500 transition text-white py-2 rounded-md text-sm font-medium"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

