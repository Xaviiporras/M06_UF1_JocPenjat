
const inputObj = document.getElementById('inputPalabra');

const botonObj = document.getElementById('buttonEmpezar');

const textInicial = document.getElementById('començarPartida');

const maxErrores = 10;

let errores = 0;

let racha = 1;

let contadorLletra = 0;

let partidesTotals = 0;

let secretWord = '';

/* let partidesGuanyades = 0;

let partidesGuanyades2 = 0;

let mesPunts = 0;

let mesPunts2 = 0;

let punts = [0, 0];

let fechaPartida = new Date().toLocaleString('es-ES');

let fechaPartida2 = new Date().toLocaleString('es-ES'); */

//*************let llistaboton = document.querySelectorAll(".button")

/* for (let i = 0; i < llistaboton.length; i++){

} */

const seccioBotons = document.querySelector("#div_botones")

const loadButtons = function(){

    fetch("http://127.0.0.1:5500/res/alfabet.json")
    .then(function(response){
        return response.json();
    })
    .then(function (dada){
        alfabet = dada["alfabet"];
        for (let i = 0; i < alfabet.length; i++){
            const boto = document.createElement("button");
            boto.id = `boto_${i + 1}`;
            boto.textContent = alfabet[i];
            boto.disabled = true;
            boto.classList = "bttns";
            boto.addEventListener("click", () => jugarLletra(boto))
            seccioBotons.appendChild(boto)
        }
    });
    /* for (let i = 0; i < ALFABET.length; i++){
        const boto = document.createElement("button");
        boto.id = `boto_$(i + 1)`
        boto.textContent = ALFABET[i];
        boto.addEventListener("click", () => jugarLletra(boto))
        seccioBotons.appendChild(boto)
    } */
}

loadButtons()



const estadisticasJuego = {
    "partidesGuanyades": 0,
    "maximPunts":{
        "mesPunts": 0,
        "fechaPartida": [new Date().toLocaleString('es-ES'), new Date().toLocaleString('es-ES')]
    },
    "punts": 0,
    "getPartidesGuanyades": function(){
        this.partidesGuanyades
    }
};

let estadisticasJugador1 = JSON.parse(JSON.stringify(estadisticasJuego));
let estadisticasJugador2 = JSON.parse(JSON.stringify(estadisticasJuego));

let jugadores = [estadisticasJugador1, estadisticasJugador2];

let paraulaSecreta;

let arrayParaulaSecreta;

let paraulaGuions;

let tornJugador = 0;


//Aquesta funció serveix per ocultar o mostrar la paraula del Input
function mostrarParaula(){
    if (inputObj.type === "password") {
        inputObj.type = "text";
        document.getElementById('mostrar').src = 'imagenes/hide.png';
    } else{
        inputObj.type = "password";
        document.getElementById('mostrar').src = 'imagenes/view.png';
    }
}

const loadWord = function(){
    fetch("http://127.0.0.1:5500/res/exemple.json")
    .then(function(response){
        return response.json();
    })
    .then(function (dada){
        tematiques = dada["tematiques"];
        tematica = tematiques[0];
        paraules = tematica["paraules"];
        paraula = paraules[1];
    })
}

//Aquesta funció serveix per començar una partida, reiniciar el punts, activar els botons de les lletres i restablir els colors d'alguns objectes
function empezarPartida(){
    tornJugador = 0;
    //punts = [0, 0];
    jugadores[0].punts = 0;
    jugadores[1].punts = 0;
    racha = 1;
    document.getElementById('puntsActuals').textContent = jugadores[0].punts;
    document.getElementById('puntsActuals2').textContent = jugadores[1].punts;
    paraulaSecreta = inputObj.value;
    paraulaSecreta = paraulaSecreta.toUpperCase()
    console.log(paraulaSecreta);
    if (!paraulaSecreta){   //Aqui es fan una serie de comprovacions per comprobar que la paraula es valida
        alert("Error: La paraula no pot ser buida")
    }else if(paraulaSecreta.length < 4){
        alert("Error: La paraula ha de tenir més de 3 caracters")
    }else if(/\d/.test(paraulaSecreta)){
        alert("La paraula no pot tenir numeros")
    //En cas de que sigui correcta estableix els colors de cada jugador pel seu torn, reinica la imatge del mig, deshabilita el boto començar partida i inputs, etc
    }else{  
        document.getElementById('puntsJugador').style.background = '#badc58';
        document.getElementById('puntsJugador2').style.background = '#ff7979';
        document.getElementById('començarPartida').style.background = '#F8EFBA';
        inputObj.disabled = true;
        botonObj.disabled = true;
        document.getElementById('imagenMuñeco').src = 'imagenes/penjat_0.jpg';
        for (let i = 0; i < 27; i++) {
            let boton = document.getElementById(`boto_${i}`);
            if (boton) {
                boton.disabled = false;
                boton.style.background = '#F8EFBA';
            }
        }
        partidesTotals++;
        document.getElementById('partidesTotals').textContent = partidesTotals;
        document.getElementById('partidesTotals2').textContent = partidesTotals;
        insertarGuiones();
    }
}

//Aquesta funció serveix per canviar el titol començar partida per els guions que siguin necesaris
function insertarGuiones(){
    arrayGuiones = [];
    //arrayParaulaSecreta = paraulaSecreta.split('')
    secretWord = loadWord();
    secretWord = secretWord.toUpperCase();
    console.log(secretWord);
    arrayParaulaSecreta = secretWord.split('');
    console.log(arrayParaulaSecreta);
    arrayParaulaSecreta.forEach(() => {
        arrayGuiones.push(' _ ');
    });
    paraulaGuions = arrayGuiones.join('');
    textInicial.textContent = paraulaGuions;

}

