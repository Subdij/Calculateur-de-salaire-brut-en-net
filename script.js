document.addEventListener('DOMContentLoaded', function () {
  const salaireBrutHoraireInput = document.getElementById('salaireBrutHoraire');
  const salaireBrutMensuelInput = document.getElementById('salaireBrutMensuelNonCadre');
  const salaireBrutAnnuelInput = document.getElementById('salaireBrutAnnuel');
  const statutSelect = document.getElementById('statut');
  const tempsTravailInput = document.getElementById('tempsTravail');
  const tempsTravailValue = document.getElementById('tempsTravailValue');
  const moisRadioButtons = document.querySelectorAll('input[type="radio"][name="moisPrime"]');
  const prelevementSourceInput = document.getElementById('prelevementSource');
  const prelevementSourceValue = document.getElementById('prelevementSourceValue');
  const salaireNetHoraireOutput = document.getElementById('salaireNetHoraire');
  const salaireNetMensuelOutput = document.getElementById('salaireNetMensuel');
  const salaireNetAnnuelOutput = document.getElementById('salaireNetAnnuel');
  const mensuelNetApresImpotsOutput = document.getElementById('mensuelNetApresImpots');
  const annuelNetApresImpotsOutput = document.getElementById('annuelNetApresImpots');

  function calculerSalaireNet() {
    const salaireBrutHoraire = parseFloat(salaireBrutHoraireInput.value) || 0;
    const salaireBrutMensuel = parseFloat(salaireBrutMensuelInput.value) || 0;
    const salaireBrutAnnuel = parseFloat(salaireBrutAnnuelInput.value) || 0;
    const statut = statutSelect.value;
    const tempsTravail = parseInt(tempsTravailInput.value) || 0;
    const moisPrime = Array.from(moisRadioButtons).find(radioButton => radioButton.checked)?.value || 0;
    const primeConventionnelle = moisPrime * 50;
    const prelevementSource = parseFloat(prelevementSourceInput.value) || 0;

    let tauxReduction = 0;
    switch (statut) {
      case 'non-cadre':
        tauxReduction = 22;
        break;
      case 'cadre':
        tauxReduction = 25;
        break;
      case 'fonction-publique':
        tauxReduction = 15;
        break;
      case 'profession-liberale':
        tauxReduction = 45;
        break;
      case 'portage-salarial':
        tauxReduction = 51;
        break;
      default:
        tauxReduction = 0;
    }

    const salaireNetHoraire = salaireBrutHoraire * (1 - tauxReduction / 100);
    const salaireNetMensuel = salaireBrutMensuel * (1 - tauxReduction / 100);
    const salaireNetAnnuel = salaireBrutAnnuel * (1 - tauxReduction / 100);
  
    const coefficientTempsTravail = tempsTravail / 100;
    const salaireNetHoraireTempsTravail = salaireNetHoraire * coefficientTempsTravail;
    const salaireNetMensuelTempsTravail = salaireNetMensuel * coefficientTempsTravail;
    const salaireNetAnnuelTempsTravail = salaireNetAnnuel * coefficientTempsTravail;
  
    const tauxPrelevement = prelevementSource / 100;
    const salaireNetMensuelApresImpots = salaireNetMensuel * (1 - tauxPrelevement);
    const salaireNetAnnuelApresImpots = salaireNetAnnuel * (1 - tauxPrelevement);
  
    const primeAnnuelle = primeConventionnelle * (tempsTravail / 100);
    const salaireNetAnnuelAvecPrime = salaireNetAnnuelApresImpots + primeAnnuelle;

    salaireNetHoraireOutput.textContent = salaireNetHoraireTempsTravail.toFixed(2);
    salaireNetMensuelOutput.textContent = salaireNetMensuelTempsTravail.toFixed(2);
    salaireNetAnnuelOutput.textContent = salaireNetAnnuelTempsTravail.toFixed(2);
    mensuelNetApresImpotsOutput.textContent = salaireNetMensuelApresImpots.toFixed(2);
    annuelNetApresImpotsOutput.textContent = salaireNetAnnuelApresImpots.toFixed(2);
    annuelNetApresImpotsOutput.textContent = salaireNetAnnuelAvecPrime.toFixed(2);
  }

  function desactiverAutresCases(radioButton) {
    if (radioButton.checked) {
      moisRadioButtons.forEach((rb) => {
        if (rb !== radioButton) {
          rb.checked = false;
        }
      });
    }
  }

  tempsTravailInput.addEventListener('input', function () {
    tempsTravailValue.textContent = `${this.value}%`;
    calculerSalaireNet();
  });

  prelevementSourceInput.addEventListener('input', function () {
    prelevementSourceValue.textContent = `${this.value}%`;
    calculerSalaireNet();
  });

  const champsInputs = document.querySelectorAll('#salaireForm input');
  champsInputs.forEach(input => {
    input.addEventListener('input', calculerSalaireNet);
  });

  const champsSelects = document.querySelectorAll('#salaireForm select');
  champsSelects.forEach(select => {
    select.addEventListener('change', calculerSalaireNet);
  });

  moisRadioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
      desactiverAutresCases(this);
      calculerSalaireNet();
    });
  });

  const effacerChampsButton = document.getElementById('effacerChamps');
  effacerChampsButton.addEventListener('click', function () {
    champsInputs.forEach(input => {
      input.value = '';
    });
    champsSelects.forEach(select => {
      select.selectedIndex = 0;
    });
    moisRadioButtons.forEach(radioButton => {
      radioButton.checked = false;
    });
    tempsTravailInput.value = 100;
    prelevementSourceInput.value = 0;
    tempsTravailValue.textContent = '100%';
    prelevementSourceValue.textContent = '0.0%';
    calculerSalaireNet();
  });

  calculerSalaireNet();
});
