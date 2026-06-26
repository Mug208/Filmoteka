import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <Link to="/" style={brandStyle}>Filmoteka</Link>
                <div style={linksStyle}>
                    <Link to="/" style={linkStyle}>Filmovi</Link>
                    <Link to="/zanrovi" style={linkStyle}>Žanrovi</Link>
                    <Link to="/reziseri" style={linkStyle}>Režiseri</Link>
                    <Link to="/filmovi/novi" style={addBtnStyle}>+ Dodaj film</Link>
                </div>
            </div>
        </nav>
    );
}

const navStyle: React.CSSProperties = {
    background: '#1e293b',
    color: 'white',
    padding: '0.75rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const containerStyle: React.CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
};
const brandStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: 'bold',
};
const linksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
};
const linkStyle: React.CSSProperties = {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.95rem',
};
const addBtnStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
};