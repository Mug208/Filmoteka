import { useEffect, useState, type FormEventHandler } from 'react';
import { zanrApi } from '../api/client';
import type { Zanr } from '../tipove';

export default function ZanrList() {
    const [zanrovi, setZanrovi] = useState<Zanr[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [naziv, setNaziv] = useState('');

    useEffect(() => {
        let isMounted = true;

        zanrApi
            .getAll()
            .then((z) => {
                if (!isMounted) return;
                setZanrovi(z);
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
            const z = await zanrApi.getAll();
            setZanrovi(z);
            setError(null);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Greška';
            setError(message);
        }
    };

    const handleAdd: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!naziv.trim()) return;
        try {
            await zanrApi.create({ naziv: naziv.trim() });
            setNaziv('');
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
        if (!window.confirm('Obrisati žanr?')) return;
        try {
            await zanrApi.remove(id);
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
            <h2>Žanrovi</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '400px' }}>
                <input
                    type="text"
                    value={naziv}
                    onChange={(e) => setNaziv(e.target.value)}
                    placeholder="Naziv žanra"
                    style={{ flex: 1, padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                />
                <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Dodaj
                </button>
            </form>

            {zanrovi.length === 0 ? (
                <p>Nema žanrova.</p>
            ) : (
                <ul style={{ paddingLeft: '1.2rem' }}>
                    {zanrovi.map((z) => (
                        <li key={z.id} style={{ marginBottom: '0.5rem' }}>
                            {z.naziv}
                            {' '}
                            <button onClick={() => handleDelete(z.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                                obriši
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}