using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ProEventos.Api.Helpers
{
    public class Util : IUtil
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        public Util(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile, string destino)
        {
            var imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ','-');
            
            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
            var diretorio = Path.Combine(_hostEnvironment.ContentRootPath, @$"Resources\{destino}");

            if(!System.IO.File.Exists(diretorio)){
                System.IO.Directory.CreateDirectory(diretorio);
            }
            
            var imagePath = Path.Combine(diretorio, imageName);

            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            
            return imageName;
        }
        
        [NonAction]
        public void DeleteImage(string imageName, string destino)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @$"Resources/{destino}", imageName);
            if(System.IO.File.Exists(imagePath)){
                System.IO.File.Delete(imagePath);
            }
        }
    }
}