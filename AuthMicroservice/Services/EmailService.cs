using AuthMicroservice.Interfaces.Services;
using System.Net;
using System.Net.Mail;

namespace AuthMicroservice.Services
{
    public class EmailService : IEmailService
    {
        private SmtpClient client;
        private IWebHostEnvironment _env;

        public EmailService(IWebHostEnvironment env)
        {
            client = new SmtpClient();
            client.UseDefaultCredentials = false;
            client.EnableSsl = true;
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.Credentials = new NetworkCredential("", "");

            _env = env;
        }

        public bool SendConfirmEmail(string destinationEmail, string confirmEmaiLink)
        {
            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("");
            msg.To.Add(new MailAddress(destinationEmail));

            msg.Subject = "Email Confirmation";
            msg.IsBodyHtml = true;
            var template = Path.Combine(_env.ContentRootPath, "Templates/Email/EmailConfirm.html");
            var templateText = File.ReadAllText(template);
            msg.Body = string.Format(templateText, confirmEmaiLink);

            try
            {
                client.Send(msg);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool SendPasswordResetEmail(string destinationEmail, string resetPasswordLink)
        {
            MailMessage msg = new MailMessage();
            msg.From = new MailAddress("");
            msg.To.Add(new MailAddress(destinationEmail));

            msg.Subject = "Reset Password email";
            msg.IsBodyHtml = true;
            var template = Path.Combine(_env.ContentRootPath, "Templates/Email/ResetPassword.html");
            var templateText = File.ReadAllText(template);
            msg.Body = string.Format(templateText, resetPasswordLink);

            try
            {
                client.Send(msg);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
