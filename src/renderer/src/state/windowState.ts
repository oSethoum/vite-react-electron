import { WindowState } from "../utils";
import { atom } from "recoil";

export const windowAtom = atom<WindowState>({
  key: "windowAtom",
  default: WindowState.Restored,
});
