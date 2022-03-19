export enum ActionType {
  set,
  add,
  delete,
  update
}
export type Success = true | Promise<boolean>;
export type BaseAction<T extends ActionType, U> = {
  type: T,
  success: Success,
  body: U
}
export type SetAction<T> = BaseAction<ActionType.set, T>;
export type AddAction<T> = BaseAction<ActionType.add, T>;
export type DeleteAction<T> = BaseAction<ActionType.delete, T>;
export type UpdateAction<T> = BaseAction<ActionType.update, T>;
export type Action<Set, Add, Update, Delete> =
  | SetAction<Set>
  | AddAction<Add>
  | UpdateAction<Update>
  | DeleteAction<Delete>;