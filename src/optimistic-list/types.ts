import { Action } from "../common/types/actions";

export type ListEntityUpdate<Item> = { entityId: string, update: Partial<Item> };
export type ListAction<Item> = Action<Item[], Item[], ListEntityUpdate<Item>[], string[]>;