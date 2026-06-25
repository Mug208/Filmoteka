using Filmoteka.Server.DTOs;

namespace Filmoteka.Server.Services
{
    public interface IReziserService
    {
        Task<IEnumerable<ReziserDto>> DobiSveAsync();
        Task<ReziserDto?> DobiOdIdAsync(Guid id);
        Task<ReziserDto> DodajAsync(KreirajReziserDto dto);
        Task<ReziserDto?> AzurirajAsync(Guid id, KreirajReziserDto dto);
        Task<bool> ObrisiAsync(Guid id);
    }
}
