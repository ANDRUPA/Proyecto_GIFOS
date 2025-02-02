let creadorGifos = document.getElementById("creadorGifos");
let btnComenzar = document.getElementById("btnComenzar");
let btnGrabar = document.getElementById("btnGrabar");
let btnFinalizar = document.getElementById("btnFinalizar");
let btnSubirGifo = document.getElementById("btnSubirGifo");
let btnGrabacion1 = document.getElementById("btnGrabacion1");
let textBtnGrabacion1 = document.getElementById("textBtnGrabacion1");
let btnGrabacion2 = document.getElementById("btnGrabacion2");
let textBtnGrabacion2 = document.getElementById("textBtnGrabacion2");
let btnGrabacion3 = document.getElementById("btnGrabacion3");
let textBtnGrabacion3 = document.getElementById("textBtnGrabacion3");
let tituloGrabacion = document.getElementById("tituloGrabacion");
let textoGrabacion1 = document.getElementById("textoGrabacion1");
let textoGrabacion2 = document.getElementById("textoGrabacion2");
let recorder = null;
let video = document.getElementById("video");
let mostrarVideo = document.getElementById("mostrarVideo");
let cronometro = document.getElementById("cronometro");
let segundero = document.getElementById("segundero");
let minutero = document.getElementById("minutero");
let centisegundos = document.getElementById("centisegundos");
let textoSubrayado = document.getElementById("textoSubrayado");
let textosGrabacionYVideo = document.getElementById("textosGrabacionYVideo");
let btnsGrabacion = document.getElementById("btnsGrabacion");
let textoGrabacionYvideoPintado = document.getElementById("textoGrabacionYvideoPintado");
let cuadrosVideoPintado = document.getElementById("cuadrosVideoPintado");
let imgCargando = document.getElementById("imgCargando");
let textoSubiendoGifo = document.getElementById("textoSubiendoGifo");
let textoCronometro = document.getElementById("textoCronometro");
let arrayGifosCreados = [];

let apikey = 'umCoI8QE3nt72GLxXUntliERdZW5J6z9';
let pathSubirGif = `https://upload.giphy.com/v1/gifs?api_key=${apikey}`;


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       PASOS PARA CREAR UN GIFO
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

window.onload = () => {

}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       1. Boton LI que te lleva hasta el apartado
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

imgBtnCrearGifos.addEventListener('click', (apCreador) => {

    imgBtnCrearGifos.setAttribute("toggle", "false");
    buscadorGifos.style.display = "none";
    creadorGifos.style.display = "block";
    imgBtnCrearGifos.toggle = "true";
    sectionFavoritos.style.display = "none";
    sectionMisGifos.style.display = "none";
    trendingGifos.style.display = "none";
    if (!pantallaDesktop.matches) {
        site_nav.style.display = "none";
    }
    imgBtnCrearGifos.src = "./assets/assets/CTA-crear-gifo-active-modo-noc.svg";
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       2. Comenzar proceso grabacion, permisos y preparar paso siguiente
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

btnComenzar.addEventListener('click', (eventoComenzar) => {
    console.log('comenzando');
    btnComenzar.style.display = "none";
    btnGrabacion1.style.backgroundColor = "#572EE5";
    textBtnGrabacion1.style.color = "#FFFFFF";
    tituloGrabacion.innerHTML = `¿Nos das acceso <br> a tu camara?`;
    textoGrabacion1.innerHTML = `El acceso a tu camara será válido sólo`;
    textoGrabacion2.innerHTML = `por el tiempo en el que estés creando el GIFO.`;
    permisos();
});

function permisos() {
    let stream = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    }).then(prepararPaso2).then(grabar);
}

