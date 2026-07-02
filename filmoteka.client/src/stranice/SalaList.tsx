import { useEffect, useState, type FormEventHandler } from 'react';
import { salaApi } from '../api/client';
import type { Sala } from '../tipove';

const TIPOVI = ['Standard', 'ThreeD', 'IMAX'];

export default function SalaList() {
    const [sale, setSale] = useState<Sala[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [naziv, setNaziv] = useState('');
    const [kapacitet, setKapacitet] = useState<number>(50);
    const [tip, setTip] = useState('Standard');

    const reload = async () => {
        try {
            const s = await salaApi.getAll();
            setSale(s);
            setError(null);
        } catch (err: unknown) {
            const m = err instanceof Error ? err.message : 'Greška';
            setError(m);
        }
    };

    useEffect(() => {
        let isMounted = true;
        salaApi
            .getAll()
            .then((s) => { if (isMounted) { setSale(s); setError(null); } })
            .catch((err: unknown) => { if (isMounted) setError(err instanceof Error ? err.message : 'Greška'); })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, []);

    const handleAdd: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!naziv.trim()) return;
        try {
            await salaApi.create({ naziv: naziv.trim(), kapacitet, tip });
            setNaziv('');
            setKapacitet(50);
            setTip('Standard');
            await reload();
        } catch (err: unknown) {
            let msg = 'Greška';
            if (err && typeof err === 'object' && 'response' in err) {
                const r = (err as { response?: { data?: { title?: string } } }).response;
                msg = r?.data?.title ?? msg;
            } else if (err instanceof Error) msg = err.message;
            alert(msg);
        }
    };

    const handleDelete = async (id: string, naziv: string) => {
        if (!window.confirm(`Obrisati salu "${naziv}"?`)) return;
        try {
            await salaApi.remove(id);
            await reload();
        } catch (err: unknown) {
            let msg = 'Greška';
            if (err && typeof err === 'object' && 'response' in err) {
                const r = (err as { response?: { data?: { title?: string } } }).response;
                msg = r?.data?.title ?? msg;
            } else if (err instanceof Error) msg = err.message;
            alert(msg);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Sale</h2>

            <form onSubmit={handleAdd} style={formStyle}>
                <input
                    type="text"
                    value={naziv}
                    onChange={(e) => setNaziv(e.target.value)}
                    placeholder="Naziv sale"
                    required
                    style={inputStyle}
                />
                <input
                    type="number"
                    value={kapacitet}
                    onChange={(e) => setKapacitet(parseInt(e.target.value) || 0)}
                    min={1}
                    max={1000}
                    required
                    style={{ ...inputStyle, maxWidth: '100px' }}
                />
                <select value={tip} onChange={(e) => setTip(e.target.value)} style={inputStyle}>
                    {TIPOVI.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="submit" style={btnStyle}>Dodaj salu</button>
            </form>

            {sale.length === 0 ? (
                <p>Nema sala.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Naziv</th>
                            <th style={thStyle}>Kapacitet</th>
                            <th style={thStyle}>Tip</th>
                            <th style={thStyle}>Projekcije</th>
                            <th style={thStyle}>Akcija</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.map((s) => (
                            <tr key={s.id}>
                                <td style={tdStyle}>{s.naziv}</td>
                                <td style={tdStyle}>{s.kapacitet}</td>
                                <td style={tdStyle}>{s.tip}</td>
                                <td style={tdStyle}>{s.imaProjekcije ? 'Da' : '—'}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(s.id, s.naziv)}
                                        disabled={s.imaProjekcije}
                                        style={s.imaProjekcije ? disabledBtn : deleteBtn}
                                        title={s.imaProjekcije ? 'Ne može se obrisati - ima zakazane projekcije' : ''}
                                    >
                                        Obriši
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const formStyle: React.CSSProperties = { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' };
const inputStyle: React.CSSProperties = { padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' };
const btnStyle: React.CSSProperties = { background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
const thStyle: React.CSSProperties = { textAlign: 'center', padding: '0.6rem', background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' };
const tdStyle: React.CSSProperties = { padding: '0.6rem', borderBottom: '1px solid #e2e8f0' };
const deleteBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 };
const disabledBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#94a3b8', cursor: 'not-allowed', padding: 0 };