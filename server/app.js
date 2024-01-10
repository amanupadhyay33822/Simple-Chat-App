import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3000;

const app = express();
const secretKeyJWT = "asdasdsadasdasdasdsa";
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET", "HEAD", "OPTIONS", "POST"],
        credentials:true,
    }
});

// app.use(
//     cors({
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     })
//   );

app.get('/', (req, res) => {
    res.send('Welcome')
})
app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);
  
    res
      .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
      .json({
        message: "Login Success",
      });
  });
//   io.use((socket, next) => {
//     cookieParser()(socket.request, socket.request.res, (err) => {
//       if (err) return next(err);
  
//       const token = socket.request.cookies.token;
//       if (!token) return next(new Error("Authentication Error"));
  
//       const decoded = jwt.verify(token, secretKeyJWT);
//       next();
//     });
//   });
  

io.on("connection",(socket)=>{
    console.log("Connection established");
    console.log("ID: "+ socket.id);
    socket.on("message",(data)=>{
        console.log(data );
        socket.to(data.room).emit("received-message", data.message);
    })

    socket.on("join-room",(room)=>{
        socket.join(room)
        
    })
})


//app.listen will create new instance but server will not create new instance 
server.listen(port,()=>{
    console.log(`listening on ${port}`);
});