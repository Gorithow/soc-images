using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using SocImages.Helpers;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SocImages.Helpers
{
    public static class ValidateReCaptchaHelper
    {
        /*
         *  IMPORTANT NOTICE: This is not a final solution. The key should be keep in the application configuration.
         */
        private const string ReCaptchaSecret = "6LdIpC4UAAAAAKnRo_CMfir3m4AlUQxdZq8AfZz8";

        private const string RecaptchaResponseTokenKey = "g-recaptcha-response";
        private const string ApiVerificationEndpoint = "https://www.google.com/recaptcha/api/siteverify";

        private const string ReCaptchaModelErrorKey = "ReCaptcha";

        private static void AddModelError(ActionExecutingContext context, string error)
        {
            context.ModelState.AddModelError(ReCaptchaModelErrorKey, error.ToString());
        }

        private class ReCaptchaResponse
        {
            public bool Success { get; set; }
            public string Challenge_ts { get; set; }
            public string Hostname { get; set; }
            public string[] Errorcodes { get; set; }
        }

        public static async Task ValidateRecaptcha(this CaptchaResponseWrapper captchaResponse, ModelStateDictionary modelState)
        {
            var token = captchaResponse.CaptchaResponse;

            using (var webClient = new HttpClient())
            {
                var content = new FormUrlEncodedContent(new[]
                    {
                        new KeyValuePair<string, string>("secret", ReCaptchaSecret),
                        new KeyValuePair<string, string>("response", token)
                    }
                );

                HttpResponseMessage response = await webClient.PostAsync(ApiVerificationEndpoint, content);
                string json = await response.Content.ReadAsStringAsync();
                var reCaptchaResponse = JsonConvert.DeserializeObject<ReCaptchaResponse>(json);

                if (reCaptchaResponse == null)
                {
                    modelState.AddModelError(ReCaptchaModelErrorKey, "Unable To Read Response From Server");
                }
                else if (!reCaptchaResponse.Success)
                {
                    modelState.AddModelError(ReCaptchaModelErrorKey, "Invalid reCaptcha");
                }
            }
        }
    }
}

public class CaptchaResponseWrapper
{
    public string CaptchaResponse { get; set; }

    public static async Task ValidateRecaptcha(string captchaResponse, ModelStateDictionary modelState)
    {
        var captcha = new CaptchaResponseWrapper() { CaptchaResponse = captchaResponse };

        await captcha.ValidateRecaptcha(modelState);
    }
}