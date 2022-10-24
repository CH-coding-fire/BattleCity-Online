import express from "express";
import { Request, Response } from "express";
import expressSession from "express-session";
import path from "path";
// import jsonfile from "jsonfile";
import { isLoggedIn } from "./guard";
import { quickGen, registerDB, checkDB, registerGoogle } from "./helper";
import pg from 'pg';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import grant from 'grant';
import crypto from 'crypto';
import env from './env';
import http from "http";
import { Server as SocketIO } from 'socket.io';
import playerClass, {
    findRoomAndAddPlayerInArray,
    playerArray,
    Player,
} from "./gameData/playerClass";
import { Bullet, bulletArray, addBulletToArray } from "./gameData/bullet";
import { selectControlTarget } from "./gameData/controlServerSide";
import { brickArray, Brick } from "./gameData/bricks";
import { createEnvironmentOjb, map1 } from "./gameData/createEnvironmentOjb";
import { steelArray, Steel } from "./gameData/steel";
import { waterArray, Water } from "./gameData/water";
import { plantArray, Plant } from "./gameData/plant";
const app = express();

const server = new http.Server(app);
export const io = new SocketIO(server);
const grantExpress = grant.express({
    "defaults": {
        "origin": "http://localhost:8080",
        "transport": "session",
        "state": true,
    },
    "google": {
        "key": env.GOOGLE_CLIENT_ID || "",
        "secret": env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile", "email"],
        "callback": "/login/google"
    }
});
dotenv.config();
export const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
})
async function connect() {
    await client.connect();
}
connect();


//Socket






app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const sessionMiddleware = expressSession({
    secret: 'Tecky Academy teaches typescript',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
});

app.use(sessionMiddleware);
io.use((socket, next) => {
    let req = socket.request as express.Request
    let res = req.res as express.Response
    sessionMiddleware(req, res, next as express.NextFunction)
});

//
let onlineUser = {};

export let roomObject = {};
export let roomNumAcc: number = 0;

let player1: string = "";
let player2: string = "";


//
io.on('connection', function (socket) {
    const req = socket.request as express.Request;

    console.log(`${socket.id}  : ${req.session && req.session['user'] ? req.session['user'] : ''} is connected to server`)

    if (req.session && req.session['user']) {
        // console.log(`add ${req.session['user'].name} to online list`);

        if (req.session['user'].name != undefined) {
            onlineUser[req.session['user'].name] = {
                socketId: socket.id,
                userName: req.session['user']
            }
        } else {
            onlineUser[req.session['user']] = {
                socketId: socket.id,
                userName: req.session['user']
            }
        }
        io.emit('new-user-online')
    }

    socket.on('chat', message => {
        //console.log('From client: ', message)
        io.emit('chat', message)
    })

    socket.on('disconnect', () => {
        if (req.session && req.session['user']) {
            if (req.session['user'].name != undefined) {
                let targetName = req.session['user'].name
                delete onlineUser[targetName]
                io.emit('new-user-online')
            } else {
                let targetName = req.session['user']
                delete onlineUser[targetName]
                io.emit('new-user-online')
            }
        }
    })
    //game
    socket.on('prepare', () => {

        if (!player1) {
            player1 = socket.id;
            console.log(`player1's socketID is: ${player1}`);
            findRoomAndAddPlayerInArray(socket.id, 100, 100);
        } else if (!player2) {
            player2 = socket.id;
            console.log(`player2's socketID is: ${player2}`);
            findRoomAndAddPlayerInArray(socket.id, 500, 500);
        } else {
            let inspectorID;
            inspectorID = socket.id;
            console.log(`inspector's socketID is: ${inspectorID}`);
        }
    });

    socket.on("keyDown", (key) => {
        let tankDirection: string = key;
        for (let i: number = 0; i < playerArray.length; i++) {
            if (playerArray[i].socketID == socket.id) {
                switch (tankDirection) {
                    case "up":
                        playerArray[i].move("up", "move");
                        break;
                    case "down":
                        playerArray[i].move("down", "move");
                        break;
                    case "left":
                        playerArray[i].move("left", "move");
                        break;
                    case "right":
                        playerArray[i].move("right", "move");
                        break;
                }
                console.log(playerArray[i].x, playerArray[i].y)
                socket.emit("playerNewPos", playerArray[i].x, playerArray[i].y);
            }
        }
    });

    socket.on("keyUp", (key) => {
        let tankDirection: string = key;
        for (let i: number = 0; i < playerArray.length; i++) {
            if (playerArray[i].socketID == socket.id && playerArray[i].hp != 0) {
                switch (tankDirection) {
                    case "up":
                        playerArray[i].move("", "stop");
                        break;
                    case "down":
                        playerArray[i].move("", "stop");
                        break;
                    case "left":
                        playerArray[i].move("", "stop");
                        break;
                    case "right":
                        playerArray[i].move("", "stop");
                        break;
                }
            }
        }
    });
    socket.on("tankFire", () => {
        for (let i: number = 0; i < playerArray.length; i++) {
            if (
                playerArray[i].socketID == socket.id &&
                playerArray[i].hp != 0 &&
                playerArray[i].coolDown == 0
            ) {
                playerArray[i].fire();
            }
        }
    });
    //
})

