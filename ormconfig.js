/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;
console.log(
  `${DB_HOST}, ${DB_PORT}, ${DB_USERNAME}, ${DB_PASSWORD}, ${DB_DATABASE} `,
);
if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_DATABASE) {
  throw new Error(
    `Нехватаем обязательных переменных для базы данных. Заполните env файл. ${DB_HOST}, ${DB_PORT}, ${DB_USERNAME}, ${DB_PASSWORD}, ${DB_DATABASE} `,
  );
}

const ormConfig = {
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  cli: {
    migrationsDir: 'src/migrations',
  },
  logging: process.env.NODE_ENV === 'development',
};

module.exports = ormConfig;
