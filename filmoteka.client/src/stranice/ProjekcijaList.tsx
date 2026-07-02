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
            setLoading(true);
            const p = await projekcijaApi.getAll();
            setProjekcije(p);
            setError(null);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('Greška pri učitavanju projekcija');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const p = await projekcijaApi.getAll();
                if (isMounted) {
                    setProjekcije(p);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Greška pri učitavanju projekcija');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, []);

    const handleCancel = async (id: string) => {
        if (!window.confirm('Otkaži projekciju? Svi korisnici sa rezervacijom će dobiti email obaveštenje.')) return;
        try {
            await projekcijaApi.cancel(id);
            await loadProjekcije();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Greška pri otkazivanju projekcije');
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Projekcije</h2>
            {(isAdmin || isZaposleni) && <Link to="/projekcije/novi" style={addBtnStyle}>+ Zakaži projekciju</Link>}

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
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projekcije.map((p) => (
                            <tr key={p.id} style={{ background: p.status === 'Otkazana' ? '#fef2f2' : 'transparent' }}>
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
                                    {p.status === 'Otkazana' ? (
                                        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Otkazana</span>
                                    ) : (
                                        <span style={{ color: '#16a34a' }}>Aktivna</span>
                                    )}
                                </td>
                                <td style={tdStyle}>
                                    {p.status !== 'Otkazana' && (
                                        <>
                                            {p.dostupnaMesta > 0 && (
                                                <Link to={`/rezervisi/${p.id}`} style={editLink}>Rezerviši</Link>
                                            )}
                                            {isAdmin && (
                                                <>
                                                    {p.dostupnaMesta > 0 && ' | '}
                                                    <button onClick={() => handleCancel(p.id)} style={cancelBtn}>Otkaži</button>
                                                </>
                                            )}
                                        </>
                                    )}
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
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.6rem', background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' };
const tdStyle: React.CSSProperties = { padding: '0.6rem', borderBottom: '1px solid #e2e8f0' };
const editLink: React.CSSProperties = { color: '#3b82f6', textDecoration: 'none', marginRight: '0.5rem' };
const cancelBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0, fontWeight: 'bold' };