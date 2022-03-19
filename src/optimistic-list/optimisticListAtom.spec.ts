import { OptimisticListAtomType } from "./types";
import { optimisticListAtom } from "./optimisticListAtom";
import { renderHook } from "@testing-library/react-hooks";
import { useAtomValue } from "jotai";

type TestItem = {
  id: string;
  value: any;
}
describe('Optimistic List Atom test suite', () => {
  let atom: OptimisticListAtomType<TestItem>;

  beforeEach(() => {
    atom = optimisticListAtom<TestItem>("id");
  });
  it('should initialize', () => {
    const { result } = renderHook(() => ({
      list: useAtomValue(atom)
    }))
    expect(result.current.list.length).toBe(0);
  });
});