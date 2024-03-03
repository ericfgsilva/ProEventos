using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public class PalestranteService : IPalestranteService
    {
        private readonly IAccountService _accountService;
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IMapper _mapper;

        public PalestranteService(IPalestrantePersist palestrantePersist, IMapper mapper, IAccountService accountService)
        {
            _accountService = accountService;
            _palestrantePersist = palestrantePersist;
            _mapper = mapper;
        }

        public async Task<PalestranteDto> AddPalestrante(string userId, PalestranteAddDto model)
        {
            try
            {
                var palestrante = _mapper.Map<Palestrante>(model);
                palestrante.UserId = Guid.Parse(userId);

                _palestrantePersist.Add<Palestrante>(palestrante);

                if(await _palestrantePersist.SaveChangesAsync())
                {
                    var palestranteRetorno = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);

                    return _mapper.Map<PalestranteDto>(palestranteRetorno);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<PalestranteDto> UpdatePalestrante(string userId, PalestranteUpdateDto model)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false);
                if(palestrante == null) return null;
                
                model.Id = palestrante.Id;
                model.UserId = userId;

                _mapper.Map(model, palestrante);
                
                _palestrantePersist.Update<Palestrante>(palestrante);

                if(await _palestrantePersist.SaveChangesAsync())
                {
                    return _mapper.Map<PalestranteDto>(await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false));
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<PalestranteDto>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            try
            {
                var palestrante = await _palestrantePersist.GetAllPalestrantesAsync(pageParams, includeEventos);
                if(palestrante == null) return null;

                var resultado = _mapper.Map<PageList<PalestranteDto>>(palestrante);

                resultado.CurrentPage = palestrante.CurrentPage;
                resultado.TotalPages = palestrante.TotalPages;
                resultado.PageSize = palestrante.PageSize;
                resultado.TotalCount = palestrante.TotalCount;

                return resultado;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PalestranteDto> GetPalestranteByUserIdAsync(string userId, bool includeEventos = false)
        {
            try
            {
                var palestrante =  await _palestrantePersist.GetPalestranteByUserIdAsync(userId, includeEventos);
                if(palestrante == null) return null;

                return _mapper.Map<PalestranteDto>(palestrante);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}