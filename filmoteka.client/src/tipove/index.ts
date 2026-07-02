
export interface Zanr {
    id: string;
    naziv: string;
}

export interface CreateZanr {
    naziv: string;
}

export interface Reziser {
    id: string;
    ime: string;
    prezime: string;
    datumRodjenja?: string | null;
    punoIme?: string;
}

export interface CreateReziser {
    ime: string;
    prezime: string;
    datumRodjenja?: string | null;
}

export interface Film {
    id: string;
    naziv: string;
    godina: number;
    opis?: string | null;
    zanr?: Zanr | null;
    reziseri: Reziser[];
    dostupnoUBioskopu: boolean;
}

export interface CreateFilm {
    naziv: string;
    godina: number;
    opis?: string | null;
    zanrId: string;
    reziseriIds: string[];
    dostupnoUBioskopu: boolean;
}

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type TipSale = 'Standard' | 'ThreeD' | 'IMAX';

export interface Sala {
    id: string;
    naziv: string;
    kapacitet: number;
    tip: string;
    imaProjekcije: boolean;
}

export interface CreateSala {
    naziv: string;
    kapacitet: number;
    tip: string;
}

export interface Projekcija {
    id: string;
    film?: Film | null;
    sala?: Sala | null;
    vremePocetka: string;
    vremeZavrsetka: string;
    dostupnaMesta: number;
    ukupnoMesta: number;
    status: 'Aktivna' | 'Otkazana';
}

export interface CreateProjekcija {
    filmId: string;
    salaId: string;
    vremePocetka: string;
    vremeZavrsetka: string;
}

export interface Rezervacija {
    id: string;
    projekcijaId: string;
    korisnikIme: string;
    korisnikEmail: string;
    datumRezervacije: string;
    projekcija?: Projekcija | null;
}

export interface CreateRezervacija {
    projekcijaId: string;
    korisnikIme: string;
    korisnikEmail: string;
}

export type Uloga = 'Admin' | 'Zaposleni' | 'Korisnik';

export interface User {
    id: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
    role: Uloga;
    status?: 'NaCekanju' | 'Odobren';
}