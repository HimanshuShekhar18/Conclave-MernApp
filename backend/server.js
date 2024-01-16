require("dotenv").config();
const express = require("express");
const app = express(); // express ko call karna hain, "const app" express ka main object
// HTTP SERVER
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const DbConnect = require("./database");
const router = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");

// WEBSOCKETS SERVER
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());
const corsOption = {
  credentials: true,
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOption));

/*
we want storage folder acts as a static file i.e. if someone wants to get image on the server 
*/
app.use("/storage", express.static("storage")); // http://localhost:5500/storage/1703878915788-76464958.png

const PORT = process.env.PORT || 5500;
DbConnect();

// json ka middleware Add this middleware to parse JSON data
// extending the limit of the size of req above 100KB
app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Hello from express Js");
});

// Sockets LOGIC

const socketUserMap = {}; // an empty object, mapping for kis user ka kon sa socket id hai

io.on("connection", (socket) => {
  // console.log(socket);
  console.log("New connection", socket.id);

  // join events/actions and callback function
  /* callback ke andar as an object receive kiya hun bcoz as an object pass kiya tha useWebRTC.js mein
  event listen --> .on
  event sending --> .emit
  */
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMap[socket.id] = user;

    // jitne bhi connected clients hai iss roomId ke andar unko get karna hain
    /* clients is an array consisting of unique socket id's of each client in that particular roomId */
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    console.log(io.sockets.adapter.rooms.get(roomId));
    console.log(clients, "hello");

    // Iterate over each client (peer) in the room
    // clientId is socket ids only
    clients.forEach((clientId) => {
      console.log("hi");
      // Send a message to the client (peer) with the current socket's information
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      // Send myself as well that much msgs how many clients
      // Send a message to the current socket (self) with the client's information
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      });
    });
    // Join the room
    // After exchanging signaling messages, the current socket (server or user) joins the specified room (roomId) using Socket.IO's join method.
    socket.join(roomId);
  });

  //  Handle Relay Ice  event/action and callback function
  /* callback ke andar as an object receive kiya hun bcoz as an object pass kiya tha useWebRTC.js mein
  event listen --> .on
  event sending --> .emit
  */
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      // kaam wahi hain RELAY_ICE wala to send event from server to client, but here ICE_CANDIDATE naam diya hai
      peerId: socket.id,
      icecandidate,
    });
  });

  // Handle Relay SDP
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    console.log("mute on server", userId);
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UNMUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  const leaveRoom = () => {
    const { rooms } = socket;
    // rooms ek object hain jisme key roomId hain and value a set of clientId
    console.log("leaving", rooms);
    console.log("socketUserMap", socketUserMap);
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMap[socket.id]?.id,
        });

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMap[clientId]?.id,
        });
      });
      socket.leave(roomId);
    });

    delete socketUserMap[socket.id];

    console.log("map", socketUserMap);
  };

  // Leaving the room event listening
  socket.on(ACTIONS.LEAVE, leaveRoom);

  socket.on("disconnecting", leaveRoom);
});

