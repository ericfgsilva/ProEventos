using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Api.Helpers;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _util;
        private readonly string _destino = "Perfil";

        public AccountController(IAccountService accountService,
                                 ITokenService tokenService,
                                 IUtil util)
        {
            _util = util;
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();
                var user = await _accountService.GetUserByUserNameAsync(userName);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser(UserDto userDto)
        {
            try
            {
                if(await _accountService.UserExists(userDto.UserName)){

                    return BadRequest("Usuário já existe.");
                }

                var user = await _accountService.CreateAccountAsync(userDto);
                if(user != null){

                    return Ok(new {
                        UserName = user.UserName,
                        PrimeiroNome = user.PrimeiroNome,
                        Token = _tokenService.CreateToken(user).Result
                    });
                }
                
                return BadRequest("Usuário não foi criado, tente novamente mais tarde.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar registrar o usuário. Erro: {ex.Message}");
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                if(userUpdateDto.UserName != User.GetUserName())
                    return Unauthorized("Usuário Inválido");

                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if(user == null) return Unauthorized("Usuário inválido.");

                var userReturn = await _accountService.UpdateAccount(userUpdateDto);
                if(userReturn == null) return NoContent();
                
                return Ok(new 
                {
                    UserName = userReturn.UserName,
                    PrimeiroNome = userReturn.PrimeiroNome,
                    Token = _tokenService.CreateToken(userReturn).Result
                });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar o usuário. Erro: {ex.Message}");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(userLoginDto.UserName);
                if(user == null) return Unauthorized("Usuário ou senha estão incorretos.");
                
                var result = await _accountService.CheckUserPasswordAsync(user, userLoginDto.Password);
                if(!result.Succeeded) return Unauthorized("Usuário ou senha estão incorretos.");

                return Ok(new
                    {
                       UserName = user.UserName,
                       PrimeiroNome = user.PrimeiroNome,
                       Token = _tokenService.CreateToken(user).Result
                    });
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar realizar login. Erro: {ex.Message}");
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var user = await _accountService.GetUserById(User.GetUserId());
                if(user == null) return NoContent();

                var file = Request.Form.Files[0];

                if(file.Length > 0)
                {
                    if(user.ImagemURL != null && user.ImagemURL != ""){
                        _util.DeleteImage(user.ImagemURL, _destino);
                    }
                    user.ImagemURL = await _util.SaveImage(file, _destino);
                }
                var userRetorno = await _accountService.UpdateAccount(user);

                return Ok(userRetorno);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                        $"Erro ao tentar realizar upload de foto do usuário. Erro: {ex.Message}");
            }
        }
    }
}