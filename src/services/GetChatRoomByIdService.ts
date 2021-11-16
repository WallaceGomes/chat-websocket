import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
class GetChatRoomByIdService {
    async execute(idChatRoom: string) {
        const chatRoom = await ChatRoom.findOne({
            idChatRoom
        }).populate("idUsers").exec();
        return chatRoom;
    }
}

export { GetChatRoomByIdService }