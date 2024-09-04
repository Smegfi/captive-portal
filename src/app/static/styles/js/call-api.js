document.getElementById("testbtn").addEventListener("click", callApi);
const action = document.getElementById("form").action;

const url = "";

function callApi() {
    let email = document.getElementById("emailAddress").value;

    fetch("http://127.0.0.1:5000/create-user?email=" + email)
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
