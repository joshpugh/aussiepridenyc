"use client";

import { useFormStatus } from "react-dom";

export function DeleteRegistrationButton({
  id,
  name,
  email,
  action,
}: {
  id: string;
  name: string;
  email: string;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const ok = window.confirm(
          `Delete the registration for ${name} (${email})?\n\nThis also removes any rehearsal signups they had. Cannot be undone.`,
        );
        if (!ok) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-medium text-pink-dark/70 hover:text-pink-dark disabled:opacity-50 disabled:cursor-wait"
      title="Delete this registration"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
