import { PasswordForm } from "./PasswordForm";

export const metadata = { title: "Password" };

export default function PasswordPage() {
  return (
    <div className="mx-auto max-w-sm pt-6">
      <div className="rounded-3xl border border-line bg-white p-7">
        <h1 className="font-display mb-5 text-2xl font-black uppercase">Imposta la password</h1>
        <PasswordForm />
      </div>
    </div>
  );
}
