// Utility libaries
const jwt = require("jsonwebtoken");
const path = require('path');
const bcrypt = require('bcrypt');


// Server routes
module.exports = async function (server) {

    const users = new Map();
    users.set("Test", await bcrypt.hash("Pass", 10));
    
    server.get("/", (req, res) => {
        console.log("Here");
        res.redirect("/chat");
    });
    
    server.get("/chat", (req, res) => {
        res.sendFile(path.resolve("../client/views/chat.html"));
    });
    
    server.get("/login", (req, res) => {
        res.sendFile(path.resolve("../client/views/login.html"));
    });
    
    server.get("/register", (req, res) => {
        res.sendFile(path.resolve("../client/views/register.html"));
    });

    server.get("/vue", (req, res) => {
        res.sendFile(path.resolve("../vue/dist/index.html"));
    });
    
    // Authenticate user
    server.post("/login", async (req, res) => {
    
        let user = req?.body?.username;
        let pass = req?.body?.password;
    
        if ( !user || !pass) {
            res.json({message: "Invalid parameters"});
            return;
        }
    
        if ( !users.has(user) ) {
            res.json({message: "Account does not exist"});
            return;
        }
    
        try {
            const match = await bcrypt.compare(pass, users.get(user));
            
            if (match) {
                const token = jwt.sign({username: user}, process.env.JWT_SECRET, {expiresIn: "10h"});
                res.json({jwt: token});
                return;
            }
            else {
                res.json({message: "Invalid password"});
                return;
            }
        }
        catch {
            res.json({message: "Failed to login"});
            return;
        }
    });
    
    // Register user
    server.post("/register", async (req, res) => {
    
        let user = req?.body?.username;
        let pass = req?.body?.password;
    
        if ( !user || !pass) {
            res.json({message: "Invalid parameters"});
            return;
        }
    
        if (users.has(user)) {
            res.json({message: "Username already exists"});
            return;
        }
    
        try {
            const hashed = await bcrypt.hash(pass, 10);
            users.set(user, hashed);
    
            res.redirect("/login");
            return;
        }
        catch {
            res.json({message: "Failed to create account"});
            return;
        }
    });
}