document.addEventListener("DOMContentLoaded", function () {
  const salaireBrutHoraireInput = document.getElementById("salaireBrutHoraire");
  const salaireBrutMensuelInput = document.getElementById(
    "salaireBrutMensuelNonCadre"
  );
  const salaireBrutAnnuelInput = document.getElementById("salaireBrutAnnuel");
  const statutRadios = document.querySelectorAll('#statut input[type="radio"]');
  const tempsTravailInput = document.getElementById("tempsTravail");
  const tempsTravailValue = document.getElementById("tempsTravailValue");
  const moisRadioButtons = document.querySelectorAll(
    'input[type="radio"][name="moisPrime"]'
  );
  const prelevementSourceInput = document.getElementById("prelevementSource");
  const prelevementSourceValue = document.getElementById(
    "prelevementSourceValue"
  );
  const salaireNetHoraireOutput = document.getElementById("salaireNetHoraire");
  const salaireNetMensuelOutput = document.getElementById("salaireNetMensuel");
  const salaireNetAnnuelOutput = document.getElementById("salaireNetAnnuel");
  const mensuelNetApresImpotsOutput = document.getElementById(
    "mensuelNetApresImpots"
  );
  const annuelNetApresImpotsOutput = document.getElementById(
    "annuelNetApresImpots"
  );
  const outputStatut = document.getElementById("statutRadios");

  function calculerSalaireNet() {
    const salaireBrutHoraire = parseFloat(salaireBrutHoraireInput.value) || 0;
    const salaireBrutMensuel = parseFloat(salaireBrutMensuelInput.value) || 0;
    const salaireBrutAnnuel = parseFloat(salaireBrutAnnuelInput.value) || 0;
    const statut =
      Array.from(statutRadios).find((radio) => radio.checked)?.value || "";
    const tempsTravail = parseInt(tempsTravailInput.value) || 0;
    const moisPrime =
      Array.from(moisRadioButtons).find((radioButton) => radioButton.checked)
        ?.value || 0;
    const primeConventionnelle = moisPrime * 50;
    const prelevementSource = parseFloat(prelevementSourceInput.value) || 0;

    let tauxReduction = 0;
    switch (statut) {
      case "Non-cadre -22%":
        tauxReduction = 22;
        break;
      case "Cadre -25%":
        tauxReduction = 25;
        break;
      case "Public -15%":
        tauxReduction = 15;
        break;
      case "Indé -45%":
        tauxReduction = 45;
        break;
      case "Port -51%":
        tauxReduction = 51;
        break;
      default:
        tauxReduction = 0;
    }

    const salaireNetHoraire = salaireBrutHoraire * (1 - tauxReduction / 100);
    const salaireNetMensuel = salaireBrutMensuel * (1 - tauxReduction / 100);
    const salaireNetAnnuel = salaireBrutAnnuel * (1 - tauxReduction / 100);

    const coefficientTempsTravail = tempsTravail / 100;
    const salaireNetHoraireTempsTravail =
      salaireNetHoraire * coefficientTempsTravail;
    const salaireNetMensuelTempsTravail =
      salaireNetMensuel * coefficientTempsTravail;
    const salaireNetAnnuelTempsTravail =
      salaireNetAnnuel * coefficientTempsTravail;

    const tauxPrelevement = prelevementSource / 100;
    const salaireNetMensuelApresImpots =
      salaireNetMensuelTempsTravail * (1 - tauxPrelevement);
    const salaireNetAnnuelApresImpots =
      salaireNetAnnuelTempsTravail * (1 - tauxPrelevement);

    const primeAnnuelle = primeConventionnelle * (tempsTravail / 100);
    const salaireNetAnnuelAvecPrime =
      salaireNetAnnuelApresImpots + primeAnnuelle;

    salaireNetHoraireOutput.textContent =
      salaireNetHoraireTempsTravail.toFixed(2);
    salaireNetMensuelOutput.textContent =
      salaireNetMensuelTempsTravail.toFixed(0);
    salaireNetAnnuelOutput.textContent =
      salaireNetAnnuelTempsTravail.toFixed(0);
    mensuelNetApresImpotsOutput.textContent =
      salaireNetMensuelApresImpots.toFixed(0);
    annuelNetApresImpotsOutput.textContent =
      salaireNetAnnuelApresImpots.toFixed(0);
    annuelNetApresImpotsOutput.textContent =
      salaireNetAnnuelAvecPrime.toFixed(0);
  }

  function desactiverAutresCases(radioButton) {
    if (radioButton.checked) {
      if (radioButton.name === "moisPrime") {
        moisRadioButtons.forEach((rb) => {
          if (rb !== radioButton) {
            rb.checked = false;
          }
        });
      }
      if (radioButton.name === "statut") {
        statutRadios.forEach((rb) => {
          if (rb !== radioButton) {
            rb.checked = false;
          }
        });
      }
      calculerSalaireNet();
    }
  }

  statutRadios.forEach((radio) => {
    radio.addEventListener("change", calculerSalaireNet);
  });

  tempsTravailInput.addEventListener("input", function () {
    tempsTravailValue.textContent = `${this.value}%`;
    calculerSalaireNet();
  });

  prelevementSourceInput.addEventListener("input", function () {
    prelevementSourceValue.textContent = `${this.value}%`;
    calculerSalaireNet();
  });

  const champsInputs = document.querySelectorAll(
    "#salaireForm input, #salaireForm select"
  );
  champsInputs.forEach((input) => {
    input.addEventListener("input", calculerSalaireNet);
  });

  moisRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener("change", function () {
      desactiverAutresCases(this);
    });
  });

  statutRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      outputStatut.textContent = `${this.value}`;
    });
  });

  const effacerChampsButton = document.getElementById("effacerChamps");
  effacerChampsButton.addEventListener("click", function () {
    champsInputs.forEach((input) => {
      if (input.tagName === "INPUT") {
        input.value = "";
      } else if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      }
    });

    moisRadioButtons.forEach((radioButton) => {
      radioButton.checked = false;
    });

    statutRadios.forEach((radio) => {
      radio.checked = false;
      if (radio.nextElementSibling.tagName === "OUTPUT") {
        radio.nextElementSibling.textContent = "100%";
      }
    });

    tempsTravailInput.value = 100;
    prelevementSourceInput.value = 0;
    tempsTravailValue.textContent = "100%";
    prelevementSourceValue.textContent = "0.0%";
    calculerSalaireNet();
  });

  calculerSalaireNet();
});
