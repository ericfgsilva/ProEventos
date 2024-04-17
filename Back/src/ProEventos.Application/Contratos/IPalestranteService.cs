using System.Threading.Tasks;
using ProEventos.Application.Dtos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application.Contratos
{
    public interface IPalestranteService
    {
        Task<PalestranteDto> AddPalestrante(string userId, PalestranteAddDto model);
        Task<PalestranteDto> UpdatePalestrante(string userId, PalestranteUpdateDto model);
        Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<PalestranteDto> GetPalestranteByUserIdAsync(string userId, bool includeEventos = false, bool includeRedesSociais = false);
    }
}