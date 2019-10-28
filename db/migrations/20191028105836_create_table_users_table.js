
exports.up = function(knex) {
  console.log("Creating Users table");
  return knex.schema.createTable('users', (usersTable => {
      usersTable.unique('username').primary();
      usersTable.string('avatar_url').notNullable();
      usersTable.string('name').notNullable();
  }))

};

exports.down = function(knex) {
  console.log('removing users tables...');
  return knex.schema.dropTable('users');
};