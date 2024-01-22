const { DBSQLClient } = require('@databricks/sql');

const token = "dapi907add19a5c73eea2da77a2b7b07be66";
const server_hostname = "dbc-d7ab2071-0203.cloud.databricks.com";
const http_path = "/sql/1.0/warehouses/5b1d58dbc51978a4";

const client = new DBSQLClient();

const connectToDatabase = async () => {
  try {
    await client.connect({
      token: token,
      host: server_hostname,
      path: http_path,
    });
    console.log('Connected to the database!');
    return client;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

const testQuery = async () => {
  const query = 'SELECT 1';
  try {
    const session = await client.openSession();

    const queryOperation = await session.executeStatement(query, { runAsync: true });
    await queryOperation.completionPromise;

    await session.close();

    console.log('Test query executed successfully.');
  } catch (error) {
    console.error('Error executing test query:', error);
  }
};

module.exports = { connectToDatabase, testQuery };
