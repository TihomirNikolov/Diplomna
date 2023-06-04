﻿using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization.IdGenerators;
using ProductsMicroservice.Extensions;
using ProductsMicroservice.Helpers;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Requests;
using System.Xml.Linq;

namespace ProductsMicroservice.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouritesController : ControllerBase
    {
        private readonly IFavouritesService _favouritesService;
        private readonly HttpRequestHelper _httpRequestHelper;

        public FavouritesController(IFavouritesService favouritesService, HttpRequestHelper httpRequestHelper)
        {
            _favouritesService = favouritesService;
            _httpRequestHelper = httpRequestHelper;
        }

        #region Methods

        #region Get Methods

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetFavourites()
        {
            var token = Request.GetAuthorizationToken();

            var email = await _httpRequestHelper.GetUserEmailAsync(token);

            if (email == null)
            {
                return NotFound();
            }

            var favourites = await _favouritesService.GetFavouritesByEmail(email);
            return Ok(favourites);
        }

        #endregion

        #region Post Methods

        [HttpPost]
        [Route("add")]
        public async Task<IActionResult> AddFavourite([FromBody] FavouriteRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.ProductUrl))
            {
                return BadRequest();
            }

            var token = Request.GetAuthorizationToken();

            var email = await _httpRequestHelper.GetUserEmailAsync(token);

            if (email == null)
            {
                return NotFound();
            }

            await _favouritesService.AddFavourite(email, request.ProductUrl);

            return Ok();
        }

        #endregion

        #region Delete Methods

        [HttpDelete]
        [Route("remove/{productUrl}")]
        public async Task<IActionResult> RemoveFavourite(string productUrl)
        {
            if (string.IsNullOrEmpty(productUrl))
            {
                return BadRequest();
            }

            var token = Request.GetAuthorizationToken();

            var email = await _httpRequestHelper.GetUserEmailAsync(token);

            if (email == null)
            {
                return NotFound();
            }

            await _favouritesService.RemoveFavourite(email, productUrl);

            return Ok();
        }

        #endregion

        #endregion
    }
}
