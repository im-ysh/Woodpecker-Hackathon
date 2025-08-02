//  FILE: tableContextBuilder.js
const { executeQuery } = require('./db');

async function buildTableContext() {
  const tables = await executeQuery(`
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
  `);

  let context = "";

  for (const table of tables) {
    const tableName = table.TABLE_NAME;
    const columns = await executeQuery(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = '${tableName}'
    `);

    context += `Table: ${tableName}\\nColumns: `;
    context += columns.map(col => `${col.COLUMN_NAME} (${col.DATA_TYPE})`).join(', ');
    context += '\\n\\n';
  }

  return context;
}

module.exports = { buildTableContext };
