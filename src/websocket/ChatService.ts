import { container } from 'tsyringe';
import { io } from '../http';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateMessageService } from '../services/CreateMessageService';
import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService';

//emit = enviar informação para o cliente
// io.emit = enviar pata todos os usuários
//socket.emit = somente esse usuário
//socket.broadcast = envia pra todos os usuários menos o atual
//socket.join = insere o usuário em uma sala
// io.to envia uma mensagem para um usuário ou sala

io.on('connect', socket => {

    socket.on("start", async (data) => {
        const { email, avatar, name } = data;
        const createUserService = container.resolve(CreateUserService);

        const user = await createUserService.execute({
            email,
            avatar,
            name,
            socket_id: socket.id,
        });

        socket.broadcast.emit("new_users", user);
    });

    socket.on("get_users", async (callback) => {
        const getAllUsersService = container.resolve(GetAllUsersService);
        const users = await getAllUsersService.execute();
        callback(users);
    });

    socket.on("start_chat", async (data, callback) => {
        const createChatRoomService = container.resolve(CreateChatRoomService);
        const getUSerBySocketIdService = container.resolve(GetUserBySocketIdService);
        const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
        const userLogged = await getUSerBySocketIdService.execute(socket.id);

        let room = await getChatRoomByUsersService.execute([data.idUser, userLogged._id]);

        if (!room) {
            room = await createChatRoomService.execute([data.idUser, userLogged._id]);
        }

        socket.join(room.idChatRoom);

        callback({ room });
    });

    socket.on("message", async (data) => {
        const getUSerBySocketIdService = container.resolve(GetUserBySocketIdService);
        const createMessageService = container.resolve(CreateMessageService);

        const userLogged = await getUSerBySocketIdService.execute(socket.id);

        const message = await createMessageService.execute({
            to: userLogged._id,
            text: data.message,
            roomId: data.idChatRoom,
        });

        io.to(data.idChatRoom).emit("message", {
            message,
            user: userLogged,
        });
    });

    // socket.emit("notification", async (data) => {
    //     console.log(data);
    // });
});
