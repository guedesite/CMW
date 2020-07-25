// cookies consent
window.addEventListener("load", function () {
	window.cookieconsent.initialise({
		"palette": {
			"popup": {
				"background": "var(--lightest-color-bg)"
			},
			"button": {
				"background": "var(--secondary-color-bg)",
				"text": "var(--base-color)",
				"border": "var(--active-color)"
			}
		},
		"position": "bottom-left",
		"content": {
			"message": "Ce site utilise des cookies permettant d'améliorer votre expérience utilisateur.",
			"dismiss": "J'ai compris",
			"link": "Voir plus..."
		}
	})
});

//Scroll to Top 
window.onscroll = function () {
	divScroll()
};

function divScroll() {
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		document.getElementById("divScroll").style.display = "block";
	} else {
		document.getElementById("divScroll").style.display = "none";
	}
}

function goToTop() {
	$('html, body').animate({
		scrollTop: 0
	}, 1000);
}


//Inscription page

function securPass() {

	//Gestion des mots de passes, sa sécurité, sa correspondance avec la confirmation et la possibilité de s'inscrire.
	$("#progress").removeClass("d-none");
	result = zxcvbn($("#MdpInscriptionForm").val());
	if (result['score'] == 0) {
		$("#progressbar").addClass("bg-danger");
		$("#progressbar").css('width', '0%');
		$("#progressbar").attr('aria-valuenow', '0');
	} else if (result['score'] == 1) {
		if ($("#progressbar").hasClass("bg-warning"))
			$("#progressbar").removeClass("bg-warning");
		else if ($("#progressbar").hasClass("bg-success"))
			$("#progressbar").removeClass("bg-success");
		$("#progressbar").addClass("bg-danger");
		$("#progressbar").css("width", "25%");
		$("#progressbar").attr("aria-valuenow", "25");
	} else if (result['score'] == 2) {
		if ($("#progressbar").hasClass("bg-success"))
			$("#progressbar").removeClass("bg-success");
		else if ($("#progressbar").hasClass("bg-danger"))
			$("#progressbar").removeClass("bg-danger");
		$("#progressbar").addClass("bg-warning");
		$("#progressbar").css("width", "50%");
		$("#progressbar").attr("aria-valuenow", "50");
	} else if (result['score'] == 3) {
		if ($("#progressbar").hasClass("bg-warning"))
			$("#progressbar").removeClass("bg-warning");
		else if ($("#progressbar").hasClass("bg-danger"))
			$("#progressbar").removeClass("bg-danger");
		$("#progressbar").addClass("bg-success");
		$("#progressbar").css("width", "75%");
		$("#progressbar").attr("aria-valuenow", "75");
	} else if (result['score'] == 4) {
		if ($("#progressbar").hasClass("bg-warning"))
			$("#progressbar").removeClass("bg-warning");
		else if ($("#progressbar").hasClass("bg-danger"))
			$("#progressbar").removeClass("bg-danger");
		$("#progressbar").addClass("bg-success");
		$("#progressbar").css("width", "100%");
		$("#progressbar").attr("aria-valuenow", "100");
	}
	if ($("#MdpInscriptionForm").val() != '' && $("#MdpConfirmInscriptionForm").val() != '') {
		if ($("#MdpInscriptionForm").val() == $("#MdpConfirmInscriptionForm").val()) {
			$("#correspondance").addClass("text-success");
			if ($("#correspondance").hasClass("text-danger"))
				$("#correspondance").removeClass("text-danger");
			$("#correspondance").html("Les mots de passes rentrés correspondent !!!");
			$("#InscriptionBtn").removeAttr("disabled");
		} else {
			$("#correspondance").addClass("text-danger");
			if ($("#correspondance").hasClass("text-success"))
				$("#correspondance").removeClass("text-success");
			$("#correspondance").html("Les mots de passes rentrés ne correspondent pas !!!");
		}
		if ($("#MdpInscriptionForm").val() != $("#MdpConfirmInscriptionForm").val()) {
			$("#InscriptionBtn").attr("disabled", true);
		}
	} else {
		$("#InscriptionBtn").attr("disabled", true);
		$("#correspondance").html("");
	}
}


//Script Profile page

function getUploadFileName(target) {

	document.getElementById("file-name").innerHTML = target.files[0].name;
}


//Form 

var nbclic = 0 // Initialisation à 0 du nombre de clic
function envoie_form() { // Fonction appelée par le bouton
	nbclic++; // nbclic+1
	if (nbclic > 1) { // Plus de 1 clic
		return false;
	} else { // 1 seul clic
		return true;
	}
}


//Vote page 

