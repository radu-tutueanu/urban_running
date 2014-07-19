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

//validare pe butoanele radio
function validateAndSave() {

  var len_circ = document.ContactForm.circ.length;
  var len_caini = document.ContactForm.caini.length;
  var len_lum = document.ContactForm.caini.length;
  var ales_circ = "";
  var ales_caini = "";
  var ales_lum = "";
  var den_box = document.ContactForm.denumire.value;
  var cand_box = document.ContactForm.cand.value;
  var unde_box = document.ContactForm.unde.value;
  var sig_box = document.ContactForm.sig.value;
  var obs_box = document.ContactForm.nume_obs.value;
  var i;

  //validare pentru întrebarea cu circulație
  for (i = 0; i < len_circ; i++) {
    if (document.ContactForm.circ[i].checked) {
      ales_circ = document.ContactForm.circ[i].value;

    }
  }

  //validarea pentru întrebarea cu câini
  for (i = 0; i < len_caini; i++) {
    if (document.ContactForm.caini[i].checked) {
      ales_caini = document.ContactForm.caini[i].value;

    }
  }

  //validare pentru întrebarea cu lumini
  for (i = 0; i < len_lum; i++) {
    if (document.ContactForm.lum[i].checked) {
      ales_lum = document.ContactForm.lum[i].value;
    }
  }


  if (ales_circ == "" || ales_caini == "" || ales_lum == "" || cand_box.length < 1 || unde_box.length < 1 || sig_box.length < 1 || den_box.length < 1) {
    document.getElementById("eroare_rasp").innerHTML = "Te rugăm să completezi toate răspunsurile obligatorii."
  }

  //dacă toate răspunsurile sunt bifate elimin mesajul
  if (ales_circ != "" && ales_caini != "" && ales_lum != "" && cand_box.length > 1 && unde_box.length > 1 && sig_box.length > 1 && den_box.length > 1) {
    document.getElementById("eroare_rasp").innerHTML = "";
    routeToSend = createRouteJsonWithoutPoints(den_box, ales_circ, ales_caini, ales_lum, cand_box, unde_box, sig_box, obs_box);
    sendCurrentRoute(current, routeToSend);
    alert('Traseul salvat! Apăsați pe OK pentru a fi redirectionat către pagina principală.');
    window.open("/index.html", "_self");
  }


} //închide funcția