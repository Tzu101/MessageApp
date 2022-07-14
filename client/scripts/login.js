import {restPOST} from "../utils/restAPI.js";


window.login = async function() {

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if ( !(user && pass) )
        return;

    restPOST(window.location.origin + "/login", {username: user, password: pass}, async (response) => {
        let jwt = (await response.json()).jwt;
        sessionStorage.setItem("jwt", jwt);
        window.location.replace(window.location.origin + "/chat");
    });
}