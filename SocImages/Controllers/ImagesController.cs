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
using SocImages.Helpers;

namespace SocImages.Controllers
{
    [Produces("application/json")]
    [Route("api/Images")]
    public class ImagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        private const int maximumImageSize = 1024 * 100; //100kB
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

        [HttpPost("{title}")]
        [Authorize]
        public async Task<IActionResult> PostImage([FromRoute] string title, IFormFile imageFile, string captchaResponse)
        {
            await CaptchaResponseWrapper.ValidateRecaptcha(captchaResponse, ModelState);

            if (imageFile.Length > maximumImageSize)
            {
                ModelState.AddModelError("", String.Format("The uploaded image exceeds maximum size of {0}kB.", maximumImageSize / 1024));
            }

            if (!IsJpgFile(imageFile))
            {
                ModelState.AddModelError("", "Couldn't proccess uploaded file. Please upload a valid JPG file.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (Stream stream = imageFile.OpenReadStream())
            {
                using (var binaryReader = new BinaryReader(stream))
                {
                    var fileContent = binaryReader.ReadBytes((int)imageFile.Length);

                    var newImage = new Image
                    {
                        Title = title,
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
            var image = await _context.Images.Include(i => i.ImageVotes).SingleOrDefaultAsync(i => i.ImageId == id);
            if (image == null)
            {
                return NotFound();
            }

            var userId = User.GetUserId();
            if (image.ImageVotes.Any(v => v.UserId.Equals(userId)))
            {
                return Ok();
            }

            image.Rating += (voteUp ? 1 : -1);
            image.ImageVotes.Add(new ImageVote { Image = image, UserId = User.GetUserId() });

            await _context.SaveChangesAsync();

            return Ok();
        }

        private IActionResult Get(IQueryable<Image> imageQuery, int skip, int take)
        {
            var images = imageQuery.Skip(skip).Take(take);

            return Ok(images);
        }

        private bool IsJpgFile(IFormFile file)
        {
            if (!Path.GetExtension(file.FileName).Equals(".jpg", StringComparison.InvariantCultureIgnoreCase) &&
                 !Path.GetExtension(file.FileName).Equals(".jpeg", StringComparison.InvariantCultureIgnoreCase))
            {
                return false;
            }

            using (Stream stream = file.OpenReadStream())
            {
                using (var binaryReader = new BinaryReader(stream))
                {
                    UInt16 soi = binaryReader.ReadUInt16();  // Start of Image (SOI) marker (FFD8)
                    UInt16 marker = binaryReader.ReadUInt16(); // JFIF marker (FFE0) or EXIF marker(FF01)

                    return soi == 0xd8ff && (marker & 0xe0ff) == 0xe0ff;
                }
            }
        }
    }
}