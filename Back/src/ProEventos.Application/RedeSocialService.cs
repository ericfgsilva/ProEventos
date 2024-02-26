using System;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocialPersist _redeSocialPersist;
        private readonly IMapper _mapper;

        public RedeSocialService(IRedeSocialPersist redeSocialPersist, IMapper mapper)
        {
            _redeSocialPersist = redeSocialPersist;
            _mapper = mapper;
        }

        public async Task<RedeSocialDto[]> SaveByEvento(int id, RedeSocialDto[] models)
        {
            try
            {   
                foreach(var model in models){

                    if(model.Id == 0)
                    {
                        await AddRedeSocial(id, model, true);
                    }else
                    {
                        await UpdateRedeSocial(id, model, true);
                    }
                }
                
                return _mapper.Map<RedeSocialDto[]>(await _redeSocialPersist.GetAllByEventoIdAsync(id));                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            try
            {   
                foreach(var model in models){

                    if(model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }else
                    {
                        await UpdateRedeSocial(palestranteId, model, false);
                    }
                }
                
                return _mapper.Map<RedeSocialDto[]>(await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId));                
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddRedeSocial(int id, RedeSocialDto model, bool isEvento)
        {
            try
            {
                if(isEvento){
                    model.EventoId = id;
                    model.PalestranteId = null;
                }else{
                    model.PalestranteId = id;
                    model.EventoId = null;
                }

                _redeSocialPersist.Add<RedeSocial>(_mapper.Map<RedeSocial>(model));

                await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateRedeSocial(int id, RedeSocialDto model, bool isEvento)
        {
            var redeSocial = isEvento ? 
                               await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(id, model.Id) : 
                               await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(id, model.Id);
            
            try
            {
                if(isEvento){
                    model.EventoId = id;
                    model.PalestranteId = null;
                }else{
                    model.PalestranteId = id;
                    model.EventoId = null;
                } 
                
                _redeSocialPersist.Update<RedeSocial>(_mapper.Map(model, redeSocial));

                await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);

                if(redeSocial == null) throw new Exception("Rede Social por evento para remover não foi encontrada.");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);

                if(redeSocial == null) throw new Exception("Rede Social por palestrante para remover não foi encontrada.");

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if(redesSociais == null) return null;

                return _mapper.Map<RedeSocialDto[]>(redesSociais);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial =  await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if(redeSocial == null) return null;

                return _mapper.Map<RedeSocialDto>(redeSocial);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId)
        {
            try
            {
                var redesSociais = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if(redesSociais == null) return null;

                return _mapper.Map<RedeSocialDto[]>(redesSociais);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial =  await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if(redeSocial == null) return null;

                return _mapper.Map<RedeSocialDto>(redeSocial);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}