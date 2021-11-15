import { injectable } from "tsyringe";
import { User } from "../schemas/User"

interface CreateUserDTO {
    email: String,
    socket_id: String,
    avatar: String,
    name: String,
}

@injectable()
class CreateUserUseService {
    async execute({ email, socket_id, avatar, name }: CreateUserDTO) {
        const userExists = await User.findOne({
            email
        }).exec();

        if(userExists) {
            const user = await User.findOneAndUpdate(
            {
                _id: userExists.id,
            },
            {
                $set: { socket_id, avatar, name }
            });
            return user;
        } else {
            const user = await User.create({
                email,
                socket_id,
                avatar,
                name
            })
            return user;
        }
    }
}

export { CreateUserUseService }