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
    [Route("api/Images")]
    public class ImagesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string _imageContentType = "image/jpg";

        public ImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var image = await _context.Images.SingleOrDefaultAsync(m => m.ImageId == id);

            if (image == null)
            {
                return NotFound();
            }

            return File(image.ImageData, _imageContentType);
        }

        [HttpGet("Count")]
        [AllowAnonymous]
        public async Task<IActionResult> Count()
        {
            int imagesCount = await _context.Images.CountAsync();

            return Ok(imagesCount);
        }

        [HttpGet("ByUploadDate")]
        [AllowAnonymous]
        public IActionResult ByUploadDate(int skip, int take)
        {
            var imagesByUploadDate = _context.Images.OrderByDescending(i => i.CreatedDate);

            return Get(imagesByUploadDate, skip, take);
        }

        [HttpGet("ByRate")]
        [AllowAnonymous]
        public IActionResult ByRate(int skip, int take)
        {
            var imagesByRateDate = _context.Images.OrderByDescending(i => i.Rating);

            return Get(imagesByRateDate, skip, take);
        }

        [HttpPost("")]
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

        [HttpPost("{id}/VoteUp")]
        [Authorize]
        public async Task<IActionResult> VoteUp(int id)
        {
            return await Vote(id);
        }

        [HttpPost("{id}/VoteDown")]
        [Authorize]
        public async Task<IActionResult> VoteDown(int id)
        {
            return await Vote(id, false);
        }

        private async Task<IActionResult> Vote(int id, bool voteUp = true)
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

        private IActionResult Get(IQueryable<Image> imageQuery, int skip, int take)
        {
            var images = imageQuery.Skip(skip).Take(take);

            return Ok(images);
        }
    }
}