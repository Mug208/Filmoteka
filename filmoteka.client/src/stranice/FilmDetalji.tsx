import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filmApi } from '../api/client';
import type { Film } from '../tipove';

export default function FilmDetails() {
    const { id } = useParams<{ id: string }>();
    const [film, setFilm] = useState<Film | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let isMounted = true;

        filmApi
            .getById(id)
            .then((f) => {
                if (!isMounted) return;
                setFilm(f);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!isMounted) return;
                const message = err instanceof Error ? err.message : 'Greška';
                setError(message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>Greška: {error}</p>;
    if (!film) return <p>Film nije pronađen.</p>;

    return (
        <div>
            <h2>{film.naziv}</h2>
            <dl style={dlStyle}>
                <dt style={dtStyle}>Godina:</dt>
                <dd style={ddStyle}>{film.godina}</dd>

                <dt style={dtStyle}>Opis:</dt>
                <dd style={ddStyle}>{film.opis || '—'}</dd>

                <dt style={dtStyle}>Žanr:</dt>
                <dd style={ddStyle}>{film.zanr?.naziv ?? '—'}</dd>

                <dt style={dtStyle}>Režiseri:</dt>
                <dd style={ddStyle}>
                    {(film.reziseri ?? []).length > 0 ? (
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                            {(film.reziseri ?? []).map((r) => (
                                <li key={r.id}>
                                    {r.ime} {r.prezime}
                                    {r.datumRodjenja && (
                                        <span style={{ color: '#64748b' }}>
                                            {' '}({new Date(r.datumRodjenja).toLocaleDateString('sr-RS')})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        '—'
                    )}
                </dd>
            </dl>

            <div style={{ marginTop: '1.5rem' }}>
                <Link to={`/filmovi/${film.id}/izmeni`} style={editBtn}>Izmeni</Link>
                {' '}
                <Link to="/" style={backBtn}>Nazad na listu</Link>
            </div>
        </div>
    );
}

const dlStyle: React.CSSProperties = { marginTop: '1rem' };
const dtStyle: React.CSSProperties = { fontWeight: 'bold', color: '#475569', marginTop: '0.75rem' };
const ddStyle: React.CSSProperties = { margin: '0.25rem 0 0 0' };
const editBtn: React.CSSProperties = {
    display: 'inline-block', background: '#3b82f6', color: 'white',
    padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none',
};
const backBtn: React.CSSProperties = {
    display: 'inline-block', padding: '0.4rem 0.8rem', textDecoration: 'none', color: '#475569',
};