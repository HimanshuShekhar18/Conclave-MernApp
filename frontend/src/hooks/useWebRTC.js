import { useState, useCallback, useEffect, useRef } from "react";
import { ACTIONS } from "../actions";
import socketInit from "../socket";
import freeice from "freeice";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomId, user) => {
  // clients --> state, setClients --> methods and useStateWithCallback is custom hook ([] --> initial state empty array)
  /*
      they are just normal useState, but
      setClient is a method is design in such a way that after state update, it's second parameter will be callback()
      
      */
  // as an array receive kar rahe hain
  const [clients, setClients] = useStateWithCallback([]); // list of all users in a room

  /*
          setClients((prev) => {} , (state) => {} );
      state ko update karne ke baad (prev) => {};  ek callback chaiye tha run karne ke liye (state) => {} iske andar "state" mil raha hain
      mil kaha se raha hain? cbRef.current(state);
  */

  /*
      maintaining lists of all audio elements and maintaining its mapping ki kon sa user ka ye audio element hain
      */
  const audioElements = useRef({}); // empty object

  const connections = useRef({}); // for storing all peer connections, starting empty object

  const socket = useRef(null);

  const localMediaStream = useRef(null); // jab hum connect hojayege to hamari ek local media stream hongi usko store karna hain

  const clientsRef = useRef(null);

  //   <----------------------------------------------------------------------------------------------------------------------------------------------------->

  // Initializing the Socket.IO client instance
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  //   <------------------------------------------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    clientsRef.current = clients;
    console.log('clientsRef',clientsRef.current);
  }, [clients]);

  //   <------------------------------------------------------------------------------------------------------------------------------------------------->

  // wrapper function of setClients, basically wrapper function is similar to setClients with some checks
  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      console.log("clients", clients, lookingFor);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
        clients.push(newClient);
      }
      console.log("clients", clients, lookingFor);
    },
    [clients, setClients]
  );

  // <--------------------------------------------------------------------------------------------------------------------------------------------------->

  //   <-------------------------------------------------------------------------------------------------------------------------------------------------->

  // Capturing media (audio, mic etc.)
  /* Complete code explanation step-by-step in word */
  useEffect(() => {
    const startCapture = async () => {
      // Start capturing local audio stream.
      // hamare browser(window) ke andar navigator naam ka object rehta hain
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log(localMediaStream, "localaMediaStream");
      /* 
      {current: MediaStream} 'localaMediaStream'
      current: MediaStream
       active: true
       id: "f5d4a03f-67e6-41d5-9a20-44cf577ee622"
       onactive: null
       onaddtrack: null
       oninactive: null
       onremovetrack: null
       [[Prototype]]: MediaStream
       [[Prototype]]: Object 
      */
    };

    // startCapture() ko call karna so that capturing starts
    startCapture().then(() => {
      // audio capture karne ke baad add current user to clients list
      /* but setClient ko run karne se pehle we want some internal checks for this we make a wrapper function for setClinets jiske andar hum extra checks hain wo lagayenge */
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0; // warna apne awaaz ko sunege do baar
          localElement.srcObject = localMediaStream.current;
        }
        // Emit the action to join
        socket.current.emit(ACTIONS.JOIN, {
          roomId,
          user,
        });
      });
    });

    // Leaving the room
    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  // <--------------------------------------------------------------------------------------------------------------------------------------------------->

  // Handle new peer
  useEffect(() => {
    const handleNewPeer = async ({
      // kuch data chahiye hume peer handle karne ke liye, so object receive karte hain
      peerId, // socketId hi hain
      createOffer /* jo connect karna cha raha hain(pehli party), wo offer create karega and jo connect hona cha raha hain, wo offer create nahi karenga */,
      user: remoteUser, // aliasing --> different name
    }) => {
      // If already connected then prevent connecting again
      if (peerId in connections.current) {
        //   window.alert("You are already connected ");
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }
      /*
      Basically connections is an object
      const connections = {
            socketId = connection
      }
      */
      // Store it to connections
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(), // public id router ki  of computer
      });
      // Handle new ice candidate on this peer connection
      connections.current[peerId].onicecandidate = (event) => {
        // jitne bhi new ice candidate aaye hain, wo turant hume dusre client ko bhejna hain so that add them, emit event
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      console.log("track");

      // Handle on track(channel) event on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        console.log(remoteStream, "REMOTESTREAM");
        addNewClient({ ...remoteUser, muted: true }, () => {
          console.log("track");
          // agar audio player hain
          if (audioElements.current[remoteUser.id]) {
            // remoteUser.id ki jo voice hain  hume uss player ke andar aa jaye
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };
      /* jitne bhi localtracks(localMediaStream) hain, wo hume har ek track iss connections ke tracks mein add karna hain, so that hamara jo voice hain wo dusre client ko chala jaye  i.e dusre client ka jo connection hain uske andar jo hamara stream hain wo connect ho jaye
      Add local track to remote connections
      getTracks() --> all types of audio and video tracks
      */
      console.log(localMediaStream, "localMediaStream 181");
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current); // (kon si track add karni hain, kis stream ka track hain)
      });
      // Create an offer if required
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        // Set as local description
        await connections.current[peerId].setLocalDescription(offer);
        /*
            SDP (Session Description Protocol) is the standard describing a peer-to-peer connection. SDP contains the codec, source address, and timing information of audio and video.
            */
        // send offer to another client but we cannot send directly to the client, so first send it to the server via WebSockets (intermediary)
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };
    // Listen for add peer event from WebSocket Server
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    /* It's important to handle cleanup in the return function to avoid memory leaks or unexpected behavior when the component is unmounted.
    For Listener Unsubscibe
    */
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  //   <-------------------------------------------------------------------------------------------------------------------------------------------------->

  // Handle ice candidate
  // what is ice candidate --> explained in doc
  useEffect(() => {
    // listen karna hain jo server se aaya hain
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      // console.log('ices', connections.current[peerId]);
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);
  //   <-------------------------------------------------------------------------------------------------------------------------------------------------->
  // Handle session description
  useEffect(() => {
    const setRemoteMedia = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      /*
      This way is also correct, but sometimes it doesn't works in some browsers
      connections.current[peerId].setRemoteDescription(remoteSessionDescription);
      */
      // so instance bana lo
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );
      // If session descrition is offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, [clients]);

  // <-------------------------------------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    window.addEventListener("unload", function () {
      alert("leaving");
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    });
  }, []);

  // <-------------------------------------------------------------------------------------------------------------------------------------------->
  // handle Remove Peer
  useEffect(() => {
    const handleRemovePeer = ({ peerID, userId }) => {
      // peerID --> socketId and userId --> user.id (to remove audio element)
      console.log("leaving", peerID, userId);
      if (connections.current[peerID]) {
        // connection ko close karo
        connections.current[peerID].close();
      }
      delete connections.current[peerID];
      delete audioElements.current[userId];
      setClients((list) => list.filter((c) => c.id !== userId));
      window.location.reload();
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  // <--------------------------------------------------------------------------------------------------------------------------------------------------->

  useEffect(() => {
    // handle mute and unmute
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      console.log("muting", userId);
      setMute(true, userId);
    });

    socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
      console.log("unmuting", userId);
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);
      const allConnectedClients = JSON.parse(
        JSON.stringify(clientsRef.current)
      );
      if (clientIdx > -1) {
        console.log(mute,'mute');
        allConnectedClients[clientIdx].muted = mute;
        setClients(allConnectedClients);
      }
    };
  }, []);

  // <--------------------------------------------------------------------------------------------------------------------------------------------------->

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  // <--------------------------------------------------------------------------------------------------------------------------------------------------->

  const handleMute = (isMute, userId) => {
    console.log("muuuutttee", isMute);
    let settled = false;

    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: user.id,
            });
          } else {
            socket.current.emit(ACTIONS.UNMUTE, {
              roomId,
              userId: user.id,
            });
          }
          console.log(
            "localMediaStream ",
            localMediaStream.current.getTracks()
          );
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  return { clients, provideRef, handleMute };
};