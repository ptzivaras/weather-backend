exports.up = function (db) {
  return db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true,
      length: 100
    },
    password_hash: {
      type: 'string',
      notNull: true,
      length: 255
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  });
};

exports.down = function (db) {
  return db.dropTable('users');
};
