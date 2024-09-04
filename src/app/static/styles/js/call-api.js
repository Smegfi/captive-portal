document.getElementById("testbtn").addEventListener("click", callApi);
const action = document.getElementById("form").action;

const url = "";

function callApi() {
    let email = document.getElementById("emailAddress").value;
    let user_mac = document.getElementById("macAddress").value;

    fetch(`http://10.41.10.11/create-user?email=${email}&mac=${user_mac}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