function bouclevote(id2, pseudo2) {
	$.post("index.php?action=voter", {
		id: id2,
		pseudo: pseudo2
	}, function (data, status) {
		console.log(data);
		data = data.substring(data.indexOf('[DIV]') + 5);
		if (data == "success") {
			$("#vote-success").fadeIn(500);
			setTimeout(function () {
				$("#vote-success").fadeOut(500);
			}, 5000);
			$("#btn-verif-" + id2).fadeOut(500);
			setTimeout(function () {
				$("#btn-after-" + id2).fadeIn(500);
			}, 500);
			if (document.getElementById("nbr-vote-" + pseudo2)) {
				document.getElementById("nbr-vote-" + pseudo2).innerHTML = (parseInt(document.getElementById("nbr-vote-" + pseudo2).innerHTML) + 1);
			}
		} else {
			setTimeout(function () {
				bouclevote(id2, pseudo2);
			}, 500);
		}
	});
}


//Messagerie Page

$('#modalRep').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget); // Button that triggered the modal
	var destinataire = button.data('to'); // Extract info from data-* attributes
	var modal = $(this)
	if (destinataire == undefined)
		modal.find('.modal-title').text('Nouveau message');
	else
		modal.find('.modal-title').text('Nouveau message pour ' + destinataire);
	modal.find('.modal-body #destinataire').val(destinataire);
});

$('#modalMessage').on('show.bs.modal', function (event) {
	console.log('test');
	var button = $(event.relatedTarget);
	var idConv = button.data('id');
	var correspondant = button.data('with');
	var modal = $(this);
	modal.find('.modal-title').text("Conversation avec " + correspondant);
	modal.find('#Conversation').html("<center><img src='theme/default/img/gif-charge.gif' alt='chargement...'/></center>");
	modal.find(".destinataire").attr("value", correspondant);
	$.ajax({
		method: "POST",
		url: '?action=getConversationMessage',
		data: {
			id: idConv
		}
	}).done(function (donnees) {
		if (donnees != 'false') {
			modal.find('#Conversation').html(donnees);

			$("#i" + idConv).removeClass("fa-envelope");
			$("#i" + idConv).removeClass("fas");
			$("#i" + idConv).addClass("far");
			$("#i" + idConv).addClass("fa-envelope-open");
		} else {
			modal.find('#Conversation').html("<h2>Erreur: Vous n'avez pas les accès pour cette conversation !</h2>");
		}
	});
});

function getConversations(page) {
	$("#accordion").html("<center><img src='theme/default/img/gif-charge.gif' alt='chargement...'/></center>");
	$.ajax({
		method: "POST",
		url: '?action=getConversations',
		data: {
			page: page
		}
	}).done(function (donnees) {
		$("#accordion").html(donnees);
	});
}

function getMessages(id, page) {
	$('#Conversation').html("<center><img src='theme/default/img/gif-charge.gif' alt='chargement...'/></center>");
	$.ajax({
		method: "POST",
		url: '?action=getConversationMessage',
		data: {
			id: id,
			page: page
		}
	}).done(function (donnees) {
		$("#Conversation").html(donnees);
	});
}

//Other

function insertAtCaret(textarea, icon) {
	if (document.getElementById(textarea).createTextRange && document.getElementById(textarea).caretPos) {
		var caretPos = document.getElementById(textarea).caretPos;
		selectedtext = caretPos.text;
		caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ? icon + '' : icon;
		caretPos.text = caretPos.text + selectedtext;
	} else if (document.getElementById(textarea).textLength > 0) {
		Deb = document.getElementById(textarea).value.substring(0, document.getElementById(textarea).selectionStart);
		Fin = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionEnd, document.getElementById(textarea).textLength);
		document.getElementById(textarea).value = Deb + icon + Fin;
	} else {
		document.getElementById(textarea).value = document.getElementById(textarea).value + icon;
	}

	document.getElementById(textarea).focus();
}

function ajout_text(textarea, entertext, tapetext, balise) {
	if (document.selection && document.selection.createRange().text != '') {
		document.getElementById(textarea).focus();
		VarTxt = document.selection.createRange().text;
		document.selection.createRange().text = '[' + balise + ']' + VarTxt + '[/' + balise + ']';
	} else if (document.getElementById(textarea).selectionEnd && (document.getElementById(textarea).selectionEnd - document.getElementById(textarea).selectionStart > 0)) {
		valeurDeb = document.getElementById(textarea).value.substring(0, document.getElementById(textarea).selectionStart);
		valeurFin = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionEnd, document.getElementById(textarea).textLength);
		objectSelected = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionStart, document.getElementById(textarea).selectionEnd);
		document.getElementById(textarea).value = valeurDeb + '[' + balise + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
	} else {
		VarTxt = window.prompt(entertext, tapetext);
		if ((VarTxt != null) && (VarTxt != '')) insertAtCaret(textarea, '[' + balise + ']' + VarTxt + '[/' + balise + ']');
	}
}