// now listen on server
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// console.log(socket);
// <ref *1> Socket {
//   _events: [Object: null prototype] { error: [Function: noop] },
//   _eventsCount: 1,
//   _maxListeners: undefined,
//   nsp: <ref *2> Namespace {
//     _events: [Object: null prototype] { connection: [Function (anonymous)] },
//     _eventsCount: 1,
//     _maxListeners: undefined,
//     sockets: Map(1) { 'c7ucMd1IApSzbarlAAAD' => [Circular *1] },
//     _fns: [],
//     _ids: 0,
//     server: Server {
//       _events: [Object: null prototype] {},
//       _eventsCount: 0,
//       _maxListeners: undefined,
//       _nsps: [Map],
//       parentNsps: Map(0) {},
//       parentNamespacesFromRegExp: Map(0) {},
//       _path: '/socket.io',
//       clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//       _connectTimeout: 45000,
//       _serveClient: true,
//       _parser: [Object],
//       encoder: [Encoder],
//       opts: [Object],
//       _adapter: [class Adapter extends EventEmitter],
//       sockets: [Circular *2],
//       eio: [Server],
//       httpServer: [Server],
//       engine: [Server],
//       _corsMiddleware: [Function: corsMiddleware],
//       [Symbol(kCapture)]: false
//     },
//     name: '/',
//     adapter: Adapter {
//       _events: [Object: null prototype] {},
//       _eventsCount: 0,
//       _maxListeners: undefined,
//       nsp: [Circular *2],
//       rooms: [Map],
//       sids: [Map],
//       encoder: [Encoder],
//       [Symbol(kCapture)]: false
//     },
//     [Symbol(kCapture)]: false
//   },
//   client: Client {
//     sockets: Map(1) { 'c7ucMd1IApSzbarlAAAD' => [Circular *1] },
//     nsps: Map(1) { '/' => [Circular *1] },
//     server: Server {
//       _events: [Object: null prototype] {},
//       _eventsCount: 0,
//       _maxListeners: undefined,
//       _nsps: [Map],
//       parentNsps: Map(0) {},
//       parentNamespacesFromRegExp: Map(0) {},
//       _path: '/socket.io',
//       clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//       _connectTimeout: 45000,
//       _serveClient: true,
//       _parser: [Object],
//       encoder: [Encoder],
//       opts: [Object],
//       _adapter: [class Adapter extends EventEmitter],
//       sockets: [Namespace],
//       eio: [Server],
//       httpServer: [Server],
//       engine: [Server],
//       _corsMiddleware: [Function: corsMiddleware],
//       [Symbol(kCapture)]: false
//     },
//     conn: Socket {
//       _events: [Object: null prototype],
//       _eventsCount: 3,
//       _maxListeners: undefined,
//       _readyState: 'open',
//       upgrading: false,
//       upgraded: false,
//       writeBuffer: [],
//       packetsFn: [],
//       sentCallbackFn: [],
//       cleanupFn: [Array],
//       id: 'z58xhUQsPTZ94zjxAAAC',
//       server: [Server],
//       request: [IncomingMessage],
//       protocol: 4,
//       remoteAddress: '::1',
//       pingTimeoutTimer: Timeout {
//         _idleTimeout: 45000,
//         _idlePrev: [TimersList],
//         _idleNext: [TimersList],
//         _idleStart: 688656,
//         _onTimeout: [Function (anonymous)],
//         _timerArgs: undefined,
//         _repeat: null,
//         _destroyed: false,
//         [Symbol(refed)]: true,
//         [Symbol(kHasPrimitive)]: false,
//         [Symbol(asyncId)]: 1008,
//         [Symbol(triggerId)]: 999
//       },
//       pingIntervalTimer: Timeout {
//         _idleTimeout: 25000,
//         _idlePrev: [TimersList],
//         _idleNext: [TimersList],
//         _idleStart: 688652,
//         _onTimeout: [Function (anonymous)],
//         _timerArgs: undefined,
//         _repeat: null,
//         _destroyed: false,
//         [Symbol(refed)]: true,
//         [Symbol(kHasPrimitive)]: false,
//         [Symbol(asyncId)]: 1006,
//         [Symbol(triggerId)]: 0
//       },
//       transport: [WebSocket],
//       [Symbol(kCapture)]: false
//     },
//     encoder: Encoder { replacer: undefined },
//     decoder: Decoder { reviver: undefined, _callbacks: [Object] },
//     id: 'z58xhUQsPTZ94zjxAAAC',
//     onclose: [Function: bound onclose],
//     ondata: [Function: bound ondata],
//     onerror: [Function: bound onerror],
//     ondecoded: [Function: bound ondecoded],
//     connectTimeout: undefined
//   },
//   recovered: false,
//   data: {},
//   connected: true,
//   acks: Map(0) {},
//   fns: [],
//   flags: {},
//   server: <ref *3> Server {
//     _events: [Object: null prototype] {},
//     _eventsCount: 0,
//     _maxListeners: undefined,
//     _nsps: Map(1) { '/' => [Namespace] },
//     parentNsps: Map(0) {},
//     parentNamespacesFromRegExp: Map(0) {},
//     _path: '/socket.io',
//     clientPathRegex: /^\/socket\.io\/socket\.io(\.msgpack|\.esm)?(\.min)?\.js(\.map)?(?:\?|$)/,
//     _connectTimeout: 45000,
//     _serveClient: true,
//     _parser: {
//       protocol: 5,
//       PacketType: [Object],
//       Encoder: [class Encoder],
//       Decoder: [class Decoder extends Emitter]
//     },
//     encoder: Encoder { replacer: undefined },
//     opts: { cors: [Object], cleanupEmptyChildNamespaces: false },
//     _adapter: [class Adapter extends EventEmitter],
//     sockets: <ref *2> Namespace {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       sockets: [Map],
//       _fns: [],
//       _ids: 0,
//       server: [Circular *3],
//       name: '/',
//       adapter: [Adapter],
//       [Symbol(kCapture)]: false
//     },
//     eio: Server {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       middlewares: [Array],
//       clients: [Object],
//       clientsCount: 1,
//       opts: [Object],
//       ws: [WebSocketServer],
//       [Symbol(kCapture)]: false
//     },
//     httpServer: Server {
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       requestTimeout: 300000,
//       headersTimeout: 60000,
//       keepAliveTimeout: 5000,
//       connectionsCheckingInterval: 30000,
//       joinDuplicateHeaders: undefined,
//       _events: [Object: null prototype],
//       _eventsCount: 5,
//       _maxListeners: undefined,
//       _connections: 1,
//       _handle: [TCP],
//       _usingWorkers: false,
//       _workers: [],
//       _unref: false,
//       allowHalfOpen: true,
//       pauseOnConnect: false,
//       noDelay: true,
//       keepAlive: false,
//       keepAliveInitialDelay: 0,
//       httpAllowHalfOpen: false,
//       timeout: 0,
//       maxHeadersCount: null,
//       maxRequestsPerSocket: 0,
//       _connectionKey: '6::::5500',
//       [Symbol(IncomingMessage)]: [Function: IncomingMessage],
//       [Symbol(ServerResponse)]: [Function: ServerResponse],
//       [Symbol(kCapture)]: false,
//       [Symbol(async_id_symbol)]: 20,
//       [Symbol(http.server.connections)]: ConnectionsList {},
//       [Symbol(http.server.connectionsCheckingInterval)]: Timeout {
//         _idleTimeout: 30000,
//         _idlePrev: [TimersList],
//         _idleNext: [TimersList],
//         _idleStart: 687498,
//         _onTimeout: [Function: bound checkConnections],
//         _timerArgs: undefined,
//         _repeat: 30000,
//         _destroyed: false,
//         [Symbol(refed)]: false,
//         [Symbol(kHasPrimitive)]: false,
//         [Symbol(asyncId)]: 8,
//         [Symbol(triggerId)]: 1
//       },
//       [Symbol(kUniqueHeaders)]: null
//     },
//     engine: Server {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       middlewares: [Array],
//       clients: [Object],
//       clientsCount: 1,
//       opts: [Object],
//       ws: [WebSocketServer],
//       [Symbol(kCapture)]: false
//     },
//     _corsMiddleware: [Function: corsMiddleware],
//     [Symbol(kCapture)]: false
//   },
//   adapter: <ref *4> Adapter {
//     _events: [Object: null prototype] {},
//     _eventsCount: 0,
//     _maxListeners: undefined,
//     nsp: <ref *2> Namespace {
//       _events: [Object: null prototype],
//       _eventsCount: 1,
//       _maxListeners: undefined,
//       sockets: [Map],
//       _fns: [],
//       _ids: 0,
//       server: [Server],
//       name: '/',
//       adapter: [Circular *4],
//       [Symbol(kCapture)]: false
//     },
//     rooms: Map(1) { 'c7ucMd1IApSzbarlAAAD' => [Set] },
//     sids: Map(1) { 'c7ucMd1IApSzbarlAAAD' => [Set] },
//     encoder: Encoder { replacer: undefined },
//     [Symbol(kCapture)]: false
//   },
//   id: 'c7ucMd1IApSzbarlAAAD',
//   handshake: {
//     headers: {
//       host: 'localhost:5500',
//       connection: 'Upgrade',
//       pragma: 'no-cache',
//       'cache-control': 'no-cache',
//       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       upgrade: 'websocket',
//       origin: 'http://localhost:3000',
//       'sec-websocket-version': '13',
//       'accept-encoding': 'gzip, deflate, br',
//       'accept-language': 'en-US,en;q=0.9',
//       cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk1MTUwMmJiMmQ1YjJlMWM0YTFlNzIiLCJpYXQiOjE3MDQ5ODEwODksImV4cCI6MTczNjUzODY4OX0.zxa98wq2pUeAwixl7pTyXAT4-M6TXqBVjmR_7DpfeRM; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk1MTUwMmJiMmQ1YjJlMWM0YTFlNzIiLCJpYXQiOjE3MDQ5ODEwODksImV4cCI6MTcwNDk4MTE0OX0.7rU1eBY0hRvqVLrc_MVTIxIMJiy0v8btMaQe2X9_2o0',
//       'sec-websocket-key': '9JDNSK/XdKssCupoP07XrA==',
//       'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits'
//     },
//     time: 'Thu Jan 11 2024 19:21:48 GMT+0530 (India Standard Time)',
//     address: '::1',
//     xdomain: true,
//     secure: false,
//     issued: 1704981108192,
//     url: '/socket.io/?EIO=4&transport=websocket',
//     query: [Object: null prototype] { EIO: '4', transport: 'websocket' },
//     auth: {}
//   },
//   [Symbol(kCapture)]: false
// }

