const myAudioContext = new AudioContext();
function beep(duration, frequency, volume) {

    return new Promise((resolve, reject) => {
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try {
            let oscillatorNode = myAudioContext.createOscillator();
            let gainNode = myAudioContext.createGain();
            oscillatorNode.connect(gainNode);

            oscillatorNode.frequency.value = frequency;
            oscillatorNode.type = "square";
            gainNode.connect(myAudioContext.destination);

            gainNode.gain.value = volume * 0.01;

            oscillatorNode.start(myAudioContext.currentTime);
            oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

            oscillatorNode.onended = () => {
                resolve();
            };
        } catch (error) {
            reject(error);
        }

        sleep(500);
    });
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function formatCPF(input) {
    let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Add first dot
    value = value.replace(/(\d{3})(\d)/, "$1.$2"); // Add second dot
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Add dash
    input.value = value;
}

function fileExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}


function Descriptografar(base64Str) {
    // Convert key and IV to WordArray
    const key = CryptoJS.enc.Utf8.parse("ESAJ-DITEC092026");
    const iv = CryptoJS.enc.Utf8.parse("1234567890ABCDEF");
    const decodedText = decodeHtmlEntities(base64Str);

    
    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(decodedText) },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

function decodeHtmlEntities(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
}

function Alertar(msg, ok) {
    divAlerta.innerHTML = msg;
    divAlerta.classList.remove("alert-success");
    divAlerta.classList.remove("alert-danger");

    if(msg != "") {
        if(ok) {
            divAlerta.classList.add("alert-success");
        } else {
            divAlerta.classList.add("alert-danger");
        }

        beep(100, 200, 50);
    }
}

function LerInscritos() {
    inscritos = [];

    Alertar("");

    try {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", inputTurma.value + ".xml", false);
        xhttp.send();

        // Obtém a lista de inscritos
        const xmlDoc = xhttp.responseXML;
        const rows = xmlDoc.getElementsByTagName("ROW");

        // Percorre a lista de inscritos
        for (let i = 0; i < rows.length; i++) {
            const cpf  = rows[i].getElementsByTagName("CPF")[0].innerHTML;
            const nome = rows[i].getElementsByTagName("NOME")[0].innerHTML;

            inscritos.push({"cpf": cpf, "nome": nome});
        }
    }
    catch(e) {
        Alertar("INSCRITOS NÃO CARREGADOS", false);
    }
}

function LerEntrada() {
    renderPresentes();
}

function PesquisarCPF() {
    const result = inscritos.find(participante => participante.cpf == inputCPF.value);

    if(result != undefined) {
        Alertar(result.nome,true);

        insertLocalStorage(result);
    } else {
        Alertar("PESSOA NÃO INSCRITA",false);
    }

    inputCPF.focus();
    inputCPF.select();
}

let arquivo = "";
let inscritos = [];
let presentes = [];

