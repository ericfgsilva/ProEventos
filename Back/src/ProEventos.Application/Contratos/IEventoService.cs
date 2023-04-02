using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(string userId, EventoDto model);
        Task<EventoDto> UpdateEvento(string userId, int eventoId, EventoDto model);
        Task<bool> DeleteEvento(string userId, int eventoId);

        Task<EventoDto[]> GetAllEventosAsync(string userId, bool includePalestrantes = false);
        Task<EventoDto[]> GetAllEventosByTemaAsync(string userId, string Tema, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(string userId, int EventoId, bool includePalestrantes = false);
    }
}