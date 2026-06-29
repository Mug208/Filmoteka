import { useEffect, useState, type FormEventHandler } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projekcijaApi, filmApi, salaApi } from '../api/client';
import type { Film, Sala } from '../tipove';

function toIso(localValue: string): string {
    if (!localValue) return '';
    return new Date(localValue).toISOString();
}

export default function ProjekcijaForm() {
    const navigate = useNavigate();
    const [filmovi, setFilmovi] = useState<Film[]>([]);
    const [sale, setSale] = useState<Sala[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filmId, setFilmId] = useState('');
    const [salaId, setSalaId] = useState('');
    const [vremePocetka, setVremePocetka] = useState('');
    const [vremeZavrsetka, setVremeZavrsetka] = useState('');

    useEffect(() => {
        let isMounted = true;
        Promise.all([filmApi.getPaged(1, 100), salaApi.getAll()])
            .then(([f, s]) => {
                if (!isMounted) return;
                setFilmovi(f.items);
                setSale(s);
            })
            .catch((err: unknown) => {
                if (isMounted) setError(err instanceof Error ? err.message : 'Greška pri učitavanju podataka');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!filmId || !salaId || !vremePocetka || !vremeZavrsetka) {
            alert('Popunite sva polja.');
            return;
        }
        setSaving(true);
        try {
            await projekcijaApi.create({
                filmId,
                salaId,
                vremePocetka: toIso(vremePocetka),
                vremeZavrsetka: toIso(vremeZavrsetka),
            });
            navigate('/projekcije');
        } catch (err: unknown) {
            let msg = 'Greška pri snimanju';
            if (err instanceof Error) msg = err.message;
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Učitavanje...</p>;

    return (
        <div>
            <h2>Zakaži projekciju</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <div style={formGroup}>
                    <label style={labelStyle}>Film *</label>
                    <select value={filmId} onChange={(e) => setFilmId(e.target.value)} required style={inputStyle}>
                        <option value="">--izaberi film--</option>
                        {filmovi.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.naziv} ({f.godina})
                            </option>
                        ))}
                    </select>
                    {filmovi.length === 0 && (
                        <small style={{ color: '#dc2626' }}>
                            Nema filmova. <Link to="/filmovi/novi">Dodaj film</Link>.
                        </small>
                    )}
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Sala *</label>
                    <select value={salaId} onChange={(e) => setSalaId(e.target.value)} required style={inputStyle}>
                        <option value="">--izaberi salu--</option>
                        {sale.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.naziv} (kapacitet: {s.kapacitet}, {s.tip})
                            </option>
                        ))}
                    </select>
                    {sale.length === 0 && (
                        <small style={{ color: '#dc2626' }}>
                            Nema sala. <Link to="/sale">Dodaj salu</Link>.
                        </small>
                    )}
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Vreme početka *</label>
                    <input
                        type="datetime-local"
                        value={vremePocetka}
                        onChange={(e) => setVremePocetka(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={formGroup}>
                    <label style={labelStyle}>Vreme završetka *</label>
                    <input
                        type="datetime-local"
                        value={vremeZavrsetka}
                        onChange={(e) => setVremeZavrsetka(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <small style={{ color: '#64748b' }}>
                        Napomena: između projekcija mora biti bar 15 minuta razmaka.
                    </small>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <button type="submit" disabled={saving} style={saveBtn}>
                        {saving ? 'Snimanje...' : 'Zakaži projekciju'}
                    </button>
                    {' '}
                    <Link to="/projekcije" style={backBtn}>
                        Odustani
                    </Link>
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