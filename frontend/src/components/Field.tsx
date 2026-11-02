import { ChangeEvent } from 'react';

interface Props { label: string; name: string; value: string; onChange(v: string): void; type?: string; error?: string; hint?: string; textarea?: boolean; disabled?: boolean; required?: boolean; autoComplete?: string; }
export function Field({ label, name, value, onChange, type = 'text', error, hint, textarea, disabled, required, autoComplete }: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value);
  const common = { id: name, name, value, onChange: handle, disabled, 'aria-invalid': !!error, autoComplete };
  return (
    <div className="field">
      <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>
      {textarea ? <textarea rows={6} {...common} /> : <input type={type} {...common} />}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="error" role="alert">{error}</small>}
    </div>
  );
}
