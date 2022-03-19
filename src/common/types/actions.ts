export enum ActionType {
  set,
  add,
  delete,
  update
}
export type Success = true | Promise<boolean>;
type WithSuccess<T extends Record<string, any>> = T & { success: Success };
export type BaseAction<T extends ActionType, U> = {
  action: T,
  data: WithSuccess<U>
}
export type SetAction<T> = BaseAction<ActionType.set, { value: T }>;
export type AddAction<T> = BaseAction<ActionType.add, { addition: T }>;
export type DeleteAction<T> = BaseAction<ActionType.delete, { deletion: T }>;
export type UpdateAction<T> = BaseAction<ActionType.update, { update: T }>;
export type Action<Set, Add, Update, Delete> =
  | SetAction<Set>
  | AddAction<Add>
  | UpdateAction<Update>
  | DeleteAction<Delete>;