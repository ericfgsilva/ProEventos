using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProEventos.Domain;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Local { get; set; }
        
        public DateTime DataEvento { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório."),
         StringLength(200, MinimumLength = 3, ErrorMessage = "Intervalo permitido é de 3 a 200 caracteres.")]
        public string Tema { get; set; }
        
        [Display(Name = "Qtd. Pessoas")]
        [Range(1, 120000, ErrorMessage = "O valor no campo {0} deve estar entre 1 e 120000.")]
        public int QtdPessoas { get; set; }
        
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Os formatos aceitos são: .gif | .jpeg | .bmp | .png | .jpg")]
        public string ImageURL { get; set; }
        
        public string ImageAlt { get; set; }
        
        [Required(ErrorMessage = "O campo {0} é obrigatório."), 
         Phone(ErrorMessage = "O campo {0} é inválido."),
         MaxLength(11, ErrorMessage = "O campo {0} permite no máximo 11 caracteres.")]
        public string Telefone { get; set; }
        
        [Display(Name = "e-mail"),
         Required(ErrorMessage = "O campo {0} é obrigatório."), 
         EmailAddress(ErrorMessage = "O {0} é inválido.")]
        public string Email { get; set; }
        public string UserId { get; set; }

        public UserUpdateDto User { get; set; }
        
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteEvento> PalestrantesEventos { get; set; }        
    }
}