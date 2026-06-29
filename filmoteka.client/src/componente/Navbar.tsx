import { Link } from 'react-router-dom';
import { useRole } from './UlogaContext';
import type { Uloga } from '../tipove';

const ULOGE: Uloga[] = ['Admin', 'Zaposleni', 'Korisnik'];

export default function Navbar() {
    const { uloga, setUloga, isAdmin, isZaposleni, isKorisnik } = useRole();

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <Link to="/" style={brandStyle}>Filmoteka</Link>

                    <div style={linksStyle}>
                        <Link to="/" style={linkStyle}>Filmovi</Link>
                        <Link to="/zanrovi" style={linkStyle}>Žanrovi</Link>
                        <Link to="/reziseri" style={linkStyle}>Režiseri</Link>
                        {isAdmin && <Link to="/sale" style={linkStyle}>Sale</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {isKorisnik && <Link to="/projekcije" style={linkStyle}>Projekcije</Link>}
                        {(isAdmin || isZaposleni) && <Link to="/filmovi/novi" style={addBtnStyle}>+ Dodaj film</Link>}
                    </div>
                </div>

                <div style={roleBoxStyle}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', marginRight: '0.4rem' }}>Uloga:</label>
                    <select
                        value={uloga}
                        onChange={(e) => setUloga(e.target.value as Uloga)}
                        style={roleSelectStyle}
                    >
                        {ULOGE.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
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
const roleSelectStyle: React.CSSProperties = {
    padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #475569',
    background: '#334155', color: 'white', fontSize: '0.85rem',
};