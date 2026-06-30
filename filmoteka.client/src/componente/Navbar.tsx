import { Link } from 'react-router-dom';
import { useRole } from './UlogaContext';

export default function Navbar() {
    const { uloga, isAdmin, isZaposleni, isKorisnik, isAuthenticated, logout } = useRole();

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <Link to="/" style={brandStyle}>Filmoteka</Link>

                    <div style={linksStyle}>
                        <Link to="/" style={linkStyle}>Filmovi</Link>
                        {isAdmin && <Link to="/zanrovi" style={linkStyle}>Žanrovi</Link>}
                        {isAdmin && <Link to="/reziseri" style={linkStyle}>Režiseri</Link>}
                        {isAdmin && <Link to="/sale" style={linkStyle}>Sale</Link>}
                        {isAdmin && <Link to="/korisnici" style={linkStyle}>Korisnici</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {isKorisnik && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/filmovi/novi" style={addBtnStyle}>+ Dodaj film</Link>}
                    </div>
                </div>

                <div style={roleBoxStyle}>
                    {isAuthenticated ? (
                        <>
                            <span style={{ color: '#cbd5e1', fontSize: '0.9rem', marginRight: '0.75rem' }}>{uloga}</span>
                            <button onClick={logout} style={logoutBtnStyle}>Odjavi se</button>
                        </>
                    ) : (
                        <>
                            
                            <Link to="/login" style={loginBtnStyle}>Prijavi se</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const navStyle: React.CSSProperties = {
    background: '#1e293b', color: 'white', padding: '0.75rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const containerStyle: React.CSSProperties = {
    maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '0 1rem', flexWrap: 'wrap', gap: '0.5rem',
};
const brandStyle: React.CSSProperties = {
    color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold',
};
const linksStyle: React.CSSProperties = {
    display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap',
};
const linkStyle: React.CSSProperties = {
    color: '#cbd5e1', textDecoration: 'none', fontSize: '0.95rem',
};
const addBtnStyle: React.CSSProperties = {
    background: '#3b82f6', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px',
    textDecoration: 'none', fontSize: '0.9rem',
};
const roleBoxStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center',
};
const loginBtnStyle: React.CSSProperties = {
    marginLeft: '0.6rem', color: 'white', textDecoration: 'none', background: '#2563eb',
    padding: '0.35rem 0.7rem', borderRadius: '4px', fontSize: '0.85rem',
};
const logoutBtnStyle: React.CSSProperties = {
    background: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.7rem',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
};