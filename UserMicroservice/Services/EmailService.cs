using System.Net;
using System.Net.Mail;
using UserMicroservice.Interfaces.Services;

namespace UserMicroservice.Services
{
    public class EmailService : IEmailService
    {
        private const string fromEmail = "";

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
            try
            {
                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(fromEmail);
                msg.To.Add(new MailAddress(destinationEmail));

                msg.Subject = "Email Confirmation";
                msg.IsBodyHtml = true;
                var template = Path.Combine(_env.ContentRootPath, "Templates/Email/EmailConfirm.html");
                var templateText = File.ReadAllText(template);
                msg.Body = string.Format(templateText, confirmEmaiLink);

                client.Send(msg);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool ResendConfirmEmail(string destinationEmail, string confirmEmaiLink)
        {
            try
            {
                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(fromEmail);
                msg.To.Add(new MailAddress(destinationEmail));

                msg.Subject = "Email Confirmation";
                msg.IsBodyHtml = true;
                var template = Path.Combine(_env.ContentRootPath, "Templates/Email/EmailConfirmResend.html");
                var templateText = File.ReadAllText(template);
                msg.Body = string.Format(templateText, confirmEmaiLink);

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
            try
            {
                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(fromEmail);
                msg.To.Add(new MailAddress(destinationEmail));

                msg.Subject = "Reset Password email";
                msg.IsBodyHtml = true;
                var template = Path.Combine(_env.ContentRootPath, "Templates/Email/ResetPassword.html");
                var templateText = File.ReadAllText(template);
                msg.Body = string.Format(templateText, resetPasswordLink);

                client.Send(msg);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool SendChangeEmail(string destinationEmail, string chanageEmailLink)
        {
            try
            {
                MailMessage msg = new MailMessage();
                msg.From = new MailAddress(fromEmail);
                msg.To.Add(new MailAddress(destinationEmail));

                msg.Subject = "Change email";
                msg.IsBodyHtml = true;
                var template = Path.Combine(_env.ContentRootPath, "Templates/Email/ChangeEmail.html");
                var templateText = File.ReadAllText(template);
                msg.Body = string.Format(templateText, chanageEmailLink);

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
