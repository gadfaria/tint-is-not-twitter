/**
 * For constructing schemas, check:
 * @see https://github.com/YousefED/typescript-json-schema/blob/master/api.md
 */

import { User } from ".prisma/client";

/**
 * This Example interface can be anywhere in your project
 */
export type CreateUserBodyIRoute = Omit<User, "id">;

export type UpdateUserParamsIRoute = { userId: User["id"] };
export type UpdateUserBodyIRoute = Partial<Omit<User, "id">>;
