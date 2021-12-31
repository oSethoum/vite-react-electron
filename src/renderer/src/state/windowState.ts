import { WindowState } from "../../../common/utils";
import { atom } from "recoil";

export const windowAtom = atom<WindowState>({
  key: "windowAtom",
  default: WindowState.Restored,
});
