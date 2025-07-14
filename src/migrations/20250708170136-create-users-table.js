exports.up = function (db) {
  return db.createTable('locations', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: {
      type: 'int',
      notNull: true
    },
    city: {
      type: 'string',
      notNull: true,
      length: 100
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  });
};

exports.down = function (db) {
  return db.dropTable('locations');
};
