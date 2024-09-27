const action = document.getElementById("form");

async function callApi() {
    let email = document.getElementById("emailAddress").value;
    let user_mac = document.getElementById("macAddress").value;
    let urlPath = window.location.origin;
    const url = `${urlPath}/api/create-user?email=${email}&mac=${user_mac}`;

    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();        
        fillInTheData(json);
        action.submit();
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
