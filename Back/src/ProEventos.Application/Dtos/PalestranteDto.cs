using System.Collections.Generic;
using ProEventos.Domain;

namespace ProEventos.Application.Dtos
{
    public class PalestranteDto
    {
        public int Id { get; set; }
        public string MiniCurriculo { get; set; }
        public string UserId { get; set; }
        public UserUpdateDto User { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}