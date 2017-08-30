using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SocImages.Models
{
    public class ImageVote
    {
        public int ImageId { get; set; }

        public string UserId { get; set; }

        public Image Image { get; set; }

        public ApplicationUser User { get; set; }
    }
}
