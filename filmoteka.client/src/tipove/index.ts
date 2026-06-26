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
    dostupnoUBioskopu: boolean;
    zanr?: Zanr | null;
    reziseri: Reziser[];
}

export interface CreateFilm {
    naziv: string;
    godina: number;
    opis?: string | null;
    dostupnoUBioskopu: boolean;
    zanrId: string;
    reziseriIds: string[];
}

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}