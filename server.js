const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const app= express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


let roomId={}
let names={}
let usersInRoom={}

server.listen(process.env.PORT||3000,(err)=>{
	console.log(err)
})

app.use(cors());

app.use(bodyParser.json());

app.get("/",(req,res)=>console.log("working"))


io.on('connection',(socket)=>{
	console.log("socket ",socket.id, "is connected")
	socket.emit("connect",{})

	socket.on("name",(data)=>{
		socket.join(data.name)
		names[socket.id]=(data.name)
		console.log(socket.id, "chose name")
		
	})

	socket.on("id",(data)=>{
		socket.join(data.id)
		roomId[socket.id]=(data.id)
		console.log(socket.id, "joined", data.id)

		if(!usersInRoom[roomId[socket.id]]){
			usersInRoom[roomId[socket.id]]=[]
			usersInRoom[roomId[socket.id]].push(names[socket.id])
		}else{
			usersInRoom[roomId[socket.id]].push(names[socket.id])
		}
		io.in(roomId[socket.id]).emit("usersList",{usersList:usersInRoom[roomId[socket.id]]})
		
	})


	socket.on("message",(data)=>{
		let newMessage=names[socket.id]+": "+data.message
		io.in(roomId[socket.id]).emit("messageGet",{message:newMessage})
	
	})
	
})