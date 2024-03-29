﻿namespace OrdersMicroservice.Models.DTOs
{
    public class CardDTO
    {
        public string CardNumber { get; set; } = string.Empty;

        public string CardholderName { get; set; } = string.Empty;

        public string Month { get; set; } = string.Empty;

        public string Year { get; set; } = string.Empty;

        public string CVV { get; set; } = string.Empty;

        public string CardType { get; set; } = string.Empty;
    }
}
