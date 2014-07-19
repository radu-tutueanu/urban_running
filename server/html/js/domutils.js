function openColorBox() {
  $.colorbox({
    iframe: true,
    width: "50%",
    height: "53%",
    href: "/pop-up.html"
  });

}

function openLogin() {
  document.getElementById("fundal_id").style.visibility = "visible";
  document.getElementById("login").style.visibility = "visible";
  document.getElementById("user_id").style.visibility = "visible";
  document.getElementById("pass_id").style.visibility = "visible";
  document.getElementById("button_id").style.visibility = "visible";

}

function validateLogin() {
  var len_user = document.loginForm.nume_util.value;
  var len_pass = document.loginForm.parola.value;
  if (len_user.length < 1 || len_pass.length < 1) {
    document.getElementById("eroare_rasp").innerHTML = "Te rugăm să completezi ambele câmpuri.";
  } else
  // if (len_user == "Narcis" && len_pass == "parola") {
    window.open("/adauga_traseu.html", "_self");
  /*} else {
    document.getElementById("eroare_rasp").innerHTML = "Combinația nume de utilizator-parolă este incorectă.";
  } */
} //închide funcția

function resetForm() {
  document.getElementById("login").reset();
}
