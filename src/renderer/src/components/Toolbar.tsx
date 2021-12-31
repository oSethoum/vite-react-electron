import React from "react";
import { createStyles, useMantineColorScheme } from "@mantine/core";
import { CgMoon, CgSun } from "react-icons/cg";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
  VscScreenFull,
  VscScreenNormal,
} from "react-icons/vsc";
import { WindowAction, WindowState } from "../utils";
import { useWindowEvent } from "@mantine/hooks";
import { useRecoilState } from "recoil";
import { windowAtom } from "@/state/windowState";

const useStyles = createStyles((theme) => {
  return {
    container: {
      color: theme.colorScheme == "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[5],
      backgroundColor: theme.colorScheme == "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
      height: "32px",
      display: "flex",
      flexDirection: "row",
    },
    menu: {},
    dragArea: {
      flexGrow: 1,
      WebkitAppRegion: "drag",
    },
    chromeButtons: {
      display: "flex",
      flexDirection: "row",
    },
    chromeButton: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 48,
      border: "none",
      backgroundColor: "transparent",
      "&:focus": {
        outline: "none",
      },
      "&:hover": {
        backgroundColor: "gray",
        color: "white",
      },
    },
    otherButton: {},
    closeButton: {
      "&:hover": {
        backgroundColor: "red",
      },
    },
    inner: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "inherit",
    },
  };
});

function WAction(action: WindowAction) {
  // @ts-ignore
  api.send("toMain", action);
}

function ToolBar() {
  const { classes, cx } = useStyles();
  const [windowState, setWindowState] = useRecoilState(windowAtom);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useWindowEvent("resize", () => {
    // @ts-ignore
    api.send("toMain");
    // @ts-ignore
    api.receive("fromMain", (data: WindowState) => {
      setWindowState(data);
    });
  });

  return (
    <div className={classes.container}>
      <div className={classes.dragArea}></div>
      <div className={classes.chromeButtons}>
        <div
          tabIndex={-1}
          className={classes.chromeButton}
          onClick={() => toggleColorScheme()}
        >
          {colorScheme == "light" ? <CgMoon size="16" /> : <CgSun size="16" />}
        </div>
        <div
          tabIndex={-1}
          className={cx(classes.chromeButton)}
          onClick={() => {
            windowState == WindowState.FullScreen
              ? WAction(WindowAction.NormalScreen)
              : WAction(WindowAction.FullScreen);
          }}
        >
          {windowState == WindowState.FullScreen
            ? <VscScreenNormal stroke="1" size="16" />
            : <VscScreenFull stroke="1" size="16" />}
        </div>
        <div
          tabIndex={-1}
          className={cx(classes.chromeButton)}
          onClick={() => {
            WAction(WindowAction.Minimize);
          }}
        >
          <VscChromeMinimize stroke="1" size="16" />
        </div>
        {windowState != WindowState.FullScreen && (
          <div
            tabIndex={-1}
            className={cx(classes.chromeButton)}
            onClick={() => {
              windowState == WindowState.Maximized
                ? WAction(WindowAction.Restore)
                : WAction(WindowAction.Maximize);
            }}
          >
            {windowState == WindowState.Maximized
              ? <VscChromeRestore stroke="1" size="16" />
              : <VscChromeMaximize stroke="1" size="16" />}
          </div>
        )}

        <div
          tabIndex={-1}
          className={cx(classes.chromeButton, classes.closeButton)}
        >
          <VscChromeClose stroke="1" size="16" />
        </div>
      </div>
    </div>
  );
}

export default ToolBar;
