const RoomDto = require("../dtos/room-dto");
const roomService = require("../services/room-service");

class RoomsController {
  async create(req, res) {
    // room
    const { topic, roomType } = req.body;

    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,   // middleware se aaya tha req.user._id --> userId hi hain
    });

    console.log(room);
    /*
{
  topic: 'hello',
  roomType: 'open',
  ownerId: new ObjectId('659511a2f15200e048ce4e8f'),
  speakers: [ new ObjectId('659511a2f15200e048ce4e8f') ],
  _id: new ObjectId('6595121305b5607c1ee382ed'),
  createdAt: 2024-01-03T07:51:47.907Z,
  updatedAt: 2024-01-03T07:51:47.907Z,
  __v: 0
}
    */

    return res.json(new RoomDto(room));
  }

      async index(req, res) {
          const rooms = await roomService.getAllRooms(['open']); // why array(['open']) instead of string('open')? 
        // Bcoz: In future we can show social and private rooms also.
        console.log(rooms);
        /*
    [
  {
    _id: new ObjectId('65951590bb2d5b2e1c4a1e81'),
    topic: 'Entrepreneurship',
    roomType: 'open',
    ownerId: {
      _id: new ObjectId('65951502bb2d5b2e1c4a1e72'),
      phone: '8292915594',
      activated: true,
      createdAt: 2024-01-03T08:04:18.458Z,
      updatedAt: 2024-01-03T08:04:39.884Z,
      __v: 0,
      avatar: '/storage/1704269079771-341550061.png',
      name: 'Himanshu Shekhar'
    },
    speakers: [ [Object] ],
    createdAt: 2024-01-03T08:06:40.251Z,
    updatedAt: 2024-01-03T08:06:40.251Z,
    __v: 0
  },
    ]
        */
          const allRooms = rooms.map((room) => new RoomDto(room));

          console.log(allRooms);
          /*
[
  RoomDto {
    id: new ObjectId('65951590bb2d5b2e1c4a1e81'),
    topic: 'Entrepreneurship',
    roomType: 'open',
    speakers: [ [Object] ],
    ownerId: {
      _id: new ObjectId('65951502bb2d5b2e1c4a1e72'),
      phone: '8292915594',
      activated: true,
      createdAt: 2024-01-03T08:04:18.458Z,
      updatedAt: 2024-01-03T08:04:39.884Z,
      __v: 0,
      avatar: '/storage/1704269079771-341550061.png',
      name: 'Himanshu Shekhar'
    },
    createdAt: 2024-01-03T08:06:40.251Z
  },
]
          */

/* avatar: '/storage/1704269079771-341550061.png',
   here http://localhost:5500 is missing because this thing is coming from user-dto not from room-dto;

   Solution: use getter function in user-model.js
*/
          return res.json(allRooms);
      }


      async show(req, res) {
          const room = await roomService.getRoom(req.params.roomId);
          console.log(room,'show room');
          return res.json(room);
      }
}
// a singleton instances
module.exports = new RoomsController();
