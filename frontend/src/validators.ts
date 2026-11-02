export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v: string): boolean => EMAIL_REGEX.test(v);
export const onlyDigits = (v: string): string => v.replace(/\D/g, '');

export function isCpf(raw: string): boolean {
  const c = onlyDigits(raw);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  const digit = (n: number): number => {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += Number(c[i]) * (n + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return digit(9) === Number(c[9]) && digit(10) === Number(c[10]);
}

/** Retorna os requisitos de senha que ainda não foram atendidos. */
export function passwordProblems(p: string): string[] {
  const out: string[] = [];
  if (p.length < 8) out.push('mínimo de 8 caracteres');
  if (!/[a-z]/.test(p)) out.push('uma letra minúscula');
  if (!/[A-Z]/.test(p)) out.push('uma letra maiúscula');
  if (!/\d/.test(p)) out.push('um número');
  if (!/[^A-Za-z0-9]/.test(p)) out.push('um símbolo');
  return out;
}
