using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;
        private readonly IPalestrantePersist _palestrantePersist;
        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist, IEventoPersist eventoPersist, IPalestrantePersist palestrantePersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _palestrantePersist = palestrantePersist;
            _mapper = mapper;
        }

        public async Task<EventoDto> AddEventos(string userId, EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                evento.UserId = userId;
                _geralPersist.Add<Evento>(evento);

                var palestrante = await _palestrantePersist.GetPalestranteByUserIdAsync(userId, false, false);
                
                if(await _geralPersist.SaveChangesAsync())
                {
                    if(palestrante != null){
                        var palestranteEvento = new PalestranteEvento() {PalestranteId = palestrante.Id, EventoId = evento.Id};
                        _geralPersist.Add<PalestranteEvento>(palestranteEvento);
                        await _geralPersist.SaveChangesAsync();
                    }                    

                    return _mapper.Map<EventoDto>(await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false));
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<EventoDto> UpdateEvento(string userId, int eventoId, EventoDto model)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if(evento == null) return null;
                
                model.Id = evento.Id;
                model.UserId = userId;

                _mapper.Map(model, evento);
                
                _geralPersist.Update<Evento>(evento);

                if(await _geralPersist.SaveChangesAsync())
                {
                    return _mapper.Map<EventoDto>(await _eventoPersist.GetEventoByIdAsync(userId, evento.Id, false));
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteEvento(string userId, int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(userId, eventoId, false);
                if(evento == null) throw new Exception("Evento para remover não foi encontrado.");

                _geralPersist.Delete<Evento>(evento);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<EventoDto>> GetAllEventosAsync(string userId, PageParams pageParams, bool includePalestrantes = false)
        {
            try
            {
                var eventos = await _eventoPersist.GetAllEventosAsync(userId, pageParams, includePalestrantes);
                if(eventos == null) return null;

                var resultado = _mapper.Map<PageList<EventoDto>>(eventos);

                resultado.CurrentPage = eventos.CurrentPage;
                resultado.TotalPages = eventos.TotalPages;
                resultado.PageSize = eventos.PageSize;
                resultado.TotalCount = eventos.TotalCount;

                return resultado;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<EventoDto> GetEventoByIdAsync(string userId, int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento =  await _eventoPersist.GetEventoByIdAsync(userId, eventoId, includePalestrantes);
                if(evento == null) return null;

                return _mapper.Map<EventoDto>(evento);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}