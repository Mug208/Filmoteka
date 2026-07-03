import { useMemo, useState } from 'react';
import { useRole } from '../componente/UlogaContext';
import { korisnikApi } from '../api/client'; 
import type { Uloga, User } from '../tipove';

import { readUsers, saveUsers, ROLE_OPTIONS } from '../utils/userStorage';
import { 
    tableStyle, thStyle, tdStyle, inputStyle, 
    saveBtn, approveBtn, deleteBtn, secondarytext
} from './KorisniciList.styles';

export default function UsersList() {
    const { currentUser } = useRole();
    const [users, setUsers] = useState<User[]>(() => readUsers());
    const [message, setMessage] = useState<string | null>(null);

    const sortedUsers = useMemo(() => [...users].sort((a, b) => a.fullName.localeCompare(b.fullName)), [users]);

    const updateUser = (id: string, field: keyof User, value: string) => {
        if (field === 'role' && currentUser?.id === id) return;
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

    const handleApprove = async (user: User) => {
        try {
            await korisnikApi.approve(user);
            const nextUsers = users.map(u => u.id === user.id ? { ...u, status: 'Odobren' as const } : u);
            saveUsers(nextUsers);
            setUsers(nextUsers);
            setMessage('Korisnik je odobren. Email poslat!');
        } catch {
                alert('Greška pri slanju zahteva za odobrenje.');
            }
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
                            <th style={thStyle}>Status</th>
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
                                    {user.status === 'Odobren' ? (
                                        <span style={{ color: '#16a34a' }}>Odobren</span>
                                    ) : (
                                        <span style={{ color: '#d97706', fontWeight: 'bold' }}>Na čekanju</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {user.status !== 'Odobren' && (
                                        <>
                                            <button type="button" onClick={() => handleApprove(user)} style={approveBtn}>Odobri</button>
                                            {' | '}
                                        </>
                                    )}
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
