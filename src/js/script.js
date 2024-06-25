const urlParams = new URLSearchParams(window.location.search);
const postParam = urlParams.get('post');
const magicParam = urlParams.get('magic');

window.onload = function () {
    // set action URL
    document.authlogin.action = get_action();
    // put post URL into callback URL box
    document.getElementById("callbackurl").value = postParam;
    document.getElementById("magic").value = magicParam;

}

function get_action() {
    return postParam;
}