import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIo, getSocketId } from '../config/socket.js';

export const parseTagsAndNotify = async (content, authorId, postId) => {
    if (!content) return content;
    
    // Regex to find @username
    const tagRegex = /@([a-zA-Z0-9_]+)/g;
    let match;
    let newContent = content;
    const taggedUsers = new Set();

    while ((match = tagRegex.exec(content)) !== null) {
        const username = match[1];
        try {
            const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
            if (user && user._id.toString() !== authorId.toString()) {
                // Replace @username with [user=userId]username[/user]
                newContent = newContent.replace(new RegExp(`@${username}\\b`, 'gi'), `[user=${user._id}]${user.username}[/user]`);
                taggedUsers.add(user._id.toString());
            }
        } catch (err) {
            console.error('Error finding user for tag:', err);
        }
    }

    // Send notifications
    for (const userId of taggedUsers) {
        try {
            const notification = await Notification.create({
                user: userId,
                sender: authorId,
                type: 'tag',
                post: postId
            });
            const populatedNotif = await notification.populate('sender', 'username avatar');
            
            const receiverSocketId = getSocketId(userId);
            if (receiverSocketId) {
                getIo().to(receiverSocketId).emit('new_notification', populatedNotif);
            }
        } catch (err) {
            console.error('Error creating tag notification:', err);
        }
    }

    return newContent;
};
