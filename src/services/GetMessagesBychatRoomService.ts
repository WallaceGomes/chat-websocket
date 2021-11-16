import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
class GetMessagesBychatRoomService {
    async execute(roomId: string) {
        const messages = await Message.find({
            roomId
        }).populate("to").exec();
        return messages;
    }
}

export { GetMessagesBychatRoomService }