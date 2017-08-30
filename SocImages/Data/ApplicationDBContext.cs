using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocImages.Models;

namespace SocImages.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Image> Images { get; set; }
        public DbSet<ImageVote> ImageVotes { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ImageVote>().
                HasKey(iv => new { iv.ImageId, iv.UserId });

            builder.Entity<ImageVote>().
                HasOne(iv => iv.Image).
                WithMany(i => i.ImageVotes).
                HasForeignKey(iv => iv.ImageId);

            builder.Entity<ImageVote>().
                HasOne(iv => iv.User).
                WithMany(u => u.ImageVotes).
                HasForeignKey(iv => iv.UserId);
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }
    }
}
