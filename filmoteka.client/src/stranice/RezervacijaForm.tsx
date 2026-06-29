import { useEffect, useState, type FormEventHandler } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projekcijaApi, rezervacijaApi } from '../api/client';
import type { Projekcija, Rezervacija } from '../tipove';

function formatDatum(iso: string): string {
    return new Date(iso).toLocaleString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RezervacijaForm() {
    const { id } = useParams<{ id: string }>();
    const [projekcija, setProjekcija] = useState<Projekcija | null>(null);
    const [postojece, setPostojece] = useState<Rezervacija[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uspeh, setUspeh] = useState<string | null>(null);

    const [ime, setIme] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (!id) return;
        let isMounted = true;
        Promise.all([
            projekcijaApi.getById(id),
            rezervacijaApi.getByProjekcija(id),
        ])
            .then(([p, r]) => {
                if (!isMounted) return;
                setProjekcija(p);
                setPostojece(r);
            })
            .catch((err: unknown) => { if (isMounted) setError(err instanceof Error ? err.message : 'Greška'); })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, [id]);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!id || !ime.trim() || !email.trim()) return;
        setSaving(true);
        setUspeh(null);
        setError(null);
        try {
            await rezervacijaApi.create({ projekcijaId: id, korisnikIme: ime.trim(), korisnikEmail: email.trim() });
            setUspeh('Uspešno ste rezervisali mesto!');
            setIme('');
            setEmail('');
            const [p, r] = await Promise.all([
                projekcijaApi.getById(id),
                rezervacijaApi.getByProjekcija(id),
            ]);
            setProjekcija(p);
            setPostojece(r);
        } catch (err: unknown) {
            let msg = 'Greška pri rezervaciji';
            if (err && typeof err === 'object' && 'response' in err) {
                const resp = (err as { response?: { data?: { title?: string } } }).response;
                msg = resp?.data?.title ?? msg;
            } else if (err instanceof Error) msg = err.message;
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error && !projekcija) return <p style={{ color: 'red' }}>{error}</p>;
    if (!projekcija) return <p>Projekcija nije pronađena.</p>;

    const popunjeno = projekcija.dostupnaMesta <= 0;

    return (
        <div>
            <h2>Rezervacija mesta</h2>

            <div style={infoBoxStyle}>
                <h3 style={{ marginTop: 0 }}>{projekcija.film?.naziv ?? '—'}</h3>
                <p><strong>Sala:</strong> {projekcija.sala?.naziv} ({projekcija.sala?.tip})</p>
                <p><strong>Početak:</strong> {formatDatum(projekcija.vremePocetka)}</p>
                <p><strong>Kraj:</strong> {formatDatum(projekcija.vremeZavrsetka)}</p>
                <p>
                    <strong>Slobodna mesta:</strong>{' '}
                    <span style={{ color: popunjeno ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
                        {projekcija.dostupnaMesta} / {projekcija.ukupnoMesta}
                    </span>
                </p>
            </div>

            {popunjeno ? (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '4px' }}>
                    <p style={{ margin: 0, color: '#dc2626' }}>Žao nam je, sva mesta su popunjena za ovu projekciju.</p>
                    <Link to="/projekcije" style={{ display: 'inline-block', marginTop: '0.5rem' }}>← Nazad na projekcije</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '1rem' }}>
                    <h3>Unesite podatke</h3>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {uspeh && <p style={{ color: '#16a34a' }}>{uspeh}</p>}

                    <div style={formGroup}>
                        <label style={labelStyle}>Ime i prezime *</label>
                        <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} required style={inputStyle} />
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                        <small style={{ color: '#64748b' }}>Jedan email može rezervisati samo jedno mesto po projekciji.</small>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button type="submit" disabled={saving} style={saveBtn}>
                            {saving ? 'Snimanje...' : 'Rezerviši mesto'}
                        </button>
                        {' '}
                        <Link to="/projekcije" style={backBtn}>Odustani</Link>
                    </div>
                </form>
            )}

            {postojece.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>Postojeće rezervacije ({postojece.length})</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        {postojece.map((r) => (
                            <li key={r.id}>
                                {r.korisnikIme} <small style={{ color: '#64748b' }}>({r.korisnikEmail})</small>
                                {' — '}
                                {formatDatum(r.datumRezervacije)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const infoBoxStyle: React.CSSProperties = {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1rem',
};
const formGroup: React.CSSProperties = { marginBottom: '1rem' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.3rem', fontWeight: 'bold', color: '#475569' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' };
const saveBtn: React.CSSProperties = { background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const backBtn: React.CSSProperties = { color: '#475569', textDecoration: 'none', padding: '0.5rem 1rem' };
