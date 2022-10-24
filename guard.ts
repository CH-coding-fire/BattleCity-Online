import { log } from "console";
import express from "express";

export const isLoggedIn = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    log('user = ', req.session["user"])
    if (req.session && req.session["user"]) {
        //called Next here
        next();
    } else {
        // redirect to index page
        console.log("you are not log in , redirect now!!!");
        res.redirect("/");
    }
};