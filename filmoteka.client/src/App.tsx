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
import type { JSX } from 'react';

function AdminOnly({ children }: { children: JSX.Element }) {
    const { isAdmin } = useRole();
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}

function AdminOrZaposleni({ children }: { children: JSX.Element }) {
    const { isAdmin, isZaposleni } = useRole();
    if (!isAdmin && !isZaposleni) return <Navigate to="/" replace />;
    return children;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
                <Routes>
                    <Route path="/" element={<FilmList />} />
                    <Route path="/filmovi/novi" element={<AdminOrZaposleni><FilmForm /></AdminOrZaposleni>} />
                    <Route path="/filmovi/:id" element={<FilmDetails />} />
                    <Route path="/filmovi/:id/izmeni" element={<AdminOrZaposleni><FilmForm /></AdminOrZaposleni>} />
                    <Route path="/zanrovi" element={<AdminOrZaposleni><ZanrList /></AdminOrZaposleni>} />
                    <Route path="/reziseri" element={<AdminOrZaposleni><ReziserList /></AdminOrZaposleni>} />
                    <Route path="/sale" element={<AdminOnly><SalaList /></AdminOnly>} />
                    <Route path="/projekcije" element={<ProjekcijaList />} />
                    <Route path="/projekcije/novi" element={<AdminOrZaposleni><ProjekcijaForm /></AdminOrZaposleni>} />
                    <Route path="/rezervisi/:id" element={<RezervacijaForm />} />

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