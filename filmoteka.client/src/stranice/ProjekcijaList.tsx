import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projekcijaApi } from '../api/client';
import type { Projekcija } from '../tipove';
import { useRole } from '../componente/UlogaContext';

function formatDatum(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

export default function ProjekcijaList() {
    const [projekcije, setProjekcije] = useState<Projekcija[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAdmin, isZaposleni } = useRole();

    const loadProjekcije = async () => {
        try {
            const p = await projekcijaApi.getAll();
            setProjekcije(p);
            setError(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Greška pri učitavanju projekcija');
        }
    };

    useEffect(() => {
        let isMounted = true;
        projekcijaApi.getAll()
            .then((p) => { if (isMounted) { setProjekcije(p); setError(null); } })
            .catch((err: unknown) => { if (isMounted) setError(err instanceof Error ? err.message : 'Greška pri učitavanju projekcija'); })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Obrisati projekciju?')) return;
        try {
            await projekcijaApi.remove(id);
            await loadProjekcije();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Greška pri brisanju projekcije');
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Projekcije</h2>
            {isAdmin && <Link to="/projekcije/novi" style={addBtnStyle}>+ Zakaži projekciju</Link>}
            {isZaposleni && <Link to="/projekcije/novi" style={addBtnStyle}>+ Zakaži projekciju</Link>}
            {projekcije.length === 0 ? (
                <p style={{ marginTop: '1rem' }}>Nema zakazanih projekcija.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Film</th>
                            <th style={thStyle}>Sala</th>
                            <th style={thStyle}>Početak</th>
                            <th style={thStyle}>Kraj</th>
                            <th style={thStyle}>Slobodna mesta</th>
                            <th style={thStyle}>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projekcije.map((p) => (
                            <tr key={p.id}>
                                <td style={tdStyle}>{p.film?.naziv ?? '—'}</td>
                                <td style={tdStyle}>
                                    {p.sala?.naziv ?? '—'}
                                    <small style={{ color: '#64748b' }}> ({p.sala?.tip})</small>
                                </td>
                                <td style={tdStyle}>{formatDatum(p.vremePocetka)}</td>
                                <td style={tdStyle}>{formatDatum(p.vremeZavrsetka)}</td>
                                <td style={tdStyle}>
                                    <strong style={{ color: p.dostupnaMesta > 0 ? '#16a34a' : '#dc2626' }}>
                                        {p.dostupnaMesta}
                                    </strong>
                                    {' / '}
                                    {p.ukupnoMesta}
                                </td>
                                <td style={tdStyle}>
                                    {p.dostupnaMesta > 0 && (
                                        <Link to={`/rezervisi/${p.id}`} style={editLink}>Rezerviši</Link>
                                    )}
                                    {isAdmin && ' | '}
                                    {isAdmin && <button onClick={() => handleDelete(p.id)} style={deleteBtn}>Obriši</button> }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const addBtnStyle: React.CSSProperties = {
    display: 'inline-block', background: '#3b82f6', color: 'white',
    padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none'
};
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thStyle: React.CSSProperties = { textAlign: 'center', padding: '0.6rem', background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' };
const tdStyle: React.CSSProperties = { padding: '0.6rem', borderBottom: '1px solid #e2e8f0' };
const editLink: React.CSSProperties = { color: '#3b82f6', textDecoration: 'none' };
const deleteBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 };

