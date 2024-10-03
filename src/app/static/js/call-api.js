async function callApi() {
    let email = document.getElementById("email").value;
    let usermac = document.getElementById("usermac").value;
    let ssid = document.getElementById("ssid").value;
    let marketing = document.getElementById("marketing").checked || false;

    let urlPath = window.location.origin;
    const url = `${urlPath}/api/create-user?email=${email}&usermac=${usermac}&marketing=${marketing}&ssid=${ssid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        
        fillInTheData(json);
        sendTheForm();
    }
    catch (ex) {
        console.error(ex.message);
    }
}

function fillInTheData(data) {
    let username = document.getElementById("fortiUsername");
    let password = document.getElementById("fortiPassword");

    username.value = data.username;
    password.value = data.password;
}

function sendTheForm() {
    const form = document.getElementById("userForm");

    form.submit();
}
