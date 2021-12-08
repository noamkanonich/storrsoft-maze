import styles from './App.module.css';
import Header from "./components/header/Header";
import Popup from "./components/popup/Popup";
import Rotate from "./components/popup/Rotate";
import Pause from "./components/popup/Pause";
import Board from "./components/board/Board";

const App = () => {
    return (
        <div className={styles.root}>
            <Header/>
            <Board/>
            <Popup/>
            <Rotate/>
            <Pause/>
        </div>
    );
}

export default App;
