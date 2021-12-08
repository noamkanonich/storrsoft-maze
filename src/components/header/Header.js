import styles from "./Header.module.css";
import { useGameContext } from "../../GameContext";
import { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";

const Header = () => {
  const {
    time,
    round,
    score,
    highScore,
    myHighScore,
    playLevelMusic,
    stopLevelMusic,
    isPlaying,
    isPause,
  } = useGameContext();
  const formatTime = () => {
    return time !== undefined ? time.toString().padStart(2, " ") : null;
  };
  const [isMute, setIsMute] = useState(false);
 
  
  return (
    <header>
      <div className={styles.row}>
        <p>Welcome to the StorrSoft maze!</p>

        {isPlaying && !isPause ? (
          isMute ? (
            <button
              className={styles.muteBtn}
              onClick={() => {
                playLevelMusic();
                setIsMute(false);
              }}
            >
              MUTE X
            </button>
          ) : (
            <button
              className={styles.muteBtn}
              onClick={() => {
                stopLevelMusic();
                setIsMute(true);
              }}
            >
              MUTE
            </button>
          )
        ) : (
          <></>
        )}

        {isPlaying ? (isPause ? (
          <button
            className={styles.startBtn}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "p",
                })
              )
            }
          >
            RESUME
          </button>
        ) : (
          <button
            className={styles.startBtn}
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "p",
                })
              )
                setIsMute(false)
              }
            }
          >
            PAUSE
          </button>
        )) : (<></>)}
        

        <button
            className={styles.startBtn}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "Enter",
                })
              )
            }
          >
            START
          </button>

        <p>
          Hi-Score{" "}
          <span className={styles.score}>
          {highScore.toString().padStart(5, " ")}
          {/* {highScore === 0 ? (
              <CircularProgress style={{ color: "yellow", width: "25px", height: "25px" }} />
            ) : (highScore.toString().padStart(5, " "))} */}
          </span>
          <span className={styles.score}></span>
          &nbsp;&nbsp; My-Hi-Score{" "}
          <span className={styles.score}>
          {/* {myHighScore ? (
            <CircularProgress style={{ color: "yellow", width: "25px", height: "25px" }} />
            ) : (myHighScore.toString().padStart(3, " "))} */}
            {myHighScore.toString().padStart(3, " ")}
          </span>
        </p>
      </div>
      <div>
        1UP{" "}
        <span className={styles.score}>
          {score.toString().padStart(5, " ")}
        </span>
        &nbsp;&nbsp; ROUND{" "}
        <span className={styles.score}>
          {round.toString().padStart(3, " ")}
        </span>
        &nbsp;&nbsp; TIME <span className={styles.score}>{formatTime()}</span>
      </div>
    </header>
  );
};

export default Header;
