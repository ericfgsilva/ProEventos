using AutoMapper;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Models;

namespace ProEventos.Application.Helpers
{
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile()
        {
            // CreateMap<Evento, EventoDto>()
            //         .ForMember(dto => dto.DataEvento, m => m.MapFrom(ev => ev.DataEvento.Value.ToString("yyyy-MM-ddTHH:mm")))
            //         .ReverseMap();

            // CreateMap<Lote, LoteDto>()
            //         .ForMember(dto => dto.DataInicio, m => m.MapFrom(lt => lt.DataInicio.HasValue ? lt.DataInicio.Value.ToString("yyyy-MM-ddTHH:mm") : null))
            //             .ForMember(dto => dto.DataFim, m => m.MapFrom(lt => lt.DataFim.HasValue ? lt.DataFim.Value.ToString("yyyy-MM-ddTHH:mm") : null))
            //         .ReverseMap();


            CreateMap<Evento, EventoDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();
            
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();
        }
        
    }
}