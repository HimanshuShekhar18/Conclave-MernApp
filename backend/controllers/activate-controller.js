const Jimp = require('jimp');
const path = require('path');  // path module
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController {
    async activate(req, res) {
        // Activation logic
        const { name, avatar } = req.body;
        
        if (!name || !avatar) {
            res.status(400).json({ message: 'All fields are required!' });
        }

        // Image Base64
        // Convert this Base64 to image and store in our file system
        const buffer = Buffer.from(    // jo Base64 image usse pehle  hame nodsjs ke buffer mein convert karna hain
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),  // regular expression  // will work fine now for png/jpg/jpeg
            'base64'   // format batao existing ka 
        );

        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        // 32478362874-3242342342343432.png

        try {
            const jimResp = await Jimp.read(buffer);
            jimResp
                .resize(150, Jimp.AUTO)   // width 150px and height auto jimp khud decide karenga
                .write(path.resolve(__dirname, `../storage/${imagePath}`));
        } catch (err) {
            res.status(500).json({ message: 'Could not process the image' });
        }

        const userId = req.user._id;
        // Update user
        try {
            const user = await userService.findUser({ _id: userId });
            if (!user) {
                res.status(404).json({ message: 'User not found!' });
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            user.save();
            res.json({ user: new UserDto(user), auth: true });  // flag auth: true  // hamara respone jo StepAvatar.js mein jayega
        } catch (err) {
            res.status(500).json({ message: 'Something went wrong!' });
        }
    }
}

module.exports = new ActivateController();