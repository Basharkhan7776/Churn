import type { ProjectOptions } from '../types';

export function generateSequelizeConfig(options: ProjectOptions): string {
  const { database } = options;

  let dialect: string = database || 'postgres';
  if (database === 'postgresql') dialect = 'postgres';

  return `import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
  dialect: '${dialect}',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('[+] Database connection established successfully.');
  } catch (error) {
    console.error('[x] Unable to connect to the database:', error);
    process.exit(1);
  }
}
`;
}

export function generateSequelizeModel(options: ProjectOptions): string {
  return `import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
`;
}
