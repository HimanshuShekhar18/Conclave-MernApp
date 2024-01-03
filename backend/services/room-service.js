const RoomModel = require('../models/room-model');
class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;

        
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }

    async getAllRooms(types) {   // types --> is an array
        const rooms = await RoomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')
            .exec();
            // populate se pura data store ho jayega speaker and ownerId
        return rooms;
    }

    async getRoom(roomId) {
        const room = await RoomModel.findOne({ _id: roomId });
        return room;
    }
}
module.exports = new RoomService();