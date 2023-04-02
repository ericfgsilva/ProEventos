using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
        Task<Evento[]> GetAllEventosByTemaAsync(string userId, string tema, bool includePalestrantes = false);
        Task<Evento[]> GetAllEventosAsync(string userId, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(string userId, int eventoId, bool includePalestrantes = false);
    }
}