async function prepararPaso2() {
    btnGrabar.style.display = "flex";
    btnGrabacion2.style.backgroundColor = "#572EE5";
    textBtnGrabacion2.style.color = "#FFFFFF";
    btnGrabacion1.style.backgroundColor = "#FFFFFF";
    textBtnGrabacion1.style.color = "#572EE5";
    tituloGrabacion.style.display = "none";
    textoGrabacion1.style.display = "none";
    textoGrabacion2.style.display = "none";
    video.style.display = "block";
    textosGrabacionYVideo.style.marginLeft = 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       3. Grabar el video y iniciar temporizador
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//BOTON PARA GRABAR
async function grabar() {
    btnGrabar.addEventListener('click', (eventoGrabar) => {
        getStreamAndRecord();
        btnGrabar.style.display = "none";
        btnFinalizar.style.display = "flex";
        cronometro.style.display = "flex";
        startTimer();
    });
}

//FUNCIONALIDAD GRABAR
async function getStreamAndRecord() {
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    });
    video.srcObject = stream;
    video.play();
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
            console.log("started");
        }
    });
    recorder.startRecording();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       3. Terminar de grabar, finalizar el temporizador y generar el blob
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// terminar de grabar
btnFinalizar.addEventListener('click', (eventoFinalizar) => {
    recorder.stopRecording(async () => {
        let blob = recorder.getBlob();
        let uri = URL.createObjectURL(blob);
        mostrarVideo.src = uri;
    });
    cronometro.style.display = "none";
    textoSubrayado.style.display = "flex";
    btnsGrabacion.style.marginRight = "4.8vw";
    btnFinalizar.style.display = "none";
    btnSubirGifo.style.display = "flex";
    stopTimer();
});

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       3. Generar el form, subirlo a giphy y almacenarlo
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//subir el gifo a giphy
btnSubirGifo.addEventListener('click', (eventoSubirGifo) => {
    btnGrabacion3.style.backgroundColor = "#572EE5";
    textBtnGrabacion3.style.color = "#FFFFFF";
    btnGrabacion2.style.backgroundColor = "#FFFFFF";
    textBtnGrabacion2.style.color = "#572EE5";
    let blob = recorder.getBlob();
    let form = new FormData();
    form.append('file', blob, 'myGif.gif');
    textoGrabacionYvideoPintado.style.display = "block";
    createGif(form);
    setTimeout(confirmarPostGifo, 2500)
});

// FUNCIONALIDAD DE CREAR EL FORMULARIO
async function createGif(formData) {
    const response = await fetch(pathSubirGif, {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    console.log(result);
    let idMiCreacion = result.data.id;
    arrayGifosCreados.push(idMiCreacion);
    localStorage.setItem("misGIFOS", JSON.stringify(arrayGifosCreados));
}



//pasos visuales finales(confirmacion de subida del gifo)
async function confirmarPostGifo() {
    imgCargando.src = "./assets/assets/check.svg";
    textoSubiendoGifo.innerHTML = "GIFO subido con éxito";
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       X-1. Generar un timer
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// FUNCIONALIDAD DEL TIMER

let currentTimer = 0;
interval = 0;
lastUpdateTime = new Date().getTime(),
    start = btnGrabar,
    stop = btnFinalizar,
    mins = minutero,
    secs = segundero,
    centisegundos = centisegundos;




function pad(n) {
    return ('00' + n).substr(-2);
}
function update() {
    let now = new Date().getTime(),
        dt = now - lastUpdateTime;

    currentTimer += dt;
    let time = new Date(currentTimer);

    mins.innerHTML = pad(time.getMinutes());
    secs.innerHTML = pad(time.getSeconds());
    centisegundos.innerHTML = pad(Math.floor(time.getMilliseconds() / 10));

    lastUpdateTime = now;
}

function startTimer() {
    if (!interval) {
        lastUpdateTime = new Date().getTime();
        interval = setInterval(update, 1)
        console.log("seteando timer");
    }
}

function stopTimer() {
    clearInterval(interval);
    interval = 0;
}

function resetTimer() {
    stopTimer();

    currentTimer = 0;

    mins.innerHTML = secs.innerHTML = centisegundos.innerHTML = pad(0);
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                       X-2. Resetear la grabacion
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------

//resetear grabacion
textoCronometro.addEventListener('click', () => {
    location.reload();
});

// async function resetearGrabacion() {
//     imgBtnCrearGifos.setAttribute("toggle", "false");
//     buscadorGifos.style.display = "none";
//     creadorGifos.style.display = "block";
//     imgBtnCrearGifos.toggle = "true";
//     sectionFavoritos.style.display = "none";
//     sectionMisGifos.style.display = "none";
//     trendingGifos.style.display = "none";
//     if (!pantallaDesktop.matches) {
//         site_nav.style.display = "none";
//     }
//     imgBtnCrearGifos.src = "./assets/assets/CTA-crear-gifo-active-modo-noc.svg";
// }

// //----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //                                                                       X-3. Cargar array de gifos creados del usuario
// //----------------------------------------------------------------------------------------------------------------------------------------------------------------------


// //Cargar array de GIFOS del usuario:
function loadGifosUsuario() {
    let misGifosCreados = JSON.parse(localStorage.getItem("misGIFOS"));
    if (misGifosCreados) {
        arrayGifosCreados = misGifosCreados;
        console.log(arrayGifosCreados);
    }
};
loadGifosUsuario();