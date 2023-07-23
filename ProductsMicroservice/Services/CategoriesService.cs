using AutoMapper;
using MongoDB.Driver;
using ProductsMicroservice.Interfaces;
using ProductsMicroservice.Models.Categories;
using ProductsMicroservice.Models.Documents;
using ProductsMicroservice.Models.Products;

namespace ProductsMicroservice.Services
{
    public class CategoriesService : BaseService, ICategoriesService
    {
        private IMapper _mapper;

        protected override string CollectionName => "Categories";


        public CategoriesService(IMongoClient mongoClient, IMapper mapper) : base(mongoClient)
        {
            _mongoClient = mongoClient;
            _mapper = mapper;
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var collection = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Empty).ToListAsync();

            return _mapper.Map<List<CategoryDocument>, List<Category>>(collection);
        }

        public async Task<bool> CreateCategoryAsync(Category category)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            await db.GetCollection<CategoryDocument>(CollectionName).InsertOneAsync(
                new CategoryDocument
                {
                    DisplayName = category.DisplayName,
                    Icon = category.Icon,
                    UrlPath = category.UrlPath,
                    ParentCategoryId = category.ParentCategoryId
                });

            return true;
        }

        public async Task<CategoryDTO> GetSubCategoriesCategoryByUrl(string url)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var rootCategory = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Eq("UrlPath", url)).FirstOrDefaultAsync();

            var subCategories = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Eq("ParentCategoryId", rootCategory.CategoryId)).ToListAsync();

            CategoryDTO categoryDTO;

            if (subCategories != null && subCategories.Count != 0)
            {
                categoryDTO = _mapper.Map<CategoryDTO>(rootCategory);
                categoryDTO.SubCategories = _mapper.Map<List<CategoryDTO>>(subCategories);

                return categoryDTO;
            }

            var category = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Eq("CategoryId", rootCategory.ParentCategoryId)).FirstOrDefaultAsync();
            
            var subs = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Eq("ParentCategoryId", category.CategoryId)).ToListAsync();

            categoryDTO = _mapper.Map<CategoryDTO>(rootCategory);
            categoryDTO.SubCategories = _mapper.Map<List<CategoryDTO>>(subs);

            return categoryDTO;
        }

        public async Task<List<CategoryDTO>> GetCategoriesWithSubcategoriesAsync()
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var categories = await db.GetCollection<CategoryDocument>(CollectionName).Find(Builders<CategoryDocument>.Filter.Empty).ToListAsync();

            var rootCategories = categories.Where(c => c.ParentCategoryId == null || c.ParentCategoryId == "");
            var subCategories = categories.Where(c => c.ParentCategoryId != null);

            var categoriesDTO = new List<CategoryDTO>();

            foreach (var rootCategory in rootCategories)
            {
                var categoryDTO = new CategoryDTO();
                categoryDTO = _mapper.Map<CategoryDTO>(rootCategory);
                foreach (var subCategory in subCategories)
                {
                    if (rootCategory.CategoryId == subCategory.ParentCategoryId)
                    {
                        var subCategoryDTO = _mapper.Map<CategoryDTO>(subCategory);
                        if (categoryDTO.SubCategories == null)
                        {
                            categoryDTO.SubCategories = new List<CategoryDTO>();
                        }
                        foreach (var subSubCategory in subCategories.Where(c => c.ParentCategoryId == subCategory.CategoryId))
                        {
                            if (subCategoryDTO.SubCategories == null)
                            {
                                subCategoryDTO.SubCategories = new List<CategoryDTO>();
                            }
                            subCategoryDTO.SubCategories.Add(_mapper.Map<CategoryDTO>(subSubCategory));
                        }
                        categoryDTO.SubCategories.Add(subCategoryDTO);
                    }
                }
                categoriesDTO.Add(categoryDTO);
            }

            return categoriesDTO;
        }

        public async Task<bool> UrlPathExists(string url)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var category = await db.GetCollection<CategoryDocument>(CollectionName)
                .Find(Builders<CategoryDocument>.Filter.Eq("UrlPath", url)).FirstOrDefaultAsync();

            return category != null;
        }

        public async Task<List<SearchCategoryDTO>> GetCategoriesByUrlsAsync(List<string> urls)
        {
            await CreateCollectionIfDoesntExistAsync();

            var db = GetDatabase();

            var filter = Builders<CategoryDocument>.Filter.Where(c => urls.Contains(c.UrlPath));

            var categoryDocuments = await db.GetCollection<CategoryDocument>(CollectionName).Find(filter).ToListAsync();

            return _mapper.Map<List<SearchCategoryDTO>>(categoryDocuments);
        }
    }
}
