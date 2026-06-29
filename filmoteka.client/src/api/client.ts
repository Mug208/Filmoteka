import axios from 'axios';
import type {
    Film,
    CreateFilm,
    Zanr,
    CreateZanr,
    Reziser,
    CreateReziser,
    PagedResult,
    Sala,
    CreateSala,
    Projekcija,
    CreateProjekcija,
    Rezervacija,
    CreateRezervacija,
} from '../tipove';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

export const filmApi = {
    getPaged: async (
        page: number,
        pageSize: number = 5,
        query?: string,
        zanrId?: string,
        godina?: number,
        dostupnoUBioskopu?: boolean
    ): Promise<PagedResult<Film>> => {
        const params: Record<string, unknown> = { page, pageSize };
        if (query) params.query = query;
        if (zanrId) params.zanrId = zanrId;
        if (typeof godina === 'number') params.godina = godina;
        if (dostupnoUBioskopu) params.dostupnoUBioskopu = true;

        const res = await api.get<PagedResult<Film>>('/films', { params });
        return res.data;
    },

    getById: async (id: string): Promise<Film> => {
        const res = await api.get<Film>(`/films/${id}`);
        return res.data;
    },

    create: async (data: CreateFilm): Promise<Film> => {
        const res = await api.post<Film>('/films', data);
        return res.data;
    },

    update: async (id: string, data: CreateFilm): Promise<Film> => {
        const res = await api.put<Film>(`/films/${id}`, data);
        return res.data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/films/${id}`);
    },
};

export const zanrApi = {
    getAll: async (): Promise<Zanr[]> => {
        const res = await api.get<Zanr[]>('/zanrs');
        return res.data;
    },
    create: async (data: CreateZanr): Promise<Zanr> => {
        const res = await api.post<Zanr>('/zanrs', data);
        return res.data;
    },
    update: async (id: string, data: CreateZanr): Promise<Zanr> => {
        const res = await api.put<Zanr>(`/zanrs/${id}`, data);
        return res.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/zanrs/${id}`);
    },
};

export const reziserApi = {
    getAll: async (): Promise<Reziser[]> => {
        const res = await api.get<Reziser[]>('/rezisers');
        return res.data;
    },
    create: async (data: CreateReziser): Promise<Reziser> => {
        const res = await api.post<Reziser>('/rezisers', data);
        return res.data;
    },
    update: async (id: string, data: CreateReziser): Promise<Reziser> => {
        const res = await api.put<Reziser>(`/rezisers/${id}`, data);
        return res.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/rezisers/${id}`);
    },
};

export default api;

export const salaApi = {
    getAll: async (): Promise<Sala[]> => {
        const res = await api.get<Sala[]>('/sales');
        return res.data;
    },
    create: async (data: CreateSala): Promise<Sala> => {
        const res = await api.post<Sala>('/sales', data);
        return res.data;
    },
    update: async (id: string, data: CreateSala): Promise<Sala> => {
        const res = await api.put<Sala>(`/sales/${id}`, data);
        return res.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/sales/${id}`);
    },
};

export const projekcijaApi = {
    getAll: async (): Promise<Projekcija[]> => {
        const res = await api.get<Projekcija[]>('/projekcijas');
        return res.data;
    },
    getDostupne: async (): Promise<Projekcija[]> => {
        const res = await api.get<Projekcija[]>('/projekcijas', { params: { dostupne: true } });
        return res.data;
    },
    getById: async (id: string): Promise<Projekcija> => {
        const res = await api.get<Projekcija>(`/projekcijas/${id}`);
        return res.data;
    },
    create: async (data: CreateProjekcija): Promise<Projekcija> => {
        const res = await api.post<Projekcija>('/projekcijas', data);
        return res.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/projekcijas/${id}`);
    },
};

export const rezervacijaApi = {
    getAll: async (): Promise<Rezervacija[]> => {
        const res = await api.get<Rezervacija[]>('/rezervacijas');
        return res.data;
    },
    getByProjekcija: async (projekcijaId: string): Promise<Rezervacija[]> => {
        const res = await api.get<Rezervacija[]>(`/rezervacijas?projekcijaId=${projekcijaId}`);
        return res.data;
    },
    create: async (data: CreateRezervacija): Promise<Rezervacija> => {
        const res = await api.post<Rezervacija>('/rezervacijas', data);
        return res.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/rezervacijas/${id}`);
    },
};