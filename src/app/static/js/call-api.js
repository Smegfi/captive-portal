async function callApi() {
    let email = document.getElementById("email").value;
    let usermac = document.getElementById("usermac").value;
    let ssid = document.getElementById("ssid").value;
    let marketing = document.getElementById("marketing").checked || false;
    let errorMessages = document.getElementById("error-messages");

    let urlPath = window.location.origin;
    const url = `${urlPath}/api/create-user?email=${email}&usermac=${usermac}&marketing=${marketing}&ssid=${ssid}`;

    try {
        const response = await fetch(url);
        const jsonResult = await response.json();

        if (jsonResult.status == 500) {
            errorMessages.innerHTML += '<p class="text-danger">' + jsonResult.message + '</div>';
            throw new Error(jsonResult.message);
        }
        else {
            fillInTheData(jsonResult);
            sendTheForm();
        }
    }
    catch (ex) {
        console.error(ex.message);
    }
}

function fillInTheData(response) {
    let username = document.getElementById("fortiUsername");
    let password = document.getElementById("fortiPassword");
    username.value = response.data.username;
    password.value = response.data.password;
}

function sendTheForm() {
    const form = document.getElementById("userForm");
    form.submit();
}
