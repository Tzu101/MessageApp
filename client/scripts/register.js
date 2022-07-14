import {restPOST} from "../utils/restAPI.js";


window.register = async function() {

    let user = document.getElementById("username").value;
    let pass1 = document.getElementById("password1").value;
    let pass2 = document.getElementById("password2").value;

    if ( !(pass1 && pass1 == pass2 && user) )
        return;

    restPOST(window.location.origin + "/register", {username: user, password: pass1}, async (response) => {
        console.log(await response.json());
    });
}



