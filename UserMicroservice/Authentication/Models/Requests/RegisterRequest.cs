﻿namespace UserMicroservice.Authentication.Models.Requests
{
    public class RegisterRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}