function insertarGuiones() {
    arrayGuiones = [];
    loadWord()
        .then(function (secretWord) {
            if (!secretWord) {
                console.error("Error: No se pudo cargar la palabra secreta.");
                return;
            }

            secretWord = secretWord.toUpperCase(); // Convierte la palabra a mayúsculas
            console.log("Palabra secreta:", secretWord);

            arrayParaulaSecreta = secretWord.split('');
            console.log("Array de palabra secreta:", arrayParaulaSecreta);

            arrayParaulaSecreta.forEach(() => {
                arrayGuiones.push(' _ ');
            });

            paraulaGuions = arrayGuiones.join('');
            textInicial.textContent = paraulaGuions; // Actualiza el texto inicial
        })
        .catch(function (error) {
            console.error("Error en insertarGuiones:", error);
        });
}


//Aquesta funció s'executa cada vegada que es pulsa una lletra
function jugarLletra(obj){
    let lletraJugada = obj.textContent;
    contadorLletra = 0;
    obj.disabled = true;
    //Aixó s'executa si la lletra esta inclosa dintre de la paraula secreta
    if(arrayParaulaSecreta.includes(lletraJugada)){
        for(let i = 0; i < arrayParaulaSecreta.length; i++) {
            if(arrayParaulaSecreta[i] === lletraJugada) {
                arrayGuiones[i] = lletraJugada;
                contadorLletra++;
            }
        }
        
        paraulaGuions = arrayGuiones.join('');
        textInicial.textContent = paraulaGuions;
        obj.style.backgroundColor = 'green';
        if (contadorLletra > 1) {
            if (jugadores[tornJugador].punts == 0){
                jugadores[tornJugador].punts = contadorLletra;
            }else if(jugadores[tornJugador].punts == 1){
                jugadores[tornJugador].punts += contadorLletra;
            }else{
                jugadores[tornJugador].punts = jugadores[tornJugador].punts * contadorLletra;
            }
        } else {
            jugadores[tornJugador].punts += racha;
        }
        racha++;
        document.getElementById('puntsActuals').textContent = jugadores[0].punts;
        document.getElementById('puntsActuals2').textContent = jugadores[1].punts;
        //En cas de que s'hagi completat la paraula s'executa el següent per finalitzar la partida
        if(!paraulaGuions.includes(' _ ')){
            if (jugadores[0].punts > jugadores[1].punts){
                jugadores[0].partidesGuanyades++;
            }else{
                jugadores[1].partidesGuanyades++;
            }
            document.getElementById('partidesGuanyades').textContent = jugadores[0].partidesGuanyades;
            document.getElementById('partidesGuanyades2').textContent = jugadores[1].partidesGuanyades;
            document.getElementById('començarPartida').style.background = 'green';
            inputObj.disabled = false;
            botonObj.disabled = false;
            errores = 0;
            for (let i = 0; i < 27; i++) {
                let boton = document.getElementById(`boto_${i}`);
                if (boton) {
                    boton.disabled = true;
                }
            }
            if (jugadores[0].punts > jugadores[0].maximPunts.mesPunts){
                jugadores[0].maximPunts.mesPunts = jugadores[0].punts;
                jugadores[0].maximPunts.fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData').textContent = jugadores[0].maximPunts.fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = jugadores[0].maximPunts.mesPunts;
            }
            if (jugadores[1].punts > jugadores[1].maximPunts.mesPunts){
                jugadores[1].maximPunts.mesPunts = jugadores[1].punts;
                jugadores[1].maximPunts.fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData2').textContent = jugadores[1].maximPunts.fechaPartida;
                document.getElementById('partidaMillorPunts2').textContent = jugadores[1].maximPunts.mesPunts;
            }
        }
    //Aixó s'executa en cas de que la  paraula no sigui correcta
    }else{
        
        errores++;
        racha = 1;
        if (jugadores[tornJugador].punts > 0){
            jugadores[tornJugador].punts--;
            document.getElementById('puntsActuals').textContent = jugadores[0].punts;
            document.getElementById('puntsActuals2').textContent = jugadores[1].punts;
        }
        if (tornJugador === 0){
            tornJugador = 1;
            document.getElementById('puntsJugador2').style.background = '#badc58';
            document.getElementById('puntsJugador').style.background = '#ff7979';
        }else{
            tornJugador = 0;
            document.getElementById('puntsJugador').style.background = '#badc58';
            document.getElementById('puntsJugador2').style.background = '#ff7979';
        }

        document.getElementById('imagenMuñeco').src = `imagenes/penjat_${errores}.jpg`;
        obj.style.backgroundColor = 'red';
        //En cas de que s'hagi arribat al maxim d'errors s'executa el següent per finalitzar la partida
        if (errores === maxErrores){
            document.getElementById('començarPartida').style.background = 'red';
            textInicial.textContent = paraulaSecreta;
            for (let i = 0; i < 27; i++) {
                let boton = document.getElementById(`boto_${i}`);
                if (boton) {
                    boton.disabled = true;
                }
            }
            inputObj.disabled = false;
            botonObj.disabled = false;
            errores = 0;
            if (jugadores[0].punts > jugadores[0].maximPunts.mesPunts){
                jugadores[0].maximPunts.mesPunts = jugadores[0].punts;
                jugadores[0].maximPunts.fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData').textContent = jugadores[0].maximPunts.fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = jugadores[0].maximPunts.mesPunts;
            }
            if (jugadores[1].punts > jugadores[1].maximPunts.mesPunts){
                jugadores[1].maximPunts.mesPunts = jugadores[1].punts;
                jugadores[1].maximPunts.fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData2').textContent = jugadores[1].maximPunts.fechaPartida;
                document.getElementById('partidaMillorPunts2').textContent = jugadores[1].maximPunts.mesPunts;
            }
        }
    }
}

