import { Link } from 'react-router-dom';
import { useRole } from './UlogaContext';

export default function Navbar() {
    const { uloga, isAdmin, isZaposleni, isKorisnik, isAuthenticated, logout } = useRole();

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <Link to="/" style={brandStyle}>Filmoteka</Link>

                    <div style={linksStyle}>
                        <Link to="/" style={linkStyle}>Filmovi</Link>
                        {isAdmin && <Link to="/zanrovi" style={linkStyle}>Žanrovi</Link>}
                        {isAdmin && <Link to="/reziseri" style={linkStyle}>Režiseri</Link>}
                        {isAdmin && <Link to="/sale" style={linkStyle}>Sale</Link>}
                        {isAdmin && <Link to="/korisnici" style={linkStyle}>Korisnici</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {isKorisnik && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/filmovi/novi" style={dodajBtnStyle}>+ Dodaj film</Link>}
                    </div>
                </div>

                <div style={roleBoxStyle}>
                    {isAuthenticated ? (
                        <>
                            <span style={roleTextStyle}>{uloga}</span>
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
    background: 'rgba(17, 24, 39)',
    color: 'white',
    padding: '1rem 0',
    borderBottom: '1px solid #374151',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
};

const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
};

const brandStyle: React.CSSProperties = {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
};

const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
};

const linkStyle: React.CSSProperties = {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.5rem 0.25rem',
    transition: 'color 0.2s ease',
    borderBottom: '2px solid transparent',
};

const dodajBtnStyle: React.CSSProperties = {
    background: '#facc15', 
    color: '#111827', 
    padding: '0.5rem 1rem',
    borderRadius: '5px', 
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: 'none',
    boxShadow: '0 2px 4px rgba(250, 204, 21, 0.3)',
    display: 'flex',
    alignItems: 'center',
};

const roleBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '0.4rem 0.4rem 0.4rem 0.4rem',
    borderRadius: '10px',
    border: '1px solid #374151',
};

const roleTextStyle: React.CSSProperties = {
    color: '#9ca3af',
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
};

const loginBtnStyle: React.CSSProperties = {
    color: '#111827',
    textDecoration: 'none',
    background: '#ffffff',
    padding: '0.5rem 1.25rem',
    borderRadius: '5px',
    fontSize: '0.85rem',
    fontWeight: '600',
};

const logoutBtnStyle: React.CSSProperties = {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background 0.2s ease',
};