window.addEventListener("DOMContentLoaded", function() {

    document.getElementById("pag1").style.display="block";
    document.getElementById("pag2").style.display="none";
    document.getElementById("pag3").style.display="none";
    document.getElementById("pag4").style.display="none";

    // navegação entre páginas
    const buttonImportarDB = document.getElementById("buttonImportarDB");
    const buttonImportarCSV = document.getElementById("buttonImportarCSV");
    const buttonProximo = document.getElementById("buttonProximo");
    const buttonVoltar = document.getElementById("buttonVoltar");
    const buttonVoltar2 = document.getElementById("buttonVoltar2");
    const buttonVoltar3 = document.getElementById("buttonVoltar3");

    // elementos da página 1
    const inputTurma = document.getElementById("inputTurma");
    const inputNome = document.getElementById("inputNome");
    const inputData = document.getElementById("inputData");
    const inputInicio = document.getElementById("inputInicio");
    const inputTermino = document.getElementById("inputTermino");

    // elementos da página 2
    const buttonLimpar = document.getElementById("buttonLimpar");
    const buttonEncerrar = document.getElementById("buttonEncerrar");
    const inputCPF = document.getElementById("inputCPF");
    const buttonEntrar = document.getElementById("buttonEntrar");
    const divAlerta = document.getElementById("divAlerta");

    // elementos da página 3
    const buttonEscolherArquivoDB = document.getElementById("buttonEscolherArquivoDB");

    // elementos da página 4
    const buttonEscolherArquivoCSV = document.getElementById("buttonEscolherArquivoCSV");

    let ultimaEntrada;

    buttonImportarDB.addEventListener("click", function() {
        const fileContentDB = document.getElementById('fileContentDB');
        fileContentDB.textContent = "";

        document.getElementById("pag1").style.display="none";
        document.getElementById("pag2").style.display="none";
        document.getElementById("pag3").style.display="block";
        document.getElementById("pag4").style.display="none";
    });
    buttonImportarCSV.addEventListener("click", function() {
        const fileContentCSV = document.getElementById('fileContentCSV');
        fileContentCSV.textContent = "";

        document.getElementById("pag1").style.display="none";
        document.getElementById("pag2").style.display="none";
        document.getElementById("pag3").style.display="none";
        document.getElementById("pag4").style.display="block";
    });
    buttonProximo.addEventListener("click", function() {
        if(inputTurma.value != '' && inputNome.value != '' && inputData.value != '' && inputInicio.value != '' && inputTermino.value != '' ) {

            arquivo = inputTurma.value + "_" + inputData.value.replaceAll("-", "") + inputInicio.value.replaceAll(":", "") + ".xml";

            LerInscritos();
            LerEntrada();
            ultimaEntrada = "";
            inputCPF.value = "";

            document.getElementById("pag1").style.display="none";
            document.getElementById("pag2").style.display="block";
            document.getElementById("pag3").style.display="none";
            document.getElementById("pag4").style.display="none";
            startScan();
            
            inputCPF.focus();
            inputCPF.select();
        }
    });
    inputTurma.addEventListener("keydown", function() {
        this.value = this.value.toUpperCase();
    });
    inputNome.addEventListener("keydown", function() {
        this.value = this.value.toUpperCase();
    });


    buttonVoltar.addEventListener("click", function() {
        $('#presenca').DataTable().clear().draw();
        $('#presenca').DataTable().destroy();
        stopScan();

        document.getElementById("pag1").style.display="block";
        document.getElementById("pag2").style.display="none";
        document.getElementById("pag3").style.display="none";
        document.getElementById("pag4").style.display="none";

        buttonProximo.focus();
    });
    buttonLimpar.addEventListener("click", function() {
        if (confirm("Deseja realmente apagar a informação dos participantes que já entraram? ") == true) {
            ultimaEntrada="";
            inputCPF.value="";
            Alertar("");
            const result = db.exec("DELETE FROM " +  tabela);
            renderPresentes();
        }
    });
    buttonEncerrar.addEventListener("click", function() {
        if(presentes.length == 0) {
            Alertar("Não há participantes para exportar.",false);
            return;
        }
        
        exportDB();
        exportToCsv();
    });
    inputCPF.addEventListener("keydown", function(e) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            buttonEntrar.click();
        }
    });
    buttonEntrar.addEventListener("click", function() {
        Alertar("");
        if(inputCPF.value != "") {
            ultimaEntrada = inputCPF.value;
            PesquisarCPF(); 
        }
    });


    buttonVoltar2.addEventListener("click", function() {
        document.getElementById("pag1").style.display="block";
        document.getElementById("pag2").style.display="none";
        document.getElementById("pag3").style.display="none";
        document.getElementById("pag4").style.display="none";

        buttonProximo.focus();
    });
    buttonEscolherArquivoDB.addEventListener("change", function(event) {
        importDB(event);
    });

    buttonVoltar3.addEventListener("click", function() {
        document.getElementById("pag1").style.display="block";
        document.getElementById("pag2").style.display="none";
        document.getElementById("pag3").style.display="none";
        document.getElementById("pag4").style.display="none";

        buttonProximo.focus();
    });
    buttonEscolherArquivoCSV.addEventListener("change", function(event) {
        importFromCsv(event);
    });

    
    const html5QrCode = new Html5Qrcode("reader");
    function startScan() {
        let options = { fps: 10, qrbox: { width: 400, height: 300} };

        Html5Qrcode.getCameras().then((devices) => {
            if (devices && devices.length) {
                devices.forEach((device) => {
                    //console.log(`Camera ID: ${device.id}, Label: ${device.label}`);
                });
                const cameraId = devices[0].id;

                html5QrCode.start(cameraId,options,onScanSuccess,onScanFailure);
            } else {
                Alertar("Nenhuma câmera encontrada",false);
            }
        }).catch((error) => {
            if(error.message == "Device in use") { 
                Alertar("Câmera em uso",false);
            } else {
                Alertar("Erro acessando a câmera: " + error.message,false);
            }
        });
    }
    function stopScan() {
        html5QrCode.stop().then(() => {
             // QR Code scanning is stopped.
        }).catch((error) => {
            console.error("An error occurred:");
            console.error("Name:", error.name);
            console.error("Message:", error.message);
            console.error("Stack:", error.stack);
        });
    }
    function onScanSuccess(decodedText, decodedResult) {

        decodedText = Descriptografar(decodedText);

        if(decodedText.length != 23 && decodedText.indexOf("-") != 11) {
            Alertar("QR Code inválido", false);
            return;
        }
        if(inputTurma.value != decodedText.split("-")[0]) {
            Alertar("Turma incorreta", false);
            return;
        } 

        inputCPF.value= decodedText.split("-")[1];
        formatCPF(inputCPF);
        PesquisarCPF();

        if(decodedText == ultimaEntrada) {
            Alertar( divAlerta.innerHTML, false);
        }
        
        ultimaEntrada = decodedText;

        //html5QrcodeScanner.clear();
    }
    function onScanFailure(error) {
        // Ignora erros de leitura
    }
});