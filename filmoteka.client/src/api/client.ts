import axios from 'axios';
import type {
    Film,
    CreateFilm,
    Zanr,
    CreateZanr,
    Reziser,
    CreateReziser,
    PagedResult,
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
        dostupnoUBioskopu?: boolean,
    ): Promise<PagedResult<Film>> => {
        const params: Record<string, unknown> = { page, pageSize };
        if (query) params.query = query;
        if (zanrId) params.zanrId = zanrId;
        if (godina) params.godina = godina;
        if (dostupnoUBioskopu !== undefined) params.dostupnoUBioskopu = dostupnoUBioskopu;

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