app.post('/message', (req, res) => {
    let content = req.body.content
    console.log(content);
    let data
    if (req.session['user'].name != undefined) {
        data = {
            from: req.session['user'].name,
            content
        }
    } else {
        data = {
            from: req.session['user'],
            content
        }
    }
    io.emit('new-message', data)
    res.json()

})

app.get('/online-users', (req, res) => {
    res.json(onlineUser)
})

app.get('/gameroom', isLoggedIn, async function (req: express.Request, res: express.Response) {
    res.redirect("/admin/gameroom.html")
})

app.get('/login/google', async function (req: express.Request, res: express.Response) {
    const accessToken = req.session?.['grant'].response.access_token;

    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: "get",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    //result
    const result = await fetchRes.json();

    const users = (await client.query(`SELECT * FROM users WHERE users.name = $1`, [result.email])).rows;
    const user = users[0];
    if (!user) {
        let password = crypto.randomBytes(20).toString('hex');
        await registerGoogle(result.email, password)
        // return res.status(401).redirect('/login.html?error=Incorrect+Username')
    }
    if (req.session) {
        req.session['user'] = result.name;
    }
    return res.redirect('/admin/chatroom.html')
})



// app.get('/game', isLoggedIn, function (req: Request, res: Response) {
//     // console.log([new Date()], 'Request' + req.path)
//     // console.log(req.session)
//     res.sendFile(path.resolve("./protected", "chatroom.html"))
// })


app.get('/', function (req: Request, res: Response) {
    // console.log([new Date()],'Request'+req.path)
    // console.log(req.session)
    res.sendFile(path.resolve("./public", "login.html"))
})

app.get('/a', function (req: Request, res: Response) {
    // console.log([new Date()],'Request'+req.path)
    // console.log(req.session)
    res.sendFile(path.resolve("./public", "loginPage.html"))
})

app.get('/register', function (req: Request, res: Response) {
    // console.log([new Date()], 'Request' + req.path)
    res.sendFile(path.resolve("./public", "register.html"))
})



app.post('/login', async function (req: Request, res: Response, next: express.NextFunction) {
    const { username, password } = req.body;
    console.log({ username, password });


    let foundUserRes = await client.query(`SELECT * from users where name = $1`, [username]);
    let foundUser = foundUserRes.rows[0]
    if (!foundUser) {
        console.log("user name not found")

        res.redirect('/a')
        return
    }

    console.log('password :', password);
    console.log('foundUser :', foundUser);


    let isPasswordValid = password == foundUser.password
    if (!isPasswordValid) {
        console.log("password incorrect")
        res.redirect('/a')
        return
    }

    delete foundUser.password
    req.session["user"] = foundUser;
    console.log(foundUser + " logined")
    io.emit('new-user-online')
    res.redirect('/admin/chatroom.html')

})




app.post('/register', async function (req: Request, res: Response) {
    const { username, password } = req.body;
    // console.log({ username, password });
    let foundUser;
    if (await checkDB(`'${username}'`)) {
        foundUser = true
    } else { foundUser = false }
    if (foundUser) {
        res.redirect('/register')
        console.log(req.body + "user name have been used")
    } else {
        await registerDB(`'${username}'`, `'${password}'`)
        console.log(`new account have been register`)
        res.redirect('/')
    }
})

app.post('/quickRegister', function (req: Request, res: Response) {
    let username = 'P' + quickGen();
    let user = username;
    req.session["user"] = user;

    console.log(user + " login")
    res.redirect('/admin/chatroom.html')
})




app.use(grantExpress as express.RequestHandler);
app.use(express.static("public"));
app.use('/admin', isLoggedIn, express.static("protected"));

app.use((req, res) => {
    res.sendFile(path.resolve("./404.html"));
});
const PORT = 8080;

server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});

export function createNewRoom() {
    roomNumAcc = roomNumAcc + 1;
    roomObject[`Room ${roomNumAcc}`] = {
        playerArray: [],
    };
}

let sendDataToCanvas: ReturnType<typeof setInterval> = setInterval(() => {
    io.emit(
        "dataFromServer",
        playerArray,
        bulletArray,
        brickArray,
        steelArray,
        waterArray,
        plantArray
    );
}, 50);

createEnvironmentOjb(map1);