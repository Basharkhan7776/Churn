import type { ProjectOptions } from '../types';

export function generateMongooseConnection(): string {
  return `import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/churn');
    console.log('[+] MongoDB connected successfully');
  } catch (error) {
    console.error('[x] MongoDB connection error:', error);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
`;
}

export function generateMongooseModel(): string {
  return `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
`;
}
