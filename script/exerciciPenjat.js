
const inputObj = document.getElementById('inputPalabra');

const botonObj = document.getElementById('buttonEmpezar');

const textInicial = document.getElementById('començarPartida');

const maxErrores = 10;

let errores = 0;

let racha = 1;

let contadorLletra = 0;

let partidesTotals = 0;

let partidesGuanyades = 0;

let partidesGuanyades2 = 0;

let mesPunts = 0;

let fechaPartida = new Date().toLocaleString('es-ES');

let mesPunts2 = 0;

let fechaPartida2 = new Date().toLocaleString('es-ES');


let paraulaSecreta;

let arrayParaulaSecreta;

let paraulaGuions;

let tornJugador = 0;

let punts = [0, 0];

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

//Aquesta funció serveix per començar una partida, reiniciar el punts, activar els botons de les lletres i restablir els colors d'alguns objectes
function empezarPartida(){
    tornJugador = 0;
    punts = [0, 0];
    racha = 1;
    document.getElementById('puntsActuals').textContent = punts[0];
    document.getElementById('puntsActuals2').textContent = punts[1];
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
    arrayParaulaSecreta = paraulaSecreta.split('')
    console.log(arrayParaulaSecreta)
    arrayParaulaSecreta.forEach(() => {
        arrayGuiones.push(' _ ');
    });
    paraulaGuions = arrayGuiones.join('');
    textInicial.textContent = paraulaGuions;
    
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
            if (punts[tornJugador] == 0){
                punts[tornJugador] = contadorLletra;
            }else if(punts[tornJugador] == 1){
                punts[tornJugador] += contadorLletra;
            }else{
                punts[tornJugador] = punts[tornJugador] * contadorLletra;
            }
        } else {
            punts[tornJugador] += racha;
        }
        racha++;
        document.getElementById('puntsActuals').textContent = punts[0];
        document.getElementById('puntsActuals2').textContent = punts[1];
        //En cas de que s'hagi completat la paraula s'executa el següent per finalitzar la partida
        if(!paraulaGuions.includes(' _ ')){
            if (punts[0] > punts[1]){
                partidesGuanyades++
            }else{
                partidesGuanyades2++
            }
            document.getElementById('partidesGuanyades').textContent = partidesGuanyades;
            document.getElementById('partidesGuanyades2').textContent = partidesGuanyades2;
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
            if (punts[0] > mesPunts){
                mesPunts = punts[0];
                fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData').textContent = fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = mesPunts;
            }
            if (punts[1] > mesPunts2){
                mesPunts2 = punts[1];
                fechaPartida2 = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData2').textContent = fechaPartida2;
                document.getElementById('partidaMillorPunts2').textContent = mesPunts2;
            }
        }
    //Aixó s'executa en cas de que la  paraula no sigui correcta
    }else{
        
        errores++;
        racha = 1;
        if (punts[tornJugador] > 0){
            punts[tornJugador]--;
            document.getElementById('puntsActuals').textContent = punts[0];
            document.getElementById('puntsActuals2').textContent = punts[1];
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
            if (punts[0] > mesPunts){
                mesPunts = punts[0];
                fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData').textContent = fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = mesPunts;
            }
            if (punts[1] > mesPunts2){
                mesPunts2 = punts[1];
                fechaPartida2 = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData2').textContent = fechaPartida2;
                document.getElementById('partidaMillorPunts2').textContent = mesPunts2;
            }
        }
    }
}

