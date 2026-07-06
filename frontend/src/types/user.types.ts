import type { User } from "./auth.types";

export interface UserInfo extends User {
    created_at: string
}