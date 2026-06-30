import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Uloga, User } from '../tipove';

interface RoleContextValue {
    uloga: Uloga;
    setUloga: (u: Uloga) => void;
    isAuthenticated: boolean;
    login: (u: Uloga, username?: string) => void;
    logout: () => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    isAdmin: boolean;
    isZaposleni: boolean;
    isKorisnik: boolean;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const STORAGE_KEY = 'filmoteka_uloga';
const AUTH_STORAGE_KEY = 'filmoteka_auth';
const USER_STORAGE_KEY = 'filmoteka_current_user';

function getInitialRole(): Uloga {
    if (typeof window === 'undefined') return 'Korisnik';
    const saved = localStorage.getItem(STORAGE_KEY) as Uloga | null;
    return saved ?? 'Korisnik';
}

function getInitialAuth(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

function getInitialUser(): User | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
}

export function RoleProvider({ children }: { children: ReactNode }) {
    const [uloga, setUlogaState] = useState<Uloga>(getInitialRole);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuth);
    const [currentUser, setCurrentUserState] = useState<User | null>(getInitialUser);

    const setUloga = (u: Uloga) => {
        setUlogaState(u);
        localStorage.setItem(STORAGE_KEY, u);
    };

    const login = (u: Uloga) => {
        setUlogaState(u);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEY, u);
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    };

    const logout = () => {
        setUlogaState('Korisnik');
        setIsAuthenticated(false);
        setCurrentUserState(null);
        localStorage.setItem(STORAGE_KEY, 'Korisnik');
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    };

    const setCurrentUser = (user: User | null) => {
        setCurrentUserState(user);
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    };

    const value: RoleContextValue = {
        uloga,
        setUloga,
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
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