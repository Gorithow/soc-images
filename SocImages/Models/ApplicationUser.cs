using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace SocImages.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<ImageVote> ImageVotes { get; set; }
    }
}
