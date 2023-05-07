using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        #region Declarations



        #endregion

        #region Constructor

        public ProductsController()
        {
        }

        #endregion

        #region Get Methods

        [HttpGet]
        [Route("products/all")]
        public async Task<IActionResult> GetAll()
        {
            const string connectionUri = "";
            var settings = MongoClientSettings.FromConnectionString(connectionUri);
            // Set the ServerApi field of the settings object to Stable API version 1
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            // Create a new client and connect to the server
            var client = new MongoClient(settings);

            var db = client.GetDatabase("MongoDB");

            var products = db.GetCollection<BsonDocument>("Products");

            var foundProducts = (await products.FindAsync(Builders<BsonDocument>.Filter.Exists("name"))).ToList();

            var jsonProducts = foundProducts.ToJson();

            return Ok(jsonProducts);
        }

        #endregion
    }
}
