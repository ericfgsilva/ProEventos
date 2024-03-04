using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ProEventos.Persistence.Models;
using ProEventos.Api.Helpers;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IEventoService _eventoService;
        private readonly IUtil _util;

        public readonly IAccountService _accountService;

        private readonly string _destino = "Images"; 

        public EventosController(IEventoService eventoService, 
                                 IUtil util,
                                 IAccountService accountService)
        {
            _eventoService = eventoService;
            _util = util;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), pageParams, true);
                
                Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);

                return eventos == null? NoContent() : Ok(eventos);

            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                                       $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                return evento == null? NoContent() : Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                        $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = await _eventoService.AddEventos(User.GetUserId(), model);
                return evento == null ? NoContent() : Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                        $"Erro ao tentar adicionar evento. Erro: {ex.Message}");
            }
        }

        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId);
                if(evento == null) return NoContent();

                var file = Request.Form.Files[0];

                if(file.Length > 0)
                {
                    if(evento.ImageURL != null && evento.ImageURL != ""){
                        _util.DeleteImage(evento.ImageURL, _destino);
                    }
                    evento.ImageURL = await _util.SaveImage(file, _destino);
                    evento.ImageAlt = file.FileName;
                }
                var EventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);

                return Ok(EventoRetorno);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                        $"Erro ao tentar alterar imagem do evento. Erro: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateById(int id, EventoDto model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
                return evento == null ? NoContent() : Ok(evento);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                        $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if(evento == null) return NoContent();


                if(await _eventoService.DeleteEvento(User.GetUserId(), id))
                {
                    _util.DeleteImage(evento.ImageURL, _destino);
                    return Ok(new { result = true });
                }
                else
                {
                    throw new Exception("Ocorreu um problema não específico ao tentar excluir o evento.");
                }
                
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                                        $"Erro ao tentar deletar o evento. Erro: {ex.Message}");
            }
        }
    }
}
