# optimistic-jotai

Enterprise-grade state management for React apps with Jotai. The flexibility and un-opinionated nature of Jotai are what make it such a pleasure to work with, but are also a pain point for larger projects. This library aims to provide higher level utilities for managing application state out-of-the-box, while maintaining composability and the ethos of React.

## Optimistic

Create a snappy user experience with instant updates to the ui, while allowing effortless state rollbacks and error handling if things don't go as planned.

```
function useUpdateItems() {
  const updateItems = useUpdateItems(yourOptimisticListAtom);
  
  return useCallback((updates: ItemUpdate[]) => {
    const success = fetch("your-api/update-items-endpoint")
      .then(() => true)
      .catch(() => false)

    updateItems(success, updates); // <- Instantly updates ui, but automatically rolls back to previous state if fetch fails
  }, []);
}
```

## CRUDdy

If your app is anything like the above example, there is not much custom logic that goes into CRUD api calls and interactions, and we can pretty easily write abstractions that fully automate state management in these cases.

Factory function for an item update hook:

```
function deriveUseUpdateItems<Item>(optimisticListAtom: OptimisticListAtom<Item>, endpoint: string) {
  return () => {
    return useCallback((updates: Update<Item>[]) => {
      const success = fetch(endpoint)
        .then(() => true)
        .catch(e => false)

      updateItems(success, updates);
    }, []);
  }
}
```

Write a factory function for each action that your api supports, and all of a sudden you've got something quite ergonomic and efficient (well, after one more factory function that is):

```
function createCrudHooks<Item>(
  optimisticListAtom: OptimisticListAtom<Item>,
  endpoints: Record<"create" | "read" | "update" | "delete", string>
) {
  return {
    useCreateItems: deriveUseCreateItems(optimisticListAtom, endpoints.create),
    useGetItems: deriveUseGetItems(optimisticListAtom, endpoints.read),
    useUpdateItems: deriveUseUpdateItems(optimisticListAtom, endpoints.update),
    useDeleteItems: deriveUseDeleteItems(optimisticListAtom, endpoints.delete),
  }
}
```

Thank god this isn't Java, or we'd have had to name that last one something like AbstractCrudHookFactoryFactory.

Anyway, this technique of composing factory functions is quite powerful, and can be taken even further to layer in things like loading and error atoms to create a fully-fledged state object. And of course, if you have a use-case that doesn't quite fit in the mold, you have all the virtual legos necessary to quickly put together something more custom.
***

## Core API

There are two main utilities provided by optimistic-jotai: `optimisticListAtom` and `optimisticObjectAtom`. The first is for storing a list of items in state, while the second is for an object, e.g. a user configuration.

Both atoms use a reducer-style api to interact with the internal data structure, however we also provide utility hooks that make them even easier to work with.

## optimisticListAtom

Store and optimistically update/create/delete a list of items.

### Call Signature:

`optimisticListAtom<Item>(entityIdKey: keyof Item): WritableAtom<Item[], ListAction<Item>`
* `Item`: the type of the item stored in the list.
* `entityIdKey`: a unique key used to identify items in the list.
* `ListAction<T>`: a union of the actions that the list accepts to modify internal state.

example:  
`const exampleListAtom = optimisticListAtom<ExampleItem>("id");`
##Actions
### Set:

Set the value of the list. Use this for your initial fetch or for resetting/subsequent fetches that require the entire list to be overwritten.

#### Examples

Parameters:
* `success: boolean | Promise<boolean>`: the result of the action.
* `items: Item[]`: the array of items that will be the list. 

```
const setList = useSetList(exampleListAtom);
setList(success, items);
```
or
```
const updateList = useUpdateAtom(exampleListAtom);
updateList({ action: ActionType.set, data: { success, value: items } });
```

### Update

Apply updates to any number of items in the list.

#### Examples:

Parameters:
* `success: boolean | Promise<boolean>`: the result of the action.
* `updates: { entityId: string, update: Partial<Item> }[]`: the array of updates that will be applied to the list.

```
const updateItems = useUpdateItems(exampleListAtom);
updateItems(success, updates);
```
or
```
const updateList = useUpdateAtom(exampleListAtom);
updateList({ action: ActionType.update, data: { success, update: updates } });
```

### Add

Put more items into the list, overwriting any items that currently exist with the same id.

#### Examples

Parameters:
* `success: boolean | Promise<boolean>`: the result of the action.
* `items: Item[]`: the array of items that will be added the list.

```
const addItems = useAddItems(exampleListAtom);
addItems(success, items);
```
or
```
const updateList = useUpdateAtom(exampleListAtom);
updateList({ action: ActionType.add, data: { success, items } });
```

### Delete

Remove some items from the list.

#### Examples

Parameters:
* `success: boolean | Promise<boolean>`: the result of the action.
* `entityIds: string[]`: the array of items that will be the list.

```
const deleteItems = useDeleteItems(exampleListAtom);
deleteItems(success, entityIds);
```
or
```
const updateList = useUpdateAtom(exampleListAtom);
updateList({ action: ActionType.delete, data: { success, entityIds } });
```

***

## optimisticObjectAtom
