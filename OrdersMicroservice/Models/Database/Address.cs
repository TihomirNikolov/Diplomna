﻿namespace OrdersMicroservice.Models.Database
{
    public class Address
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string StreetAddress { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Region { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string PostalCode { get; set; } = string.Empty;

        public string OrderId { get; set; } = string.Empty;

        public Order Order { get; set; } = default!;
    }
}
