import React from 'react';
import styles from './Popup.module.css';
import {useGameContext} from "../../GameContext";

const Notification = () => {
    const {isPause} = useGameContext();

    return (
        isPause ? (
        <div className={styles.root}>
            PAUSE
        </div>
        ) : (<></>)
    );
}

export default Notification;
