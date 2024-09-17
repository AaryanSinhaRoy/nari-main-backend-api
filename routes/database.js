const pgp = require('pg-promise')({
  
});

const connectionString = 'postgres://postgres:root@localhost:5432/naridb';
const db = pgp(connectionString);
module.exports=db;