using System.Threading.Tasks;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application.Contratos
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(string userId, EventoDto model);
        Task<EventoDto> UpdateEvento(string userId, int eventoId, EventoDto model);
        Task<bool> DeleteEvento(string userId, int eventoId);

        Task<PageList<EventoDto>> GetAllEventosAsync(string userId, PageParams pageParams, bool includePalestrantes = false);
        Task<EventoDto> GetEventoByIdAsync(string userId, int EventoId, bool includePalestrantes = false);
    }
}