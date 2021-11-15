import { io } from '../http';

//emit = enviar informação para o cliente
// io.emit = enviar pata todos os usuários
//socket.emit = somente esse usuário

io.on('connect', socket => {

    socket.emit('chat_iniciado', {
        message: 'Seu chat foi iniciado',
    });
});
