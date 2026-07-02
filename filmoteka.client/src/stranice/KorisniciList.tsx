import { useMemo, useState } from 'react';
import { useRole } from '../componente/UlogaContext';
import type { Uloga, User } from '../tipove';

const STORAGE_KEY = 'filmoteka_users';
const ROLE_OPTIONS: Uloga[] = ['Admin', 'Zaposleni', 'Korisnik'];

function readUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: User[]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
}

export default function UsersList() {
    const { currentUser } = useRole();
    const [users, setUsers] = useState<User[]>(() => readUsers());
    const [message, setMessage] = useState<string | null>(null);

    const sortedUsers = useMemo(() => [...users].sort((a, b) => a.fullName.localeCompare(b.fullName)), [users]);

    const updateUser = (id: string, field: keyof User, value: string) => {
        if (field === 'role' && currentUser?.id === id) {
            return;
        }
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
    };

    const saveUser = (user: User) => {
        const nextUsers = users.map((entry) => (entry.id === user.id ? {
            ...entry,
            fullName: user.fullName.trim() || entry.fullName,
            email: user.email.trim() || entry.email,
            username: user.username.trim() || entry.username,
            password: user.password.trim() || entry.password,
            role: user.role,
        } : entry));
        saveUsers(nextUsers);
        setUsers(nextUsers);
        setMessage('Korisnik je sačuvan.');
    };

    const deleteUser = (id: string) => {
        const nextUsers = users.filter((u) => u.id !== id);
        saveUsers(nextUsers);
        setUsers(nextUsers);
        setMessage('Korisnik je obrisan.');
    };

    return (
        <div>
            <h2>Upravljanje korisnicima</h2>
            <p style={secondarytext}>Promenite ulogu, ime, email, korisničko ime ili lozinku za bilo kog korisnika.</p>
            {message && <p style={{ color: '#16a34a' }}>{message}</p>}

            <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Ime i prezime</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Korisničko ime</th>
                            <th style={thStyle}>Lozinka</th>
                            <th style={thStyle}>Uloga</th>
                            <th style={thStyle}>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((user) => (
                            <tr key={user.id}>
                                <td style={tdStyle}><input value={user.fullName} onChange={(e) => updateUser(user.id, 'fullName', e.target.value)} style={inputStyle} /></td>
                                <td style={tdStyle}><input value={user.email} onChange={(e) => updateUser(user.id, 'email', e.target.value)} style={inputStyle} /></td>
                                <td style={tdStyle}><input value={user.username} onChange={(e) => updateUser(user.id, 'username', e.target.value)} style={inputStyle} /></td>
                                <td style={tdStyle}><input type="password" value={user.password} onChange={(e) => updateUser(user.id, 'password', e.target.value)} style={inputStyle} /></td>
                                <td style={tdStyle}>
                                    {currentUser?.id === user.id ? (
                                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Vaša uloga</div>
                                    ) : (
                                        <select value={user.role} onChange={(e) => updateUser(user.id, 'role', e.target.value as Uloga)} style={inputStyle}>
                                            {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    <button type="button" onClick={() => saveUser(user)} style={saveBtn}>Sačuvaj</button>
                                    {' '}
                                    <button type="button" onClick={() => deleteUser(user.id)} style={deleteBtn}>Obriši</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const thStyle: React.CSSProperties = { textAlign: 'center', padding: '0.6rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const tdStyle: React.CSSProperties = { padding: '0.4rem', borderBottom: '1px solid #f1f5f9' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.4rem 0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' };
const saveBtn: React.CSSProperties = { background: '#2563eb', color: 'white', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '4px', cursor: 'pointer' };
const deleteBtn: React.CSSProperties = { background: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '4px', cursor: 'pointer' };
const secondarytext: React.CSSProperties = { color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' };