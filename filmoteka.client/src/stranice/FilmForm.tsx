import { useEffect, useState, type FormEventHandler, type ChangeEventHandler } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { filmApi, zanrApi, reziserApi } from '../api/client';
import type { Zanr, Reziser, CreateFilm } from '../tipove';

export default function FilmForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [zanrovi, setZanrovi] = useState<Zanr[]>([]);
    const [reziseri, setReziseri] = useState<Reziser[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [naziv, setNaziv] = useState('');
    const [godina, setGodina] = useState<number>(new Date().getFullYear());
    const [opis, setOpis] = useState('');
    const [dostupnoUBioskopu, setDostupnoUBioskopu] = useState(false);
    const [zanrId, setZanrId] = useState('');
    const [reziseriIds, setReziseriIds] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;

        Promise.all([zanrApi.getAll(), reziserApi.getAll()])
            .then(([z, r]) => {
                if (!isMounted) return;
                setZanrovi(z);
                setReziseri(r);
                if (!isEdit) setLoading(false);
            })
            .catch((err: unknown) => {
                if (!isMounted) return;
                const message = err instanceof Error ? err.message : 'Greška pri učitavanju';
                setError(message);
            });

        if (isEdit && id) {
            filmApi
                .getById(id)
                .then((f) => {
                    if (!isMounted) return;
                    setNaziv(f.naziv);
                    setGodina(f.godina);
                    setOpis(f.opis || '');
                    setDostupnoUBioskopu(f.dostupnoUBioskopu ?? false);
                    setZanrId(f.zanr?.id || '');
                    setReziseriIds((f.reziseri ?? []).map((r) => r.id));
                })
                .catch((err: unknown) => {
                    if (!isMounted) return;
                    const message = err instanceof Error ? err.message : 'Greška pri učitavanju filma';
                    setError(message);
                })
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        }

        return () => {
            isMounted = false;
        };
    }, [id, isEdit]);

    const handleReziseriChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
        setReziseriIds(selected);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!zanrId) {
            alert('Izaberi žanr.');
            return;
        }
        setSaving(true);
        const payload: CreateFilm = {
            naziv,
            godina,
            opis: opis || undefined,
            dostupnoUBioskopu: dostupnoUBioskopu,
            zanrId,
            reziseriIds,
        };
        try {
            if (isEdit && id) {
                await filmApi.update(id, payload);
            } else {
                await filmApi.create(payload);
            }
            navigate('/');
        } catch (err: unknown) {
            let msg = 'Greška pri snimanju';
            if (err && typeof err === 'object' && 'response' in err) {
                const resp = (err as { response?: { data?: { title?: string; message?: string } } }).response;
                msg = resp?.data?.title || resp?.data?.message || msg;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Učitavanje...</p>;

    return (
        <div>
            <h2>{isEdit ? 'Izmeni film' : 'Dodaj novi film'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <div style={formGroup}>
                    <label style={labelStyle}>Naziv *</label>
                    <input type="text" value={naziv} onChange={(e) => setNaziv(e.target.value)} required style={inputStyle} />
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Godina *</label>
                    <input type="number" value={godina} onChange={(e) => setGodina(parseInt(e.target.value) || 0)} min={1900} max={2100} required style={inputStyle} />
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Opis</label>
                    <textarea value={opis} onChange={(e) => setOpis(e.target.value)} rows={3} style={inputStyle} />
                </div>

                <div style={{ ...formGroup, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        id="dostupnoUBioskopu"
                        type="checkbox"
                        checked={dostupnoUBioskopu}
                        onChange={(e) => setDostupnoUBioskopu(e.target.checked)}
                    />
                    <label htmlFor="dostupnoUBioskopu" style={{ fontWeight: '600', color: '#475569' }}>
                        Dostupno u bioskopima
                    </label>
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Žanr *</label>
                    <select value={zanrId} onChange={(e) => setZanrId(e.target.value)} required style={inputStyle}>
                        <option value="">-- izaberi žanr --</option>
                        {zanrovi.map((z) => (
                            <option key={z.id} value={z.id}>{z.naziv}</option>
                        ))}
                    </select>
                    {zanrovi.length === 0 && (
                        <small style={{ color: '#dc2626' }}>
                            Nema žanrova. <Link to="/zanrovi">Dodaj žanr prvo</Link>.
                        </small>
                    )}
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Režiseri</label>
                    <select multiple size={6} value={reziseriIds} onChange={handleReziseriChange} style={inputStyle}>
                        {reziseri.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.ime} {r.prezime}
                            </option>
                        ))}
                    </select>
                    <small style={{ color: '#64748b' }}>Drži Ctrl (ili Cmd) za izbor više režisera.</small>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button type="submit" disabled={saving} style={saveBtn}>
                        {saving ? 'Snimanje...' : isEdit ? 'Sačuvaj izmene' : 'Dodaj film'}
                    </button>
                    {' '}
                    <Link to="/" style={backBtn}>Odustani</Link>
                </div>
            </form>
        </div>
    );
}

const formGroup: React.CSSProperties = { marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', color: '#475569' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' };
const saveBtn: React.CSSProperties = { background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const backBtn: React.CSSProperties = { color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem' };