document.getElementById("submit-button").addEventListener("click", callApi);
const action = document.getElementById("form").action;

function callApi() {
    let email = document.getElementById("emailAddress").value;
    let user_mac = document.getElementById("macAddress").value;
    let urlPath = window.location.origin;

    fetch(`${urlPath}}/api/create-user?email=${email}&mac=${user_mac}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .then(data => {
            console.log(data.json());
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
