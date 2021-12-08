import { useEffect, useRef, useState } from "react";
import styles from "./Board.module.css";
import { useGameContext } from "../../GameContext";
import MazeDrawer from "./MazeDrawer";
import { useWindowSize } from "@react-hook/window-size";
import useImage from "use-image";
import logoSrc from "./logo.svg";
import lollipopSrc from "./lollipop.svg";
import icecreamSrc from "./ice_cream.svg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useInterval from "@use-it/interval";

const Board = () => {
  const {
    maze,
    currentCell,
    start,
    goal,
    lollipop,
    lollipopTaken,
    icecream,
    icecreamTaken,
    prizeShowTime,
    isPlaying,
    isPause
  } = useGameContext();
  const [showGoal, setShowGoal] = useState(true);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [width, height] = useWindowSize();
  const [shouldDraw, setShouldDraw] = useState(false);
  const [logo] = useImage(logoSrc);
  const [lollipopImg] = useImage(lollipopSrc);
  const [icecreamImg] = useImage(icecreamSrc);

  useEffect(() => {
    const handleResize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const scale = window.devicePixelRatio;
      canvasRef.current.width = Math.floor(rect.width * scale);
      canvasRef.current.height = Math.floor(rect.height * scale);
      setShouldDraw(true);
    };

    setTimeout(handleResize, 100);
  }, [width, height]);

  useInterval(() => {
    setShowGoal(!showGoal);
  }, 750);

  useEffect(() => {
    if (shouldDraw) {
      setShouldDraw(false);
    }
    if (!maze) {
      return;
    }
    const mazeDrawer = new MazeDrawer(
      canvasRef.current,
      maze,
      logo,
      currentCell,
      showGoal && goal,
      lollipop,
      lollipopImg,
      lollipopTaken,
      icecream,
      icecreamImg,
      icecreamTaken,
      prizeShowTime
    );
    mazeDrawer.draw();
  }, [
    shouldDraw,
    maze,
    logo,
    currentCell,
    start,
    goal,
    showGoal,
    lollipop,
    lollipopTaken,
    icecream,
    icecreamTaken,
    prizeShowTime,
  ]);

  return (
    <div ref={containerRef} className={styles.root}>
      <canvas className={styles.canvas} ref={canvasRef} />
      {isPlaying && !isPause ? (
        <div className={styles.gamepad}>
          <ArrowBackIcon
            className={styles.arrowLeft}
            sx={{ fontSize: 50 }}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "ArrowLeft",
                })
              )
            }
          />
          <ArrowUpwardIcon
            className={styles.arrowUp}
            sx={{ fontSize: 50 }}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "ArrowUp",
                })
              )
            }
          />
          <ArrowDownwardIcon
            className={styles.arrowDown}
            sx={{ fontSize: 50 }}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "ArrowDown",
                })
              )
            }
          />
          <ArrowForwardIcon
            className={styles.arrowRight}
            sx={{ fontSize: 50 }}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "ArrowRight",
                })
              )
            }
          />
        </div>
      ) : (
       <></>
      )}
    </div>
  );
};

export default Board;
