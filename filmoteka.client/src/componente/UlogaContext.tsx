import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Uloga } from '../tipove';

interface RoleContextValue {
    uloga: Uloga;
    setUloga: (u: Uloga) => void;
    isAdmin: boolean;
    isZaposleni: boolean;
    isKorisnik: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = 'filmoteka_uloga';

function getInitial(): Uloga {
    if (typeof window === 'undefined') return 'Korisnik';
    const saved = localStorage.getItem(STORAGE_KEY) as Uloga | null;
    return saved ?? 'Korisnik';
}

export function RoleProvider({ children }: { children: ReactNode }) {
    const [uloga, setUlogaState] = useState<Uloga>(getInitial);

    const setUloga = (u: Uloga) => {
        setUlogaState(u);
        localStorage.setItem(STORAGE_KEY, u);
    };

    const value: RoleContextValue = {
        uloga,
        setUloga,
        isAdmin: uloga === 'Admin',
        isZaposleni: uloga === 'Zaposleni',
        isKorisnik: uloga === 'Korisnik',
    };

    return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
    const ctx = useContext(RoleContext);
    if (!ctx) throw new Error('useRole must be used within RoleProvider');
    return ctx;
}