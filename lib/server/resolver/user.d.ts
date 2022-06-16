import { User } from '../orm/user';
export declare class UserResolver {
    static create(name: string, age: number, nationality?: string): Promise<User>;
    static readAll(): Promise<User[]>;
    static read(id: number): Promise<User>;
    static delete(id: number): Promise<import("typeorm").DeleteResult>;
    static update(id: number, name: string, age: number, nationality: string): Promise<void>;
}
