import { createContext, useContext, useEffect, useReducer } from "react";
import useInterval from "@use-it/interval";
import useSound from "use-sound";
import Maze from "./maze/Maze";
import levelMusic from "./audio/maze.mp3";
import levelEndMusic from "./audio/level_end.mp3";
import { getAllByLabelText } from "@testing-library/react";
import { v1 as uuidv1 } from 'uuid';
import Axios from 'axios';

const ROWS = parseInt(process.env.REACT_APP_ROWS);
const COLUMNS = parseInt(process.env.REACT_APP_COLUMNS);
const ROUND_TIME = parseInt(process.env.REACT_APP_ROUND_TIME);
const USER_ID = localStorage.getItem("userId")

const KEY_DIRECTIONS = {
  ArrowLeft: "west",
  ArrowRight: "east",
  ArrowUp: "north",
  ArrowDown: "south",
};
const INITIAL_STATE = {
  time: ROUND_TIME,
  maze: undefined,
  currentCell: undefined,
  start: undefined,
  goal: undefined,
  lollipop: undefined,
  lollipopTaken: false,
  icecream: undefined,
  icecreamTaken: false,
  round: 1,
  score: 0,
  highScore: 0,
  myHighScore: 0,
  betweenRounds: false,
};

const GameContext = createContext({
  ...INITIAL_STATE,
  isPlaying: false,
  isPause: false,
});

export const useGameContext = () => useContext(GameContext);

