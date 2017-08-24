using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SocImages.Models;

namespace SocImages.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AccountController>();
        }

        private IActionResult GetErrorResult(IdentityResult result)
        {
            if (result.Errors != null)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                }
            }

            return BadRequest(ModelState);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Register(string userName, string password)
        {
            if (userName == null || password == null)
            {
                return BadRequest();
            }

            var user = new ApplicationUser { UserName = userName };

            var result = await _userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                _logger.LogInformation(3, "User created a new account with password.");
            }

            return result.Succeeded ? Ok() : GetErrorResult(result);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string userName, string password, string returnUrl = null)
        {
            if (userName == null || password == null)
            {
                return BadRequest();
            }

            // This doesn't count login failures towards account lockout
            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
            var result = await _signInManager.PasswordSignInAsync(userName, password, true, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                _logger.LogInformation(1, "User logged in.");
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Authorize]
        public IActionResult Test()
        {
            return Json("OK");
        }
    }
}