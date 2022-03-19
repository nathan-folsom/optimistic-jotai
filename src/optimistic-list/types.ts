import { Action } from "../common/types/actions";
import { WritableAtom } from "jotai";

export type OptimisticListAtomType<Item> = WritableAtom<Item[], ListAction<Item>>;
export type ListEntityUpdate<Item> = { entityId: string, update: Partial<Item> };
export type ListAction<Item> = Action<Item[], Item[], ListEntityUpdate<Item>[], string[]>;