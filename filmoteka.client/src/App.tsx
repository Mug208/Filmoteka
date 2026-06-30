import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider, useRole } from './componente/UlogaContext';
import Navbar from './componente/Navbar';
import FilmList from './stranice/FilmList';
import FilmDetails from './stranice/FilmDetalji';
import FilmForm from './stranice/FilmForm';
import ZanrList from './stranice/ZanrList';
import ReziserList from './stranice/ReziserList';
import SalaList from './stranice/SalaList';
import ProjekcijaList from './stranice/ProjekcijaList';
import ProjekcijaForm from './stranice/ProjekcijaForm';
import RezervacijaForm from './stranice/RezervacijaForm';
import LoginPage from './stranice/LoginStrana';
import UsersList from './stranice/KorisniciList';
import type { JSX } from 'react';

function AuthGate({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useRole();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

function AdminOnly({ children }: { children: JSX.Element }) {
    const { isAdmin, isAuthenticated } = useRole();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}

function AdminOrZaposleni({ children }: { children: JSX.Element }) {
    const { isAdmin, isZaposleni, isAuthenticated } = useRole();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin && !isZaposleni) return <Navigate to="/" replace />;
    return children;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<FilmList />} />
                    <Route path="/filmovi/novi" element={<AuthGate><AdminOrZaposleni><FilmForm /></AdminOrZaposleni></AuthGate>} />
                    <Route path="/filmovi/:id" element={<FilmDetails />} />
                    <Route path="/filmovi/:id/izmeni" element={<AuthGate><AdminOrZaposleni><FilmForm /></AdminOrZaposleni></AuthGate>} />
                    <Route path="/zanrovi" element={<AuthGate><AdminOrZaposleni><ZanrList /></AdminOrZaposleni></AuthGate>} />
                    <Route path="/reziseri" element={<AuthGate><AdminOrZaposleni><ReziserList /></AdminOrZaposleni></AuthGate>} />
                    <Route path="/sale" element={<AuthGate><AdminOnly><SalaList /></AdminOnly></AuthGate>} />
                    <Route path="/korisnici" element={<AuthGate><AdminOnly><UsersList /></AdminOnly></AuthGate>} />
                    <Route path="/projekcije" element={<AuthGate><ProjekcijaList /></AuthGate>} />
                    <Route path="/projekcije/novi" element={<AuthGate><AdminOrZaposleni><ProjekcijaForm /></AdminOrZaposleni></AuthGate>} />
                    <Route path="/rezervisi/:id" element={<AuthGate><RezervacijaForm /></AuthGate>} />

                    <Route path="*" element={<h2>Stranica nije pronađena</h2>} />
                </Routes>
            </main>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <RoleProvider>
                <AppRoutes />
            </RoleProvider>
        </BrowserRouter>
    );
}