function ajout_text_complement(textarea, entertext, tapetext, balise, complementTxt, complementtape) {
	if (balise == 'url') {
		if (document.selection && document.selection.createRange().text != '') {
			complement = window.prompt(entertext, tapetext);
			document.getElementById(textarea).focus();
			VarTxt = document.selection.createRange().text;
			if (complement != null && complement != '')
				document.selection.createRange().text = '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']';
			else
				document.selection.createRange().text = '[' + balise + ']' + VarTxt + '[/' + balise + ']';
		} else if (document.getElementById(textarea).selectionEnd && (document.getElementById(textarea).selectionEnd - document.getElementById(textarea).selectionStart > 0)) {
			complement = window.prompt(entertext, tapetext);
			valeurDeb = document.getElementById(textarea).value.substring(0, document.getElementById(textarea).selectionStart);
			valeurFin = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionEnd, document.getElementById(textarea).textLength);
			objectSelected = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionStart, document.getElementById(textarea).selectionEnd);
			if (complement != null && complement != '')
				document.getElementById(textarea).value = valeurDeb + '[' + balise + '=' + complement + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
			else
				document.getElementById(textarea).value = valeurDeb + '[' + balise + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
		} else {
			VarTxt = window.prompt(complementTxt, complementtape);
			complement = window.prompt(entertext, tapetext);
			if ((VarTxt != null) && (VarTxt != '') && complement != null && complement != '') insertAtCaret(textarea, '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']');
			else insertAtCaret(textarea, '[' + balise + ']' + VarTxt + '[/' + balise + ']');
		}
	} else if (balise == 'img') {
		if (document.selection && document.selection.createRange().text != '') {
			complement = window.prompt(entertext, tapetext);
			document.getElementById(textarea).focus();
			VarTxt = document.selection.createRange().text;
			if (VarTxt != null && VarTxt != '')
				document.selection.createRange().text = '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']';
			else
				document.selection.createRange().text = '[' + balise + ']' + complement + '[/' + balise + ']';
		} else if (document.getElementById(textarea).selectionEnd && (document.getElementById(textarea).selectionEnd - document.getElementById(textarea).selectionStart > 0)) {
			complement = window.prompt(entertext, tapetext);
			valeurDeb = document.getElementById(textarea).value.substring(0, document.getElementById(textarea).selectionStart);
			valeurFin = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionEnd, document.getElementById(textarea).textLength);
			objectSelected = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionStart, document.getElementById(textarea).selectionEnd);
			if (objectSelected != null && objectSelected != '')
				document.getElementById(textarea).value = valeurDeb + '[' + balise + '=' + complement + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
			else
				document.getElementById(textarea).value = valeurDeb + '[' + balise + ']' + complement + '[/' + balise + ']' + valeurFin;
		} else {
			VarTxt = window.prompt(complementTxt, complementtape);
			complement = window.prompt(entertext, tapetext);
			if ((VarTxt != null) && (VarTxt != '') && complement != null && complement != '') insertAtCaret(textarea, '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']');
			else insertAtCaret(textarea, '[' + balise + ']' + complement + '[/' + balise + ']');
		}
	} else {
		if (document.selection && document.selection.createRange().text != '') {
			complement = window.prompt(complementTxt, complementtape);
			document.getElementById(textarea).focus();
			VarTxt = document.selection.createRange().text;
			if (complement != null && complement != '')
				document.selection.createRange().text = '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']';
			else
				document.selection.createRange().text = '[' + balise + ']' + VarTxt + '[/' + balise + ']';
		} else if (document.getElementById(textarea).selectionEnd && (document.getElementById(textarea).selectionEnd - document.getElementById(textarea).selectionStart > 0)) {
			complement = window.prompt(complementTxt, complementtape);
			valeurDeb = document.getElementById(textarea).value.substring(0, document.getElementById(textarea).selectionStart);
			valeurFin = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionEnd, document.getElementById(textarea).textLength);
			objectSelected = document.getElementById(textarea).value.substring(document.getElementById(textarea).selectionStart, document.getElementById(textarea).selectionEnd);
			if (complement != null && complement != '')
				document.getElementById(textarea).value = valeurDeb + '[' + balise + '=' + complement + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
			else
				document.getElementById(textarea).value = valeurDeb + '[' + balise + ']' + objectSelected + '[/' + balise + ']' + valeurFin;
		} else {
			complement = window.prompt(complementTxt, complementtape);
			VarTxt = window.prompt(entertext, tapetext);
			if ((VarTxt != null) && (VarTxt != '') && complement != null && complement != '') insertAtCaret(textarea, '[' + balise + '=' + complement + ']' + VarTxt + '[/' + balise + ']');
			else insertAtCaret(textarea, '[' + balise + ']' + VarTxt + '[/' + balise + ']');
		}
	}
}

$('document').ready(function () {

	var checked = [];

	$("input:checkbox[name=selection]").each(function () {
		$(this).click(function () {

			checked = $("input:checkbox[name=selection]:checked");

			if (checked.length > 0) {
				$('#popover').css('display', '')
			} else {
				$('#popover').css('display', 'none');
			}
		})
	});

	$('#sel-form').submit(function () {
		var $form = $(this);
		checked.each(function () {
			$('<input>').attr({
				type: 'hidden',
				name: 'id[]',
				value: $(this).val()
			}).appendTo($form);
		});
	});

});