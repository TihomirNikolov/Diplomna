using UserMicroservice.Enums;

namespace UserMicroservice.Models.Responses
{
    public class Response<TData> : Response
    {
        public TData? Data { get; set; }
    }

    public class Response
    {
        public StatusEnum Status { get; set; }

        public string? Message { get; set; }
    }
}
