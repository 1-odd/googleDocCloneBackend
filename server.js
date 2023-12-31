import { Server } from 'socket.io';
import express from 'express';
import dotenv from 'dotenv'
import connectDB from './database/db.js';
import { getDocument ,updateDocument } from './controller/document.controller.js';
import { createServer } from 'http';




dotenv.config();

const app = express();
const PORT = process.env.PORT|| 9000;

const URL = process.env.DB_URL;

connectDB(URL);


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}


const httpServer = createServer(app);
httpServer.listen(PORT);

const io = new Server(httpServer);

io.on('connection', socket => {

    socket.on('get-document',async documentId => { // get the doc by id 
        // apply changes for only one id if id match changes applied esle not

        
        const document =  await getDocument(documentId)
        socket.join(documentId); 
        socket.emit('load-document',document.data)


        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes',delta);  // broadcast all changes with all other user in real time with same id only

    
        });
        socket.on('save-document',async data =>{
            await updateDocument(documentId,data);
        })

    })

   
    // console.log("connected")
});
