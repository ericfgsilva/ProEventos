using System;
using System.Collections.Generic;
using ProEventos.Domain.Identity;

namespace ProEventos.Domain
{
    //[Table("EventosDetalhes")] --para utilizar o nome da tabela e correlacioanr ao nome definido no código.(ex: no banco é EventosDetalhes e no código c# é Evento)
    public class Evento
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }
        public string Tema { get; set; }
        public int QtdPessoas { get; set; }
        public string ImageURL { get; set; }
        public string ImageAlt { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public IEnumerable<Lote> Lotes { get; set; }
        public IEnumerable<RedeSocial> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }
    }
}