using Filmoteka.Server.DTOs;

namespace Filmoteka.Server.Services
{
    public interface IZanrService
    {
        Task<IEnumerable<ZanrDto>> DobiSveAsync();
        Task<ZanrDto?> DobiOdIdAsync(Guid id);
        Task<ZanrDto> DodajAsync(KreirajZanrDto dto);
        Task<ZanrDto?> AzurirajAsync(Guid id, KreirajZanrDto dto);
        Task<bool> ObrisiAsync(Guid id);
    }
}
