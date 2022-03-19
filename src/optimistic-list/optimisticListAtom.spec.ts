import { ListAction } from "./types";
import { optimisticListAtom } from "./optimisticListAtom";
import { renderHook, RenderResult } from "@testing-library/react-hooks";
import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { ActionType } from "../common/types/actions";
import { act } from "react-dom/test-utils";

type TestItem = {
  id: string;
  value?: any;
}
describe('Optimistic List Atom test suite', () => {
  let result: RenderResult<{ list: TestItem[], update: (action: ListAction<TestItem>) => void }>

  beforeEach(() => {
    const atom = optimisticListAtom<TestItem>("id");
    ({ result } = renderHook(() => ({
      list: useAtomValue(atom),
      update: useUpdateAtom(atom)
    })))
  });
  it('should initialize', () => {
    expect(result.current.list.length).toBe(0);
  });
  it('should set list', () => {
    const item = { id: "abc" };
    act(() => {
      result.current.update({ type: ActionType.set, success: true, body: [item] });
    })
    expect(result.current.list.length).toBe(1);
    expect(result.current.list[0]).toEqual(item);
  });
});