using Microsoft.Data.SqlClient;

namespace AuthMicroservice.Helpers
{
    public static class MigrationDatabaseHelper
    {
        public static void MigrateHangfireDatabas(string connectionString)
        {
            string dbName = "Hangfire.Users";
            string connectionStringFormat = connectionString;

            using (var connection = new SqlConnection(string.Format(connectionStringFormat, "master")))
            {
                connection.Open();

                using (var command = new SqlCommand(string.Format(
                    @"IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'{0}') 
                                    create database [{0}];
                      ", dbName), connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}
