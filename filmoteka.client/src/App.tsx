import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './componente/Navbar';
import FilmList from './stranice/FilmList';
import FilmDetails from './stranice/FilmDetalji';
import FilmForm from './stranice/FilmForm';
import ZanrList from './stranice/ZanrList';
import ReziserList from './stranice/ReziserList';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
                <Routes>
                    <Route path="/" element={<FilmList />} />
                    <Route path="/filmovi/novi" element={<FilmForm />} />
                    <Route path="/filmovi/:id" element={<FilmDetails />} />
                    <Route path="/filmovi/:id/izmeni" element={<FilmForm />} />
                    <Route path="/zanrovi" element={<ZanrList />} />
                    <Route path="/reziseri" element={<ReziserList />} />
                    <Route path="*" element={<h2>Stranica nije pronađena</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}