import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB } from '../db/db.module';
import { Database } from '../db/db.type';
import { users, NewUser } from '../db/schema';


@Injectable()
export class UserRepo {
    constructor(@Inject(DB) private readonly db:Database) {}

    findByEmail(email: string) {
        return this.db.query.users.findFirst({
            where: eq(users.email, email)
        })
    }

    async createUser(data : NewUser) {
       const [user] = await this.db.insert(users).values(data).returning();
       return user
    }


}