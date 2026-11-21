import { Suspense } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { login, requestPasswordReset } from "../actions";
import { Field, Flash, Submit, inputCls } from "../ui";

export const metadata = { title: "Accesso" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="mx-auto max-w-sm pt-6">
      <div className="rounded-3xl border border-line bg-white p-7">
        <LogoMark animated id="login" className="mx-auto w-40 text-red" />
        <h1 className="font-display mt-5 text-center text-2xl font-black uppercase">Area admin</h1>
        <div className="mt-5">
          <Suspense>
            <Flash searchParams={searchParams} />
          </Suspense>
        </div>
        <form action={login} className="space-y-4">
          <Field label="Email">
            <input name="email" type="email" required autoComplete="username" className={inputCls} />
          </Field>
          <Field label="Password">
            <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
          </Field>
          <div className="pt-1">
            <Submit>Accedi</Submit>
          </div>
        </form>
      </div>
      <details className="mt-4 rounded-3xl border border-line bg-white p-5 text-sm">
        <summary className="cursor-pointer font-semibold">Password dimenticata?</summary>
        <form action={requestPasswordReset} className="mt-4 space-y-3">
          <Field label="Email">
            <input name="email" type="email" required className={inputCls} />
          </Field>
          <Submit variant="ghost">Invia link</Submit>
        </form>
      </details>
    </div>
  );
}
