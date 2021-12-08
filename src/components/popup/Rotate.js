import React from 'react';
import styles from './Rotate.module.css';
import {useGameContext} from "../../GameContext";
import useScreenOrientation from 'react-hook-screen-orientation'

const Notification = () => {
    const {isPlaying} = useGameContext();
    const screenOrientation = useScreenOrientation()

    return (
        // (isPlaying) &&
        <div>            
            {screenOrientation === "portrait-primary" || screenOrientation === "portrait-secondary" ? (<div className={styles.rotate}>Please rotate your device</div>) : null}
        </div>
    );
}

export default Notification;
