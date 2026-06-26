import { useEffect, useState, type FormEventHandler } from 'react';
import { reziserApi } from '../api/client';
import type { Reziser } from '../tipove';

export default function ReziserList() {
    const [reziseri, setReziseri] = useState<Reziser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [datumRodjenja, setDatumRodjenja] = useState('');

    useEffect(() => {
        let isMounted = true;

        reziserApi
            .getAll()
            .then((r) => {
                if (!isMounted) return;
                setReziseri(r);
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
    }, []);

    const reload = async () => {
        try {
            const r = await reziserApi.getAll();
            setReziseri(r);
            setError(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Greška';
            setError(message);
        }
    };

    const handleAdd: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!ime.trim() || !prezime.trim()) return;
        try {
            await reziserApi.create({
                ime: ime.trim(),
                prezime: prezime.trim(),
                datumRodjenja: datumRodjenja || null,
            });
            setIme('');
            setPrezime('');
            setDatumRodjenja('');
            await reload();
        } catch (err: unknown) {
            let msg = 'Greška';
            if (err && typeof err === 'object' && 'response' in err) {
                const resp = (err as { response?: { data?: { title?: string; message?: string } } }).response;
                msg = resp?.data?.title || resp?.data?.message || msg;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            alert(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Obrisati režisera?')) return;
        try {
            await reziserApi.remove(id);
            await reload();
        } catch (err: unknown) {
            let msg = 'Greška';
            if (err instanceof Error) msg = err.message;
            alert(msg);
        }
    };

    if (loading) return <p>Učitavanje...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Režiseri</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', maxWidth: '700px' }}>
                <input
                    type="text"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                    placeholder="Ime"
                    style={{ flex: '1 1 120px', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <input
                    type="text"
                    value={prezime}
                    onChange={(e) => setPrezime(e.target.value)}
                    placeholder="Prezime"
                    style={{ flex: '1 1 120px', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <input
                    type="date"
                    value={datumRodjenja}
                    onChange={(e) => setDatumRodjenja(e.target.value)}
                    style={{ padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Dodaj
                </button>
            </form>

            {reziseri.length === 0 ? (
                <p>Nema režisera.</p>
            ) : (
                <ul style={{ paddingLeft: '1.2rem' }}>
                    {reziseri.map((r) => (
                        <li key={r.id} style={{ marginBottom: '0.5rem' }}>
                            {r.ime} {r.prezime}
                            {r.datumRodjenja && (
                                <span style={{ color: '#64748b' }}>
                                    {' '}({new Date(r.datumRodjenja).toLocaleDateString('sr-RS')})
                                </span>
                            )}
                            {' '}
                            <button onClick={() => handleDelete(r.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                                obriši
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}