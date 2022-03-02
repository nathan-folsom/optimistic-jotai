import { atom } from "jotai";

export const optimisticListAtom = atom(get => {
  console.log("Hello optimism");
  return true;
})