import { useEffect, useMemo, useState, type FormEventHandler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../componente/UlogaContext';
import type { Uloga, User } from '../tipove';

const USERS_STORAGE_KEY = 'filmoteka_users';

function readUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
        return [];
    }
}

export default function LoginStrana() {
    const navigate = useNavigate();
    const { isAuthenticated, login, setCurrentUser } = useRole();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [users, setUsers] = useState<User[]>(() => readUsers());

    const demoUsers = useMemo(() => [
        { id: 'admin-test', fullName: 'Admin Test', email: 'admin@filmoteka.rs', username: 'admin', password: 'admin123', role: 'Admin' as Uloga },
        { id: 'zaposleni-test', fullName: 'Zaposleni Test', email: 'zaposleni@filmoteka.rs', username: 'zaposleni', password: 'zaposleni123', role: 'Zaposleni' as Uloga },
        { id: 'korisnik-test', fullName: 'Korisnik Test', email: 'korisnik@filmoteka.rs', username: 'korisnik', password: 'korisnik123', role: 'Korisnik' as Uloga },
        ...users,
    ], [users]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'register') {
            if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
                setError('Svi podaci su obavezni.');
                return;
            }
            const exists = demoUsers.some((u) => u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === email.trim().toLowerCase());
            if (exists) {
                setError('Korisničko ime ili email već postoje.');
                return;
            }
            const newUser: User = {
                id: crypto.randomUUID(),
                fullName: fullName.trim(),
                email: email.trim(),
                username: username.trim(),
                password,
                role: 'Korisnik',
            };
            const nextUsers = [...users, newUser];
            setUsers(nextUsers);
            if (typeof window !== 'undefined') {
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
            }
            setCurrentUser(newUser);
            login('Korisnik');
            navigate('/', { replace: true });
            return;
        }

        const found = demoUsers.find((u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
        if (found) {
            setCurrentUser(found);
            login(found.role);
            navigate('/', { replace: true });
            return;
        }

        setError('Neispravno korisničko ime ili lozinka.');
    };

    return (
        <div style={{ minWidth: '480px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button type="button" onClick={() => setMode('login')} style={{ ...toggleBtn, ...(mode === 'login' ? activeToggleBtn : {}) }}>Prijava</button>
                <button type="button" onClick={() => setMode('register')} style={{ ...toggleBtn, ...(mode === 'register' ? activeToggleBtn : {}) }}>Registracija</button>
            </div>

            <h2 style={{ marginBottom: '0.5rem' }}>{mode === 'login' ? 'Prijavite se' : 'Registrujte se'}</h2>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>{mode === 'login' ? 'Unesite postojeći nalog.' : 'Napravite nalog za rezervacije za rezervaciju mesta.'}</p>
            {error && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Ime i prezime</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                        </div>
                    </>
                )}

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Korisničko ime</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Lozinka</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
                </div>

                <button type="submit" style={buttonStyle}>{mode === 'login' ? 'Prijavi se' : 'Registruj se'}</button>
            </form>

            <div style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                <p><strong>Test:</strong></p>
                <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                    <li>Admin / admin123</li>
                    <li>Zaposleni / zaposleni123</li>
                    <li>Korisnik / korisnik123</li>
                </ul>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Nazad na početnu</Link>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.35rem', fontWeight: '600', color: '#334155' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.65rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' };
const buttonStyle: React.CSSProperties = { width: '100%', background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const toggleBtn: React.CSSProperties = { flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' };
const activeToggleBtn: React.CSSProperties = { background: '#2563eb', color: 'white', borderColor: '#2563eb' };
