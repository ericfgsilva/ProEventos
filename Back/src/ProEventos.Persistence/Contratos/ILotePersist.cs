using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        /// <summary>
        /// Método get que retorna um array de lote relacionado a um evento
        /// </summary>
        /// <param name="eventoId">Código chave do lote ao qual o lote pertence</param>
        /// <returns>Array de lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        /// <summary>
        /// Método get que retorna um lote relacionado ao id de evento e de lote enviados
        /// </summary>
        /// <param name="eventoId">Código chave do lote ao qual o lote pertence</param>
        /// <param name="id">Código chave do lote</param>
        /// <returns>Apenas 1 lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
    }
}