// EXPLANATION:

// The provided output appears to be a snapshot of a Socket.IO socket object in a Node.js application. Here's an analysis of the key information present in the object:

// Socket Information:

// <ref *1> Socket {
//   _events: [Object: null prototype] { error: [Function: noop] },
//   _eventsCount: 1,
//   // ...
// }
// This part indicates the basic information about the Socket.IO socket, including event listeners and counts.

// Namespace Information:

// nsp: <ref *2> Namespace {
//   _events: [Object: null prototype] { connection: [Function (anonymous)] },
//   _eventsCount: 1,
//   // ...
// }
// It shows details about the namespace associated with the socket, including event listeners and counts.

// Client Information:

// client: Client {
//   sockets: Map(1) { 'c7ucMd1IApSzbarlAAAD' => [Circular *1] },
//   nsps: Map(1) { '/' => [Circular *1] },
//   server: Server {
//     // ...
//   },
//   conn: Socket {
//     // ...
//   },
//   // ...
// }
// This section provides information about the client associated with the socket, including socket and namespace mappings.

// Server Information:

// server: <ref *3> Server {
//   // ...
// }
// It indicates details about the Socket.IO server, including event listeners, configurations, and the underlying HTTP server.

// Adapter Information:

// adapter: <ref *4> Adapter {
//   // ...
// }
// This part shows information about the adapter used by the namespace, including rooms and socket IDs.

// Handshake Information:

// handshake: {
//   headers: {
//     // ...
//   },
//   time: 'Thu Jan 11 2024 19:21:48 GMT+0530 (India Standard Time)',
//   address: '::1',
//   xdomain: true,
//   secure: false,
//   // ...
// }
// It provides details about the handshake information, including headers, time, address, and other attributes.

// The provided output represents a detailed snapshot of a Socket.IO socket, its associated client, namespace, server, adapter, and handshake information. It is typical output for debugging and understanding the state of a Socket.IO connection in a Node.js application.
