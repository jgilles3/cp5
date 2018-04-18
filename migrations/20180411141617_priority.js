
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table assignments add priority int unsigned"),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table assignments drop index priority"),
  ]);
};
