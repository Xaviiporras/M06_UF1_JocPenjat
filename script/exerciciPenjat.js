
const inputObj = document.getElementById('inputPalabra');

const botonObj = document.getElementById('buttonEmpezar');

const textInicial = document.getElementById('començarPartida');

const maxErrores = 10;

let errores = 0;

let racha = 1;

let puntsActual = 0;

let contadorLletra = 0;

let partidesTotals = 0;

let partidesGuanyades = 0;

let mesPunts = 0;

let fechaPartida = new Date().toLocaleString('es-ES');

let paraulaSecreta;

let arrayParaulaSecreta;

let paraulaGuions;


function mostrarParaula(){
    if (inputObj.type === "password") {
        inputObj.type = "text";
        document.getElementById('mostrar').src = 'imagenes/hide.png';
    } else{
        inputObj.type = "password";
        document.getElementById('mostrar').src = 'imagenes/view.png';
    }
}

function empezarPartida(){
    paraulaSecreta = inputObj.value;
    paraulaSecreta = paraulaSecreta.toUpperCase()
    console.log(paraulaSecreta);
    if (!paraulaSecreta){
        alert("Error: La paraula no pot ser buida")
    }else if(paraulaSecreta.length < 4){
        alert("Error: La paraula ha de tenir més de 3 caracters")
    }else if(/\d/.test(paraulaSecreta)){
        alert("La paraula no pot tenir numeros")
    }else{
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
        insertarGuiones();
    }
}

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

function jugarLletra(obj){
    let lletraJugada = obj.textContent;
    contadorLletra = 0;
    obj.disabled = true;
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
            if (puntsActual == 0){
                puntsActual = contadorLletra;
            }else{
                puntsActual = puntsActual * contadorLletra;
            }
        } else {
            puntsActual += racha;
        }
        racha++;
        document.getElementById('puntsActuals').textContent = puntsActual;
        if(!paraulaGuions.includes(' _ ')){
            partidesGuanyades++;
            document.getElementById('partidesGuanyades').textContent = partidesGuanyades;
            document.getElementById('començarPartida').style.background = 'green';
            inputObj.disabled = false;
            botonObj.disabled = false;
            for (let i = 0; i < 27; i++) {
                let boton = document.getElementById(`boto_${i}`);
                if (boton) {
                    boton.disabled = true;
                }
            }
            errores = 0;
            if (puntsActual > mesPunts){
                mesPunts = puntsActual;
                fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillorData').textContent = fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = mesPunts;
            }
        }
    }else{
        errores++;
        racha = 1;
        if (puntsActual > 0){
            puntsActual--;
            document.getElementById('puntsActuals').textContent = puntsActual;
        }

        document.getElementById('imagenMuñeco').src = `imagenes/penjat_${errores}.jpg`;
        obj.style.backgroundColor = 'red';
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
            if (puntsActual > mesPunts){
                mesPunts = puntsActual;
                fechaPartida = new Date().toLocaleString('es-ES');
                document.getElementById('partidaMillor').textContent = fechaPartida;
                document.getElementById('partidaMillorPunts').textContent = mesPunts;
            }
        }
    }
}

