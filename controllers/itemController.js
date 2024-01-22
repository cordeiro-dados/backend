const { connectToDatabase } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createItem = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Please fill all fields.' });
    }

    const id = uuidv4();

    const query = `
      INSERT INTO lakehouse.data (
        id,
        email,
        senha
      ) VALUES ('${id}', '${email}', '${senha}')
    `;

    // Establish the database connection using connectToDatabase function
    connectToDatabase()
      .then(async (client) => {
        try {
          const session = await client.openSession();

          const queryOperation = await session.executeStatement(query, { runAsync: true });
          await queryOperation.completionPromise;

          await session.close();

          console.log('Item created successfully.');

          return res.status(201).json({ id, email, senha });
        } catch (error) {
          console.error('Database Error:', error);
          return res.status(500).json({ error: 'Error saving item in the database.' });
        } finally {
          client.close();
        }
      })
      .catch((error) => {
        console.error('Database Connection Error:', error);
        return res.status(500).json({ error: 'Failed to connect to the database.' });
      });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getAllItems = async (req, res) => {
    try {
      const query = 'SELECT * FROM lakehouse.data';
      const client = await connectToDatabase();
      const session = await client.openSession();
      const queryOperation = await session.executeStatement(query, { runAsync: true });
  
      const result = await queryOperation.fetchAll();
  
      if (result) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'No items found.' });
      }
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ error: 'Error fetching items from the database.' });
    }
};

const deleteItemById = async (req, res) => {
    try {
      const id = req.params.id;
  
      const query = `DELETE FROM lakehouse.data WHERE id = '${id}'`;
      const client = await connectToDatabase();
      const session = await client.openSession();
      const queryOperation = await session.executeStatement(query, { runAsync: true });
      await queryOperation.completionPromise;
  
      await session.close();
      client.close();
  
      return res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ error: 'Error deleting item from the database.' });
    }
};

const updateItemById = async (req, res) => {
try {
    const id = req.params.id;

    const { email, senha } = req.body;

    const query = `UPDATE bronze.capacidade_producao SET email = '${email}', senha = '${senha}' WHERE id = '${id}'`;
    const client = await connectToDatabase();
    const session = await client.openSession();
    const queryOperation = await session.executeStatement(query, { runAsync: true });
    await queryOperation.completionPromise;

    await session.close();
    client.close();

    return res.status(200).json({ message: 'Item updated successfully.' });
} catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ error: 'Error updating item from the database.' });
}
};

module.exports = {
  createItem,
  getAllItems,
  deleteItemById,
  updateItemById
};
