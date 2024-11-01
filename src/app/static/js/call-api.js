async function callApi() {
    let email = document.getElementById("email").value;
    let usermac = document.getElementById("usermac").value;
    let ssid = document.getElementById("ssid").value;
    let marketing = document.getElementById("marketing").checked || false;

    let urlPath = window.location.origin;
    const url = `${urlPath}/api/create-user?email=${email}&usermac=${usermac}&marketing=${marketing}&ssid=${ssid}`;

    try {
        loader();
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            fillInTheData(json);
            sendTheForm();
        }
        else {
            throw new Error(`Response status: ${response.status}`);
        }
    }
    catch (ex) {
        console.error(ex.message);
    }
    finally {
        loaderStop();
    }
}

function fillInTheData(data) {
    let username = document.getElementById("fortiUsername");
    let password = document.getElementById("fortiPassword");

    if(data.statusCode == 200){
        username.value = data.username;
        password.value = data.password;
    }
    else {
        throw new Error("Ze serveru se vrátila chyba");
    }
}

function sendTheForm() {
    const form = document.getElementById("userForm");

    form.submit();
}

function loader() {
    let button = document.getElementById("button-holder");

    var newBtn = `<button class="btn btn-primary mb-4 p-3 px-4" type="button" id="submit-button" disabled><span class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>Připojuji</button>`
    button.innerHTML = newBtn;
}

function loaderStop() {
    let button = document.getElementById("button-holder");
    var oldBtn = `<button type="button" class="btn btn-primary mb-4 p-3 px-4" id="submit-button" onclick="callApi()">Připojit se</button>`
    button.innerHTML = oldBtn;
}