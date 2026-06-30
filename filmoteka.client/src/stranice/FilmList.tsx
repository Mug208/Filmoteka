import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { filmApi, zanrApi } from '../api/client';
import type { Film, PagedResult, Zanr } from '../tipove';
import Pagination from '../componente/Paginacija';
import { useRole } from '../componente/UlogaContext';

export default function FilmList() {
    const [data, setData] = useState<PagedResult<Film> | null>(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [selectedZanrId, setSelectedZanrId] = useState('');
    const [godina, setGodina] = useState<number | ''>('');
    const [dostupnoUBioskopu, setDostupnoUBioskopu] = useState(false);
    const [zanrovi, setZanrovi] = useState<Zanr[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useRole();

    const changePage = (nextPage: number) => {
        setPage(Math.max(1, nextPage));
    };
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        filmApi
            .getPaged(page, 5, query, selectedZanrId || undefined, typeof godina === 'number' ? godina : undefined, dostupnoUBioskopu)
            .then((res) => {
                if (!isMounted) return;
                setData(res);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!isMounted) return;
                const message = err instanceof Error ? err.message : 'Greška pri učitavanju filmova';
                setError(message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [page, query, selectedZanrId, godina, dostupnoUBioskopu]);

    useEffect(() => {
        let isMounted = true;
        zanrApi.getAll()
            .then((res) => {
                if (!isMounted) return;
                setZanrovi(res);
            })
            .catch(() => {
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: string, naziv: string) => {
        if (!window.confirm(`Obrisati film "${naziv}"?`)) return;
        try {
            await filmApi.remove(id);
            window.location.reload();
        } catch (err: unknown) {
            let msg = 'Greška pri brisanju';
            if (err instanceof Error) msg = err.message;
            alert(msg);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>Greška: {error}</p>;

    return (
        <div>
            <h2>Filmovi</h2>
            <div style={filterRow}>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    placeholder="Pretraga po naslovu ili opisu..."
                    style={searchInput}
                />
                <select
                    value={selectedZanrId}
                    onChange={(e) => { setSelectedZanrId(e.target.value); setPage(1); }}
                    style={filterSelect}
                >
                    <option value="">Svi žanrovi</option>
                    {zanrovi.map((z) => (
                        <option key={z.id} value={z.id}>{z.naziv}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={godina}
                    onChange={(e) => { setGodina(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
                    min={1900}
                    max={2100}
                    placeholder="Godina"
                    style={filterInput}
                />
                <label style={checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={dostupnoUBioskopu}
                        onChange={(e) => { setDostupnoUBioskopu(e.target.checked); setPage(1); }}
                    />
                    Dostupno u bioskopima
                </label>
                <button type="button" style={clearBtn} onClick={() => {
                    setQuery('');
                    setSelectedZanrId('');
                    setGodina('');
                    setDostupnoUBioskopu(false);
                    setPage(1);
                }}>
                    Očisti filtere
                </button>
            </div>

            {!data || !data.items || data.items.length === 0 ? (
                <div>
                    <p>Nema registrovanih filmova.</p>
                    {isAdmin && <Link to="/filmovi/novi" style={addLink}>+ Dodaj prvi film</Link>}
                </div>
            ) : (
                <>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Naziv</th>
                                <th style={thStyle}>Godina</th>
                                <th style={thStyle}>Žanr</th>
                                <th style={thStyle}>Režiseri</th>
                                <th style={thStyle}>Dostupno</th>
                                    {isAdmin && <th style={thStyle}>Akcije</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((film) => (
                                <tr key={film.id}>
                                    <td style={tdStyle}>
                                        <Link to={`/filmovi/${film.id}`} style={linkStyle}>{film.naziv}</Link>
                                    </td>
                                    <td style={tdStyle}>{film.godina}</td>
                                    <td style={tdStyle}>{film.zanr?.naziv ?? '—'}</td>
                                    <td style={tdStyle}>
                                        {(film.reziseri ?? []).length > 0
                                            ? (film.reziseri ?? []).map((r) => `${r.ime} ${r.prezime}`).join(', ')
                                            : '—'}
                                    </td>
                                    <td style={tdStyle}>{film.dostupnoUBioskopu ? 'Da' : 'Ne'}</td>
                                    <td style={tdStyle}>
                                        {isAdmin && <Link to={`/filmovi/${film.id}/izmeni`} style={editLink}>Izmeni</Link>}
                                        {isAdmin && ' | '}
                                        {isAdmin && <button onClick={() => handleDelete(film.id, film.naziv)} style={deleteBtn}>
                                            Obriši
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination page={data.page} totalPages={data.totalPages} onPageChange={changePage} />

                    <p style={infoStyle}>
                        Prikazano {((data.page - 1) * data.pageSize) + 1} - {Math.min(data.page * data.pageSize, data.totalItems)} od {data.totalItems} filmova
                    </p>
                </>
            )}
        </div>
    );
}

const filterRow: React.CSSProperties = {
    display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center'
};
const searchInput: React.CSSProperties = {
    flex: '1 1 220px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px'
};
const filterSelect: React.CSSProperties = {
    flex: '0 0 180px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px'
};
const filterInput: React.CSSProperties = {
    width: '100px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px'
};
const checkboxLabel: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', color: '#475569'
};
const clearBtn: React.CSSProperties = {
    padding: '0.5rem 0.75rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer'
};
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.6rem', background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' };
const tdStyle: React.CSSProperties = { padding: '0.6rem', borderBottom: '1px solid #e2e8f0' };
const linkStyle: React.CSSProperties = { color: '#3b82f6', textDecoration: 'none' };
const editLink: React.CSSProperties = { color: '#3b82f6', textDecoration: 'none' };
const addLink: React.CSSProperties = {
    display: 'inline-block', marginTop: '1rem', background: '#3b82f6', color: 'white',
    padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none',
};
const deleteBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0, fontSize: '0.95rem',
};
const infoStyle: React.CSSProperties = { marginTop: '0.75rem', color: '#64748b', fontSize: '0.9rem' };