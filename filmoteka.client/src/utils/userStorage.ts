import type { User, Uloga } from '../tipove';

export const STORAGE_KEY = 'filmoteka_users';
export const ROLE_OPTIONS: Uloga[] = ['Admin', 'Zaposleni', 'Korisnik'];

export function readUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? (JSON.parse(raw) as any[]) : [];
        return arr.map((a) => ({
            id: String(a.id ?? ''),
            fullName: String(a.fullName ?? ''),
            email: String(a.email ?? ''),
            username: String(a.username ?? ''),
            password: String(a.password ?? ''),
            role: (['Admin', 'Zaposleni', 'Korisnik'].includes(a?.role) ? a.role : 'Korisnik') as Uloga,
            status: a?.status === 'Odobren' ? 'Odobren' : 'NaCekanju',
        }));
    } catch {
        return [];
    }
}

export function saveUsers(users: User[]) {
    if (typeof window !== 'undefined') {
        const normalized = users.map(u => ({
            ...u,
            status: u.status === 'Odobren' ? 'Odobren' : 'NaCekanju'
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
}
