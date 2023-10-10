using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        Task<PageList<Evento>> GetAllEventosAsync(string userId, PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(string userId, int eventoId, bool includePalestrantes = false);
    }
}