const reducer = (state, action) => {
  switch (action.type) {
    case "startGame": {
      return {
        ...state,
        isPlaying: true,
        isPause: false,
        time: 60,
        maze: action.payload.maze,
        currentCell: action.payload.maze.start,
        score: 0,
        round: 1,
        start: action.payload.maze.start,
        goal: action.payload.maze.goal,
        lollipop: action.payload.maze.lollipop,
        lollipopTaken: false,
        icecream: action.payload.maze.icecream,
        icecreamTaken: false,
        prizeShowTime: 45,
      };
    }
    case "pauseGame": {
      return {
        ...state,
        isPause: true,
      };
    }
    case "resumeGame": {
      return {
        ...state,
        isPause: false,
      };
    }
    case "decrementTime": {
      return {
        ...state,
        time: state.time - 1,
        prizeShowTime: state.prizeShowTime - 1,
      };
    }
    case "move": {
      const newScore = state.score + action.payload.points;
      return {
        ...state,
        currentCell: action.payload.nextCell,
        score: newScore,
        highScore: Math.max(state.highScore, newScore),
        myHighScore: Math.max(state.myHighScore, newScore)
      };
    }
    case "finishLevel": {
      return {
        ...state,
        betweenRounds: true,
      };
    }
    case "roundUp": {
      return {
        ...state,
        time: action.payload.time,
        maze: action.payload.maze,
        currentCell: action.payload.maze.start,
        start: action.payload.maze.start,
        goal: action.payload.maze.goal,
        lollipop: action.payload.maze.lollipop,
        icecream: action.payload.maze.icecream,
        round: state.round + 1,
        betweenRounds: false,
        lollipopTaken: false,
        icecreamTaken: false,
        prizeShowTime: 45,
        // prizeShowTime: 15,
      };
    }
    case "lollipop": {
      const newScore = state.score + action.payload.points;
      return {
        ...state,
        time: action.payload.time,
        score: newScore,
        highScore: Math.max(state.highScore, newScore),
        lollipopTaken: true,
      };
    }
    case "lollipop_taken": {
      return {
        ...state,
        lollipop: action.payload.lollipop,
      };
    }
    case "icecream": {
      const newScore = state.score + action.payload.points;
      return {
        ...state,
        time: action.payload.time,
        score: newScore,
        highScore: Math.max(state.highScore, newScore),
        icecreamTaken: true,
      };
    }
    case "icecream_taken": {
      return {
        ...state,
        icecream: action.payload.icecream,
      };
    }
    default:
      throw new Error("Unknown action");
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [playLevelMusic, { stop: stopLevelMusic } ] = useSound(levelMusic, {
    loop: true,
  });
  const [playLevelEndMusic] = useSound(levelEndMusic);

  const isPlaying = !!state.maze && state.time > 0;
  const isPause = false;

  let currentUserHighScore = 0;

  const loadHighScore = async () => {
      await Axios.get("http://localhost:3002/highScore").then((response) => {
      const score = parseInt(response.data.highScore)
      if(score) {
        state.highScore = score;
      } else {
        state.highScore = 0;
      }
      return score;
    })
  }

  const loadCurrentUserHighScore = async () => {
    const currentUserId = USER_ID;
    await Axios.get("http://localhost:3002/load/" + currentUserId).then((response) => {
      const score = parseInt(response.data.score)
      if(score) {
        state.myHighScore = score;
      }
      return score;
    })
  }

  const saveHighScore = async () => {
    const currentUserId = localStorage.getItem("userId");
    if(currentUserId){
      console.log("Update Score")
      await Axios.put("http://localhost:3002/updateScore/" + currentUserId, {
        score: state.myHighScore
      }).then(() => {
        console.log("SUCCESS")
      }).catch((error) => {
        console.log(error)
      })
    } else {
      console.log("Save Score")
      const unique_id = uuidv1();
      localStorage.setItem("userId", unique_id)
      await Axios.post("http://localhost:3002/save", {
        score: state.myHighScore,
        unique_id: unique_id
      }).then(() => {
        console.log("SUCCESS")
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  useEffect(() => {
    loadHighScore();
    if(USER_ID) {loadCurrentUserHighScore()}
    }, []);


  useInterval(
    () => {
      dispatch({ type: "decrementTime" });
    },
    isPlaying && !state.isPause && !state.betweenRounds ? 1000 : null
  );

  useEffect(() => {
    const onKeyDown = ({ key }) => {
      console.log(key)
      if (key === "Enter" && !isPlaying) {
        playLevelMusic();
        dispatch({
          type: "startGame",
          payload: { maze: new Maze(ROWS, COLUMNS) },
        });
      
      } else if (key === "p" && !state.isPause) {
        stopLevelMusic();
        dispatch({
          type: "pauseGame",
        });
      } else if (key === "p" && state.isPause) {
        playLevelMusic();
        dispatch({
          type: "resumeGame",
        });
      } 
      else if (
        Object.keys(KEY_DIRECTIONS).indexOf(key) > -1 &&
        isPlaying && !state.isPause &&
        !state.betweenRounds
      ) {
        const nextCell = state.maze.tryMove(
          state.currentCell,
          KEY_DIRECTIONS[key]
        );
        if (!nextCell) {
          return;
        }
        dispatch({
          type: "move",
          payload: { nextCell, points: state.round * 10 },
        });
        if (nextCell.toString() === state.goal.toString()) {
          dispatch({ type: "finishLevel" });
          stopLevelMusic();
          playLevelEndMusic();
          setTimeout(() => {
            dispatch({
              type: "roundUp",
              payload: {
                time: ROUND_TIME >= state.time ? ROUND_TIME : state.time,
                maze: new Maze(ROWS, COLUMNS),
              },
            });
            playLevelMusic();
          }, 2300);
        }

        if(state.prizeShowTime <= 10 && state.prizeShowTime > 0){
             if (state.lollipop) {
                if (nextCell.toString() === state.lollipop.toString() && !state.lollipopTaken) {
              stopLevelMusic();
              playLevelEndMusic();
              setTimeout(() => {
                playLevelMusic();
              }, 2000);
              dispatch({
                type: "lollipop",
                payload: { nextCell, points: 500, time: state.time + 15 },
              });
              setTimeout(() => {
                dispatch({
                  type: "lollipop_taken",
                  payload: { lollipop: undefined },
                });
              }, 3000);
            } else {
            }
          }
        }

        if(state.prizeShowTime <= 5 && state.prizeShowTime > 0){
          if (state.icecream) {
            if (nextCell.toString() === state.icecream.toString() && !state.icecreamTaken) {
              stopLevelMusic();
              playLevelEndMusic();
              setTimeout(() => {
                playLevelMusic();
              }, 2000);
              dispatch({
                type: "icecream",
                payload: { points: 1000, time: state.time + 30 },
              });
              setTimeout(() => {
                dispatch({
                  type: "icecream_taken",
                  payload: { icecream: undefined },
                });
              }, 3000);
            }
          } 
        } 
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPlaying, isPause, state, playLevelMusic, playLevelEndMusic, stopLevelMusic, currentUserHighScore]);

  useEffect(() => {
    if (state.time === 0) {
      stopLevelMusic();
      saveHighScore();
    }
  }, [state, stopLevelMusic]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        isPlaying,
        playLevelMusic,
        stopLevelMusic
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
