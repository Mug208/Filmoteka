interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div style={containerStyle}>
            <button disabled={page === 1} onClick={() => onPageChange(1)} style={page === 1 ? disabledBtn : btn}>
                « Prva
            </button>
            <button disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} style={page === 1 ? disabledBtn : btn}>
                ‹
            </button>

            {pages.map((p) => (
                <button key={p} onClick={() => onPageChange(p)} style={p === page ? activeBtn : btn}>
                    {p}
                </button>
            ))}

            <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={page === totalPages ? disabledBtn : btn}>
                ›
            </button>
            <button disabled={page === totalPages} onClick={() => onPageChange(totalPages)} style={page === totalPages ? disabledBtn : btn}>
                Poslednja »
            </button>

            <span style={infoStyle}>Strana {page} od {totalPages}</span>
        </div>
    );
}

const containerStyle: React.CSSProperties = {
    display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap',
};
const btn: React.CSSProperties = {
    padding: '0.4rem 0.7rem', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', borderRadius: '4px',
};
const activeBtn: React.CSSProperties = {
    ...btn, background: '#3b82f6', color: 'white', borderColor: '#3b82f6',
};
const disabledBtn: React.CSSProperties = {
    ...btn, opacity: 0.5, cursor: 'not-allowed',
};
const infoStyle: React.CSSProperties = {
    marginLeft: '0.5rem', color: '#64748b', fontSize: '0.9rem',
};