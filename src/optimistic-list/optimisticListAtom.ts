import { atom, Getter, Setter } from "jotai";
import { ListAction, ListEntityUpdate, OptimisticListAtomType } from "./types";
import { atomWithReset, RESET } from "jotai/utils";
import { ActionType, Success } from "../common/types/actions";

class OptimisticListItem<T extends Record<string, any>> {
  private listAtom = atom<T[]>([]);
  private actionAtom = atomWithReset<ListAction<T> | null>(null);
  public optimisticAtom: OptimisticListAtomType<T>;

  constructor(private entityIdKey: string) {
    this.optimisticAtom = atom(this.getAtom, this.setAtom);
  }

  private getAtom = (get: Getter) => {
    const action = get(this.actionAtom);
    const list = get(this.listAtom);
    if (!action) return list;
    return this.mergeChanges(action, list);
  }

  private mergeChanges = (action: ListAction<T>, list: T[]): T[] => {
    switch (action.type) {
      case ActionType.add:
        return this.mergeAdditions(action.body, list);
      case ActionType.delete:
        return this.mergeDeletions(action.body, list);
      case ActionType.set:
        return this.mergeList(action.body);
      case ActionType.update:
        return this.mergeUpdates(action.body, list);
    }
  }

  private mergeAdditions = (additions: T[], list: T[]): T[] => {
    const additionsMap = new Map(additions.map(a => [a[this.entityIdKey], true]));
    return list
      .filter(item => !additionsMap.get(item[this.entityIdKey]))
      .concat(additions);
  }

  private mergeDeletions = (deleteIds: string[], list: T[]): T[] => {
    const deletionsMap = new Map(deleteIds.map(id => [id, true]));
    return list.filter(item => !deletionsMap.get(item[this.entityIdKey]));
  }

  private mergeList = (items: T[]): T[] => items;

  private mergeUpdates = (updates: ListEntityUpdate<T>[], list: T[]): T[] => {
    const updatesMap = new Map(updates.map(u => [u.entityId, u.update]));
    return list.map(item =>
      updatesMap.has(item[this.entityIdKey]) ? { ...item, ...updatesMap.get(item[this.entityIdKey]) } : item
    );
  }

  private setAtom = (get: Getter, set: Setter, action: ListAction<T>) => {
    set(this.actionAtom, action);
    this.handleResult(action.success, get, set);
  }

  private handleResult = async (success: Success, get: Getter, set: Setter) => {
    if (success === true) this.saveUpdates(get, set);
    else {
      const result = await success;
      if (result) this.saveUpdates(get, set);
    }
    set(this.actionAtom, RESET);
  }

  private saveUpdates = (get: Getter, set: Setter) => {
    const successfullyUpdated = get(this.optimisticAtom);
    set(this.listAtom, successfullyUpdated);
  }
}

export const optimisticListAtom = <T>(entityIdKey: string & keyof T): OptimisticListAtomType<T> => {
  return new OptimisticListItem<T>(entityIdKey).optimisticAtom;
}