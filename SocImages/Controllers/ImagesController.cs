using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocImages.Data;
using SocImages.Models;
using System.IO;
using SocImages.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace SocImages.Controllers
{
    [Produces("application/json")]
    public class ImagesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string _imageContentType = "image/jpg";

        public ImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetImage(int id)
        {
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageId == id);

            if (image == null)
            {
                return NotFound();
            }

            return File(image.ImageData, _imageContentType);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetImagesCount()
        {
            int imagesCount = await _context.Images.CountAsync();

            return Ok(imagesCount);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetByUploadDate(int skip, int take)
        {
            var imagesByUploadDate = _context.Images.OrderByDescending(i => i.CreatedDate);

            return GetImages(imagesByUploadDate, skip, take);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetByRate(int skip, int take)
        {
            var imagesByRateDate = _context.Images.OrderByDescending(i => i.CreatedDate);

            return GetImages(imagesByRateDate, skip, take);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostImage(IFormFile imageFile)
        {
            using (Stream stream = imageFile.OpenReadStream())
            {
                using (var binaryReader = new BinaryReader(stream))
                {
                    var fileContent = binaryReader.ReadBytes((int)imageFile.Length);

                    var newImage = new Image
                    {
                        Title = imageFile.FileName,
                        ImageData = fileContent,
                        OwnerId = this.User.GetUserId()
                    };

                    _context.Add(newImage);

                    await _context.SaveChangesAsync();

                    return Ok();
                }
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> VoteForImage(int id, bool voteUp = true)
        {
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageId == id);
            if (image == null)
            {
                return NotFound();
            }

            image.Rating += (voteUp ? 1 : -1);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private IActionResult GetImages(IQueryable<Image> imageQuery, int skip, int take)
        {
            var images = imageQuery.Skip(skip).Take(take);

            return Ok(images);
        }
    }
}