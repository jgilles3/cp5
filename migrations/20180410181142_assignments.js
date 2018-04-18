
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('assignments', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('details');
      table.dateTime('duedate');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tweets'),
  ]);
};
