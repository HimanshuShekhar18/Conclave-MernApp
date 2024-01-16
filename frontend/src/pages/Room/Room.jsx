import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./Room.module.css";
import { getRoom } from "../../http/index";

const Room = () => {
  const { id: roomId } = useParams(); //  dynamic routes and extracting parameters from the URL in React applications.
  const user = useSelector((state) => state.auth.user);

  // move your logic by creating custom hooks
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [uniqueClients, setUniqueClients] = useState([]);

  useEffect(() => {
    // Create a Set based on unique client IDs
    const uniqueClientIds = new Set(clients.map(client => client.id));
  
    // Create a new array of unique clients using the Set of client IDs
    const uniqueClientsArray = Array.from(uniqueClientIds).map(clientId =>
      clients.find(client => client.id === clientId)
    );
  
    // Update state with the new array of unique clients
    setUniqueClients(uniqueClientsArray);
  }, [clients]);

  console.log(uniqueClients,'numberOfClients');

  const navigate = useNavigate();

  const handManualLeave = () => {
    navigate("/rooms");
  };

  const [room, setRoom] = useState(null);
  const [isMuted, setMuted] = useState(true);


  // jaise hi hamara component load hojayega to ye function call honga
  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    handleMute(isMuted, user.id);
  }, [isMuted]);

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) {
      return;
    }
    setMuted((prev) => !prev);
  };

  return (
    <div>
      <div className="container">
        <button onClick={handManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>

      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          {room && <h2 className={styles.topic}>{room?.topic}</h2>}
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>

        <div className={styles.clientsList}>
          {
            // expression { } ke andar likhi jati hain
            uniqueClients.map((client, index) => {
              return (
                <div
                  className={styles.client}
                  key={`uniqueKey_${client.id}_${index}`}
                >
                  <div className={styles.userHead}>
                    <img
                      className={styles.userAvatar}
                      src={client.avatar}
                      alt=""
                    />
                    <audio
                      ref={(instance) => {
                        provideRef(instance, client.id); // provideRef ek function hain jo instance provide karta hain current audio element ka
                      }}
                      autoPlay
                      // controls
                      playsInline
                    ></audio>
                    <button
                      onClick={() => handleMuteClick(client.id)}
                      className={styles.micBtn}
                    >
                      {client.muted ? (
                        <img
                          className={styles.mic}
                          src="/images/mic-mute.png"
                          alt="mic"
                        />
                      ) : (
                        <img
                          className={styles.micImg}
                          src="/images/mic.png"
                          alt="mic"
                        />
                      )}
                    </button>
                  </div>
                  <h4>{client.name}</h4>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Room;
