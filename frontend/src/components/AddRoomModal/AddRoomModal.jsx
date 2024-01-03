import React, { useState } from 'react';
import styles from './AddRoomModal.module.css';
import {Textinput} from '../shared/Textinput/Textinput';
// import { createRoom as create } from '../../http';
import { useNavigate } from 'react-router-dom';
import { createRoom as create } from '../../http';


const AddRoomModal = ({ onClose }) => {
    const navigate = useNavigate();

    const [roomType, setRoomType] = useState('open');
    const [topic, setTopic] = useState('');

    async function createRoom() {
        try {
            if (!topic || !roomType){
                window.alert("Please Enter the Topic and Room Types");
                return;
            } 
            const { data } = await create({ topic, roomType });
            // data --> res.json(new RoomDto(room));
           
            navigate(`/room/${data.id}`);  // basically room._id or room.id
        } catch (err) {
            console.log(err.message);
        }
    }

    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button onClick={onClose} className={styles.closeButton}>
                    <img src="/images/close.png" alt="close" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>
                        Enter the topic to be disscussed
                    </h3>
                    <Textinput
                        fullwidth="true"
                        placeholder="Hello World..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onClear={() => setTopic("")}
                    />
                    <h2 className={styles.subHeading}>Room types</h2>
                    <div className={styles.roomTypes}>
                        <div
                            onClick={() => setRoomType('open')}
                            className={`${styles.typeBox} ${
                                roomType === 'open' ? styles.active : ''
                            }`}
                        >
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div
                            onClick={() => setRoomType('social')}
                            className={`${styles.typeBox} ${
                                roomType === 'social' ? styles.active : ''
                            }`}
                        >
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div>
                        <div
                            onClick={() => setRoomType('private')}
                            className={`${styles.typeBox} ${
                                roomType === 'private' ? styles.active : ''
                            }`}
                        >
                            <img src="/images/lock.png"  style={{marginTop: '15px'}} alt="lock" />
                            <span style={{marginTop: '15px'}} >Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRoomModal;