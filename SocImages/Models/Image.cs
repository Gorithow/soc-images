using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SocImages.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime CreatedDate
        {
            get => _createdDate ?? DateTime.Now;
            set => _createdDate = value;
        }

        [Required]
        [DataType(DataType.Upload)]
        [JsonIgnore]
        public byte[] ImageData { get; set; }

        [Required]
        [JsonIgnore]
        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        [JsonIgnore]
        public ApplicationUser Owner { get; set; }

        [DefaultValue(0)]
        public int Rating { get; set; }

        private DateTime? _createdDate;
    }
}