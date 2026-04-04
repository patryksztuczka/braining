import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { User, users } from '../../db/schema';

export class UsersRepository {
  public async findById(id: string): Promise<User | null> {
    const user = await db.select().from(users).where(eq(users.id, id)).get();

    return user ?? null;
  }
}
