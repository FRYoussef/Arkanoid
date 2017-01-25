/*
 * @autor Youssef El Faqir El Rhazoui
 *
 * Arkanoid con objetos y extras:
 *  -Todo lo de la parte sin obj
 *  -Diseño de niveles con diferentes ladrillos, de momento 3 niveles
 *	-Los ladrillos cuando se destruyen muestran su puntuacion durante un segundo
 *	-Fisica más realista de los ladrillos con la pelota
 *  -Puntuacion y tiempo del jugador
 *  -Sonido y musica
 *  -Vidas
 *  -PowerUps
 *      -Una vida extra
 *      -Aumentar el tamaño de la raqueta
 *      -La pelota va más lenta
 *      -Tres pelotas a la vez
 *  -Animacion de muerte de la raqueta
 *  -Pantalla final de game over
 */




//constantes del tamaño de la pantalla
const TAM_MARCO_X = 567;
const TAM_MARCO_Y = 487;

//////////////////////////CLASE: PELOTA///////////////////////////////

const PELOTA_TAM_X = 20;
const PELOTA_TAM_Y = 20;
const PELOTA_INC_Y = 2;

/*
 * Inicializa los atributos de la pelota
 */

function Pelota(id, cX, cY, pelotaIncX, pelotaIncY) {
    this.id = id;
    this.coordX = cX;
    this.coordY = cY;
    this.incX = pelotaIncX;
    this.incY = pelotaIncY;

    document.getElementById("zona").innerHTML += "<img src=\"res/ball.png\" id=\"pelota" + this.id + "\" height=\""
                                                + PELOTA_TAM_Y + "px\" width=\"" + PELOTA_TAM_X + "px\">";

    document.getElementById("pelota" + this.id).style.position = "absolute";
    document.getElementById("pelota" + this.id).style.right = this.coordX + "px";
    document.getElementById("pelota" + this.id).style.top = this.coordY + "px";
};


/*
 * Muestra la pelota en sus nuevas coordenadas
 */

Pelota.prototype.muestraPelota = function() {
    document.getElementById("pelota" + this.id).style.right = this.coordX + "px";
    document.getElementById("pelota" + this.id).style.top = this.coordY + "px";
};

/*
 * Mueve la pelota a sus nuevas coordenadas
 */

Pelota.prototype.muevePelota = function (objCoordX, objCoordY, OBJ_TAM_X, OBJ_TAM_Y) {
    if (empezar) {
        //Coloca la pelota encima de la raqueta
        this.coordX = objCoordX + (OBJ_TAM_X - OBJ_TAM_Y) / 2;
        this.coordY = objCoordY - PELOTA_TAM_Y - 1;
    } else {
        this.coordX += this.incX;
        this.coordY += this.incY;
    }
}

/*
 * Detecta el choque de la pelota con el elemento que se le pase 
 * (tiene lógica inversa, busca que no haya colision)
 */

Pelota.prototype.colisionPelota = function (coordX, coordY, TAM_X, TAM_Y) {

    if (coordX + TAM_X < this.coordX || coordX > this.coordX + PELOTA_TAM_X) return false;
    if (coordY + TAM_Y < this.coordY || coordY > this.coordY + PELOTA_TAM_Y) return false;
    //playSonido("colision");
    return true;
}

/*
 * Detecta si choca por el lateral, solo usar si ya sabemos que ha chocado
 */

Pelota.prototype.colisionPelotaLateral = function (coordX, coordY, TAM_X, TAM_Y) {

    var lateral = this.coordY > coordY && coordY + TAM_Y > this.coordY;
    var drcha = lateral && this.coordX + PELOTA_TAM_X > coordX && this.coordX < coordX;
    var izq = lateral && this.coordX < coordX + TAM_X && coordX + TAM_X < this.coordX + PELOTA_TAM_X;

    return drcha || izq;
}

/*
 * Detecta si choca por la superficie, solo usar si ya sabemos que ha chocado
 */

Pelota.prototype.colisionPelotaSuperficie = function (coordX, coordY, TAM_X, TAM_Y) {

    var superficie = this.coordX > coordX && coordX + TAM_X > this.coordX;
    var arriba = superficie && this.coordY + PELOTA_TAM_Y > coordX && this.coordY < coordY;
    var abajo = superficie && this.coordY < coordX + TAM_Y && coordY + TAM_Y < this.coordY + PELOTA_TAM_Y;

    return arriba || abajo;
}

//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////CLASE: LISTA DE PELOTAS//////////////////////////////////

const MAX_PELOTAS = 3;

/*
 * Inicializa los atributos, e introduce una pelota
 */

function ListaPelotas() {
    this.lista = [];
    this.lista.push(new Pelota(1, 0, 0, 0, 0));
    this.cont = 1;
}

/*
 * Genera y devuelve un id nuevo
 */

ListaPelotas.prototype.generaID = function () {
    var id = 1;
    var encontrado = false;
    while (true) {
        for (var i = 0; i < this.cont && !encontrado; i++) {
            encontrado = this.lista[i].id == id;
        }
        if (!encontrado) return id;
        encontrado = false;
        id++;
    }
}

/*
 * Genera y devuelve una pelota
 */

ListaPelotas.prototype.generaPelota = function(){
    var id = this.generaID();
    var incX = PELOTA_TAM_X + 1;
    var incY = -(PELOTA_TAM_Y + 1);

    //vamos a ver si al pintarla no se va ha salir del escenario 

    //limites derecho e izquierdo
    if (this.lista[this.cont-1].coordX + PELOTA_TAM_X + incX > TAM_MARCO_X || this.lista[this.cont-1].coordX + incX < 0) {
        incX = -incX;
    }
    //limite superior o inferior
    if (this.lista[this.cont-1].coordY + incY < 0 || this.lista[this.cont-1].coordY + PELOTA_TAM_Y + incY > TAM_MARCO_Y) {
        incY = -incY;
    }
   
    var cX = this.lista[this.cont-1].coordX + incX;
    var cY = this.lista[this.cont-1].coordY + incY;

    return new Pelota(id, cX, cY, 1, -1);
}

/*
 * Rellena toda la lista de pelotas
 */

ListaPelotas.prototype.rellenaPelotas = function () {
    for (var i = this.cont; i < MAX_PELOTAS; i++) {
        this.lista.push(this.generaPelota());
        this.cont++;
    }
}

/*
 * Elimina una pelota de la lista
 */

ListaPelotas.prototype.eliminaPelota = function (pos) {
    //lo quitamos del DOM
    var id = this.lista[pos].id;
    var p = document.getElementById("pelota" + id);
    p.parentNode.removeChild(p);

    //Lo quitamos de la lista
    for(var i = pos; i < this.cont - 1; i++){
        this.lista[i] = this.lista[i + 1];
    }
    this.lista.pop();
    this.cont--;
}

//////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////CLASE: RAQUETA///////////////////////////////////////

const RAQUETA_TAM_X = 104;
const RAQUETA_TAM_Y = 24;
const CORAZON_TAM_X = 150;
const CORAZON_TAM_Y = 25;
const CORAZON_OFFSET = 30;
const NUM_VIDAS = 3;

/*
 * Inicializa los atributos de la raqueta 
 */

function Raqueta() {
    this.tamX = RAQUETA_TAM_X;
    this.tamY = RAQUETA_TAM_Y;
    this.coordX = TAM_MARCO_X / 2.5;
    this.coordY = TAM_MARCO_Y - 25;
    this.incX = 10;
    this.vidas = NUM_VIDAS;
    this.eventoTam = null;
    this.contAnimacion = 1;
    
    this.annadeVidas();
    document.getElementById("zona").innerHTML += "<img src=\"res/raqueta.png\" id=\"raqueta\" height=\""
                                                + this.tamY + "px\" width=\"" + this.tamX + "px\">";

    document.getElementById("raqueta").style.position = "absolute";
    document.getElementById("raqueta").style.right = this.coordX + "px";
    document.getElementById("raqueta").style.top = this.coordY + "px";
}

/*
 * Añadirá las vidas iniciales a la pantalla 
 */

Raqueta.prototype.annadeVidas = function () {
    var x = -117;

    for (var i = 1; i <= this.vidas; i++){
        document.getElementById("zona").innerHTML += "<img src=\"res/Corazon.gif\" id=\"cor" + i + "\" height=\""
                                                    + CORAZON_TAM_Y + "px\" width=\"" + CORAZON_TAM_X + "px\">";

        document.getElementById("cor"+i).style.position = "absolute";
        document.getElementById("cor"+i).style.right = x + "px";
        document.getElementById("cor"+i).style.top = 0 + "px";
        x += CORAZON_OFFSET;
    }
}

/*
 * Añade y suma una vida
 */

Raqueta.prototype.annadeVida = function () {
    if (this.vidas < NUM_VIDAS) {
        //recupero la posicion del ultimo corazon
        var x = parseInt(document.getElementById("cor" + this.vidas).style.right) + CORAZON_OFFSET;
        ++this.vidas;
        document.getElementById("zona").innerHTML += "<img src=\"res/Corazon.gif\" id=\"cor" + this.vidas + "\" height=\""
                                                       + CORAZON_TAM_Y + "px\" width=\"" + CORAZON_TAM_X + "px\">";
        document.getElementById("cor" + this.vidas).style.position = "absolute";
        document.getElementById("cor" + this.vidas).style.right = x + "px";
        document.getElementById("cor" + this.vidas).style.top = 0 + "px";
    }
}

/*
 * Elimina y quita una vida
 */

Raqueta.prototype.quitaVida = function(){
    var v = document.getElementById("cor"+this.vidas);
    v.parentNode.removeChild(v);
    --this.vidas;
}

/*
 * Muestra la raqueta en sus coordenadas
 */

Raqueta.prototype.muestraRaqueta = function () {
    document.getElementById("raqueta").style.right = this.coordX + "px";
}

/*
 * Devuelve al tamaño normal a la raqueta
 */

Raqueta.prototype.devuelveTam = function () {
    this.tamX = RAQUETA_TAM_X;
    document.getElementById("raqueta").src = "res/raqueta.png";
    document.getElementById("raqueta").style.height = this.tamY + "px";
    document.getElementById("raqueta").style.width = this.tamX + "px";
}

/*
 * Agranda la raqueta
 */

Raqueta.prototype.agranda = function () {
    this.tamX = RAQUETA_TAM_X * 1.5;
    if (this.coordX + this.tamX > TAM_MARCO_X) {
        this.coordX = TAM_MARCO_X - (this.tamX + 1);
        this.muestraRaqueta();
    } 
    document.getElementById("raqueta").src = "res/raquetaLarge.png";
    document.getElementById("raqueta").style.height = this.tamY + "px";
    document.getElementById("raqueta").style.width = this.tamX + "px";
}

/*
 * Hace la animacion de muerte de la raqueta
 */

 Raqueta.prototype.animacionMuerte = function(){
 	document.getElementById("raqueta").src = "res/raquetaExplosion/raqueta_explode_" + this.contAnimacion + ".png";
 	//8 animaciones
 	++this.contAnimacion;
 	if(this.contAnimacion == 11){
 		this.contAnimacion = 1;
        animacion = false;
 		clearInterval(eventoAnimacion);	
 	}
 }

////////////////////////////////////////////////////////////////////////

//////////////////////////////CLASE: LADRILLO///////////////////////////

const LADRILLO_TAM_X = 45;
const LADRILLO_TAM_Y = 20;

/*
 * Inicializa los atributos del ladrillo
 */

function Ladrillo(coordX, coordY, id, color) {
    this.coordX = coordX;
    this.coordY = coordY;
    this.id = id;
    this.color = color;

    document.getElementById("zona").innerHTML += "<img src=\"res/brick_" + this.color + ".png\" id=\"ladrillo" + this.id + "\" height=\""
                                                                        + LADRILLO_TAM_Y + "px\" width=\"" + LADRILLO_TAM_X + "px\">";

    document.getElementById("ladrillo"+this.id).style.position = "absolute";
    document.getElementById("ladrillo"+this.id).style.right = this.coordX + "px";
    document.getElementById("ladrillo"+this.id).style.top = this.coordY + "px";
}

///////////////////////////////////////////////////////////////////////////////

/////////////////////////////////CLASE: LISTA_LADRILLOS////////////////////////

/*
 * Constructor de la lista de ladrillos
 */

function ListaLadrillos(colores) {
    this.lista = [];
    this.cont = 0;
    this.rellenaLadrillos(colores);
}

/*
 * Rellena de ladrillos nuestro array, en funcion de los colores que se le pasan
 */

ListaLadrillos.prototype.rellenaLadrillos = function (colores) {
    var x = 511;
    var y = 25;
    var id = 1;
    for (var i = 0; i < colores.length; i++) {
        //Un 0 es un hueco
        if (colores[i] !== 0) {
            var color = intToColor(colores[i]);
            this.lista.push(new Ladrillo(x, y, id, color));
            id++;
            this.cont++;
        }
        
        x -= 50;
        //siguiente linea
        if ((i+1) % 11 == 0) {
            x = 511;
            y += 30;
        } 
    }
}

/*
 * Hace una correspondencia entre el numero que se le pase y un color(una cadena)
 */

function intToColor(int) {
    switch (int) {
        case 1:
            return "green";
        case 2:
            return "brown";
        case 3:
            return "yellow";
        case 4:
            return "blue";
        case 5:
            return "red";
        case 6:
            return "orange";
        default:
            break;
    }
}

/*
 * Inserta la puntuacion de donde estaba el ladrillo, y luego lo borra
 */

ListaLadrillos.prototype.insertaPuntuacionLadrillo = function(pos){
    document.getElementById("zona").innerHTML += "<span class=\"puntos\">+" +
        colorPuntuacion(this.lista[pos].color) + "</span>";

   var domTodosLosPuntos = document.getElementsByClassName("puntos");
   domTodosLosPuntos[domTodosLosPuntos.length-1].style.color = 'white';
   domTodosLosPuntos[domTodosLosPuntos.length-1].style.position = 'absolute';
   domTodosLosPuntos[domTodosLosPuntos.length-1].style.top = this.lista[pos].coordY + "px";
   domTodosLosPuntos[domTodosLosPuntos.length-1].style.right = (this.lista[pos].coordX + LADRILLO_TAM_X / 3) + "px";
   setTimeout(function () {
        var domTodosLosPuntos = document.getElementsByClassName("puntos");
        domTodosLosPuntos[0].parentNode.removeChild(domTodosLosPuntos[0]);
    }, 800);
}

/*
 * Elimina un ladrillo de la lista
 */

ListaLadrillos.prototype.eliminaLadrillo = function (pos) {
    //lo quitamos del DOM
    var lad = document.getElementById("ladrillo"+this.lista[pos].id);
    lad.parentNode.removeChild(lad);

    this.insertaPuntuacionLadrillo(pos);

    //lo quitamos de la lista
    for (var i = pos; i < this.cont - 1; i++){
        this.lista[i] = this.lista[i + 1];
    }
    this.lista.pop();
    --this.cont;
}

///////////////////////////////////////////////////////////////////////////////

////////////////////////CLASE: POWER_UP////////////////////////////////////////

const POWER_UP_TAM_X = 20;
const POWER_UP_TAM_Y = 20;
const POWER_UP_INC_Y = 1;

/*
 * Constructor de la clase PowerUp
 */

function PowerUp(coordX, coordY, id, tipo) {
    this.coordX = coordX;
    this.coordY = coordY;
    this.tipo = tipo;
    this.id = id;

    document.getElementById("zona").innerHTML += "<img src=\"res/" + this.tipo + ".png\" id=\"powerUp" + this.id + "\" height=\""
                                                                        + POWER_UP_TAM_Y + "px\" width=\"" + POWER_UP_TAM_X + "px\">";

    document.getElementById("powerUp" + this.id).style.position = "absolute";
    document.getElementById("powerUp" + this.id).style.right = this.coordX + "px";
    document.getElementById("powerUp" + this.id).style.top = this.coordY + "px";
}

/*
 * Muestra el powerUp en sus nuevas coordenadas
 */

PowerUp.prototype.muestra = function () {
    document.getElementById("powerUp" + this.id).style.right = this.coordX + "px";
    document.getElementById("powerUp" + this.id).style.top = this.coordY + "px";
};

/*
 * Mueve el powerUp hacia abajo
 */

PowerUp.prototype.mueve = function () {
    this.coordY += POWER_UP_INC_Y;
}

/*
 * Controla si el powerUp ha sido recogido
 */

PowerUp.prototype.recoge = function (coordX, coordY, TAM_X, TAM_Y) {

    if (coordX + TAM_X < this.coordX || coordX > this.coordX + POWER_UP_TAM_X) return false;
    if (coordY + TAM_Y < this.coordY || coordY > this.coordY + POWER_UP_TAM_Y) return false;

    return true;
}

////////////////////////////////////////////////////////////////////

///////////////////////CLASE: LISTA_POWER_UP////////////////////////

/*
 * Lista para los powerUps
 */

function ListaPowerUp() {
    this.lista = [];
    this.cont = 0;
}

/*
 * Añade un powerUp a la lista
 */

ListaPowerUp.prototype.annadePU = function (coordX, coordY, tipo) {
    var id;
    if (this.cont == 0) id = 1;
    else id = this.lista[this.cont - 1].id + 1;

    this.lista.push(new PowerUp(coordX, coordY, id, tipo));
    this.cont++;
}

/*
 * Elimina un powerUp de la lista
 */

ListaPowerUp.prototype.eliminaPU = function (id, pos) {
    //lo quitamos del DOM
    var pU = document.getElementById("powerUp" + id);
    pU.parentNode.removeChild(pU);
    //lo quitamos de la lista
    for (var i = pos; i < this.cont - 1; i++) {
        this.lista[i] = this.lista[i + 1];
    }
    this.lista.pop();
    --this.cont;
}

////////////////////////////////////////////////////////////////////////////////////

////////////////////////////FUNCIONES DE CONTROL DEL JUEGO/////////////////////////

const INC_RATON = 8;
const TIEMPO_VEL = 10.0000;
const VEL_INI = 10;//es 10
const VEL_MAX = 5;// es 5

//eventos
var pararAumentoVel;
var parar;

//variables de juego
var nivel = 0;
var ratonX = window.innerWidth / 2;
var empezar;
var vel = VEL_INI;
var tIni;
var puntuacion = 0;
var animacion = false;
var eventoAnimacion;
var tiempoCronometro = (new Date()).getTime();
var eventoCrono;

/*
 * Mueve la raqueta según que tecla se pulse del teclado
 */

function controlaRaquetaTeclado(evento, raqueta, pelota) {
    if ((evento.keyCode == 37 || evento.keyCode == 65) && raqueta.coordX + raqueta.incX + raqueta.tamX < TAM_MARCO_X) {
        raqueta.coordX += raqueta.incX;
    } else if ((evento.keyCode == 39 || evento.keyCode == 68) && raqueta.coordX - raqueta.incX > 0) {
        raqueta.coordX -= raqueta.incX;
    } else if (empezar && evento.keyCode == 32) {
        onEmpezar(pelota);
    }
    if (evento.keyCode == 27) {
    	paraCrono();
        terminaPartida(true);
    }
    raqueta.muestraRaqueta();
}

/*
 * Mueve la raqueta con el raton
 */

function controlaRaquetaRaton(evento, raqueta) {
    if (evento.clientX > ratonX && raqueta.coordX - raqueta.incX > 0) {
        raqueta.coordX -= INC_RATON;
    } else if (evento.clientX < ratonX && raqueta.coordX + raqueta.incX + raqueta.tamX < TAM_MARCO_X) {
        raqueta.coordX += INC_RATON;
    }
    ratonX = evento.clientX;
    raqueta.muestraRaqueta();
}

/*
 * Lanza la pelotahacia arriba, cuando esta está situada encima de 
 * la raqueta.
 */

function onEmpezar(pelota) {
    if (empezar) {
        pelota.incX = 0.5;
        pelota.incY = -PELOTA_INC_Y;
        empezar = false;
    }

}

/*
 * Se le manda un numero de entre 1-100,
 * y se devuelve un powerUp (una cadena) en funcion de la probabilidad que tenga
 */

function probabilidadPU(num) {
    if(num >= 1 && num <= 5){
        return "corazon";
    }else if (num > 15 && num <= 16) {
        return "agranda";
    }else if (num > 40 && num <= 43) {
        return "slow";
    } else if (num > 20 && num <= 22) {//max 22
        return "pelotas";
    }
    return null;
}

/*
 * Ejecuta la acción del power up pasado
 */

function ejecutaPU(pU, listaPelotas, raqueta, listaLadrillos, listaPU) {
    switch (pU) {
        // +1 vida 
        case "corazon":
            raqueta.annadeVida();
            break;
        //La pelota se mueve más lento 
        case "slow":
            clearInterval(parar);
            vel = VEL_INI + 2;
            parar = setInterval(function () { velocidadJuego(listaPelotas, raqueta, listaLadrillos, listaPU) }, 5);
            break;
        //Agranda la raqueta
        case "agranda":
            clearTimeout(raqueta.eventoTam);
            raqueta.agranda();
            raqueta.eventoTam = setTimeout(function () { raqueta.devuelveTam() }, 9000);
            break;
        //Tres pelotas en pantalla
        case "pelotas":
            listaPelotas.rellenaPelotas();
            break;
        default:
            break;
    }
}

/*
 * Mira si la pelota ha chocado con los ladrillos
 */

function colisionLadrillos(pelota, listaLadrillos, listaPU) {
    var ladrilloRoto = false;
    for (var i = 0; i < listaLadrillos.cont; i++) {
        if (pelota.colisionPelota(listaLadrillos.lista[i].coordX, listaLadrillos.lista[i].coordY, LADRILLO_TAM_X, LADRILLO_TAM_Y)) {
           
            if (!ladrilloRoto) {
                var l = listaLadrillos.lista[i];

                if (pelota.colisionPelotaLateral(l.coordX, l.coordY, LADRILLO_TAM_X, LADRILLO_TAM_Y))
                    pelota.incX = -pelota.incX;
                
                else if (pelota.colisionPelotaSuperficie(l.coordX, l.coordY, LADRILLO_TAM_X, LADRILLO_TAM_Y))
                    pelota.incY = -pelota.incY;

                //faltan las cuatro diagonales
                else if (l.coordY >= pelota.coordY && l.coordX >= pelota.coordX) {

                    pelota.incX = -1 * Math.abs(pelota.incX);
                    pelota.incY = -1 * Math.abs(pelota.incY);

                } else if (l.coordY >= pelota.coordY && l.coordX <= pelota.coordX) {
                    
                    pelota.incX = Math.abs(pelota.incX);
                    pelota.incY = -1 * Math.abs(pelota.incY);

                } else if (l.coordY <= pelota.coordY && l.coordX >= pelota.coordX) {

                    pelota.incX = -1 * Math.abs(pelota.incX);
                    pelota.incY = Math.abs(pelota.incY);

                } else if (l.coordY <= pelota.coordY && l.coordX <= pelota.coordX) {

                    pelota.incX = Math.abs(pelota.incX);
                    pelota.incY = Math.abs(pelota.incY);

                }

                ladrilloRoto = true;
            }
           

            //comprobamos si genera un PU
            var pU = probabilidadPU(Math.floor((Math.random() * 100) + 1)); 
            if(pU !== null){
                listaPU.annadePU(listaLadrillos.lista[i].coordX, listaLadrillos.lista[i].coordY, pU);
            }

            //Sumamos la puntuacion asociada y la mostramos
            puntuacion += colorPuntuacion(listaLadrillos.lista[i].color);
            muestraPuntuacion();

            listaLadrillos.eliminaLadrillo(i);
            //return;
        }
    }
}

/*
 * Mueve los powerUp y comprueba si se ha recogido o ha llegado al final del mapa
 */

function mueveYRecogePU(listaPelotas, raqueta, listaLadrillos, listaPU) {
    var eliminado = false;

    for (var i = 0; i < listaPU.cont; i++) {
        listaPU.lista[i].mueve();
        listaPU.lista[i].muestra();

        //si choca con la raqueta
        if (listaPU.lista[i].recoge(raqueta.coordX, raqueta.coordY, raqueta.tamX, raqueta.tamY)) {
            ejecutaPU(listaPU.lista[i].tipo, listaPelotas, raqueta, listaLadrillos, listaPU);
            playSonido("pU");
            eliminado = true;
        }
        //si llega al final del mapa
        else if (listaPU.lista[i].coordY + POWER_UP_TAM_Y > TAM_MARCO_Y) {
            eliminado = true;
        }

        if(eliminado){
            listaPU.eliminaPU(listaPU.lista[i].id, i);
            i--;
        }
        eliminado = false;
    }
}

/*
 * Se encarga del control de la partida
 */

function movimientoDeElementos(listaPelotas, raqueta, listaLadrillos, listaPU) {
	if(!animacion){

        if (raqueta.vidas <= 0) terminaPartida(true);

	    var pelotaEliminada = false;
	    for (var i = 0; i < listaPelotas.cont; i++) {
	        if (!empezar) {

	        	/*//colision con otras pelotas
	        	for(var j = i + 1; j < listaPelotas.cont; j++){
	        		if (listaPelotas.lista[i].colisionPelota(listaPelotas.lista[j].coordX, listaPelotas.lista[j].coordY, 
	        			PELOTA_TAM_X, PELOTA_TAM_Y)) {

	        			//cambiamos la direccion de las pelotas
	        			listaPelotas.lista[i].incX = -listaPelotas.lista[i].incX;
	                	listaPelotas.lista[i].incY = -listaPelotas.lista[i].incY;

	                	listaPelotas.lista[j].incX = -listaPelotas.lista[j].incX;
	                	listaPelotas.lista[j].incY = -listaPelotas.lista[j].incY;
	        		}
	        	}*/

	            //choque con la raqueta
	            if (listaPelotas.lista[i].colisionPelota(raqueta.coordX, raqueta.coordY, raqueta.tamX, raqueta.tamY)) {
					
	                //20 secciones en la raqueta
	                var velocidad = ((raqueta.coordX + raqueta.tamX / 2) - (listaPelotas.lista[i].coordX + PELOTA_TAM_X / 2)) / 21;

                    //Si la velocidad es cero la hemos liado
	                if (velocidad == 0) velocidad = 0.1;

					//calculamos el signo de la pelota
					velocidad = (listaPelotas.lista[i].incX / Math.abs(listaPelotas.lista[i].incX)) * Math.abs(velocidad);

	                listaPelotas.lista[i].incX = velocidad;
	                listaPelotas.lista[i].incY = -PELOTA_INC_Y;
	            }

	            //Choque con los limites derecho e izquierdo
	            if (listaPelotas.lista[i].coordX + PELOTA_TAM_X + listaPelotas.lista[i].incX > TAM_MARCO_X 
	            	|| listaPelotas.lista[i].coordX + listaPelotas.lista[i].incX < 0) {

	                listaPelotas.lista[i].incX = -listaPelotas.lista[i].incX;
	            }
	            //limite superior
	            if (listaPelotas.lista[i].coordY + listaPelotas.lista[i].incY < 0) {
	                listaPelotas.lista[i].incY = -listaPelotas.lista[i].incY;
	            }
	            //limite inferior
	            if (listaPelotas.lista[i].coordY + PELOTA_TAM_Y + listaPelotas.lista[i].incY > TAM_MARCO_Y) {
	                if (listaPelotas.cont == 1) {
	                    playSonido("perderVida");
	                    raqueta.quitaVida();

	                    //quitamos puntos, no queremos puntuacion negativa
                        puntuacion > 20 ? puntuacion -= 20 : puntuacion = 0;
            			muestraPuntuacion();

	                    //Se ha quedado sin vidas
	                    if (raqueta.vidas <= 0) {
	                    	animacion = true;
                            paraCrono();
                            borraTecladoRaton();
                            eventoAnimacion = setInterval(function () { raqueta.animacionMuerte() }, 150);
                            playSonido("explosion");
	                    }
	                    empezar = true;
	                } else {
	                    listaPelotas.eliminaPelota(i);
	                    pelotaEliminada = true;
	                }
	            }

	            //Ya no hay mas ladrillos
	            if (listaLadrillos.cont == 0) {
	                controlPartida();
	            }

	            if (!pelotaEliminada) colisionLadrillos(listaPelotas.lista[i], listaLadrillos, listaPU);
	        }
	        if (!pelotaEliminada) {
	            listaPelotas.lista[i].muevePelota(raqueta.coordX, raqueta.coordY, raqueta.tamX, raqueta.tamY);
	            listaPelotas.lista[i].muestraPelota();
	        }
	        pelotaEliminada = false;
	    }
	    if (!empezar && listaPU.cont > 0) mueveYRecogePU(listaPelotas, raqueta, listaLadrillos, listaPU);
	}
}

/*
 * Sacamos el tiempo actual, lo comparamos con el inicial, y si es igual o mayor que el
 * tiempo que queremos usar para aumentar la velocidad, lo aumentamos.
 * Aumentamos la velocidad hasta un maximo.
 */

function velocidadJuego(listaPelotas, raqueta, listaLadrillos, listaPU) {
    if (!empezar) {
        var tActual = (new Date()).getTime();
        var tDiff = ((tActual - tIni) / 1000);

        if (tDiff >= TIEMPO_VEL) {
            tIni = tActual;
            clearInterval(pararAumentoVel);
            vel -= 1;
            pararAumentoVel = setInterval(function () { movimientoDeElementos(listaPelotas, raqueta, listaLadrillos, listaPU) }, vel);
        }
        if (vel <= VEL_MAX) {
            clearInterval(parar);
        }
    }
}

/*
 * Añade la musica y los efectos de sonido al dom
 */

function inicializaMusica() {
    document.body.innerHTML += "<audio id=\"bso\"><source src=\"res/audio/bso.wav\" type=\"audio/mpeg\"></audio>";
    document.body.innerHTML += "<audio id=\"pU\"><source src=\"res/audio/pU.WAV\" type=\"audio/mpeg\"></audio>";
    document.body.innerHTML += "<audio id=\"gameOver\"><source src=\"res/audio/gameOver.wav\" type=\"audio/mpeg\"></audio>";
    document.body.innerHTML += "<audio id=\"inicio\"><source src=\"res/audio/inicio.wav\" type=\"audio/mpeg\"></audio>";
    document.body.innerHTML += "<audio id=\"perderVida\"><source src=\"res/audio/perderVida.WAV\" type=\"audio/mpeg\"></audio>";
    document.body.innerHTML += "<audio id=\"explosion\"><source src=\"res/audio/explosion.wav\" type=\"audio/mpeg\"></audio>";
    //document.body.innerHTML += "<audio id=\"colision\"><source src=\"res/audio/colision.wav\" type=\"audio/mpeg\"></audio>";

    var x = document.getElementById("bso");
    x.volume = 0.6;
    x.loop = true;
    var x = document.getElementById("gameOver");
    x.volume = 0.1;
}

/*
 * Pone en marcha un sonido
 */

function playSonido(sonido) { 
    var x = document.getElementById(sonido);
    x.play();
}

/*
 * Para un sonido 
 */

function pauseSonido(sonido) {
    var x = document.getElementById(sonido);
    x.pause();
}

/*
 * Borra los eventos del teclado y raton
 */

 function borraTecladoRaton(){
    document.onmousemove = null;
    document.onkeydown = null;
    document.onkeyup = null;
    document.onclick = null;
 }

/*
 * Termina la partida, y muestra un mensaje de finalización 
 * si el valor pasado es True
 */

function terminaPartida(fin) {
    clearInterval(parar);
    clearInterval(pararAumentoVel);
    borraTecladoRaton();
    document.getElementById("zona").innerHTML = "";
    if (fin) {
        document.getElementById("zona").innerHTML = "<img src=\"res/gameOver.png\" height=\"400px\" width=\"500px\" style=\"margin-left: 6%\">";
        puntuacionYTiempoFinales();
        pauseSonido("bso");
        playSonido("gameOver");
    } 
}

/*
 * Intoduce en el dom la puntuacion y tiempo finales
 */

 function puntuacionYTiempoFinales(){
    document.getElementById("zona").innerHTML += "<div id=\"puntosTiempo\"></div>";
    document.getElementById("puntosTiempo").innerHTML += "<h2>Has hecho: " + puntuacion + " ptos" +
                                                         ", en: " + tiempoCronometro + "</h2>";
    var domPuntosTiempo = document.getElementById("puntosTiempo");
    domPuntosTiempo.style.marginLeft = '23%';
    domPuntosTiempo.style.color = 'white';
 }

/*
 * Selecciona el nivel
 * Cada número es la codificación de un color de ladrillo.
 * El cero es un hueco vacío.
 */

function seleccionaNivel() {
    switch (nivel) {
        /*case 1:
            return [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 6, 6, 6, 0, 0, 0, 0,
                    0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0,
                    0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0,
                    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];*/
        
        case 1:
            return [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0, 1, 1, 5, 1, 1, 1, 5, 1, 1, 0,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
                    1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
                    0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0];

        case 2:
            return [0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0,
                    0, 0, 0, 4, 1, 1, 1, 4, 0, 0, 0,
                    0, 0, 4, 1, 3, 3, 3, 1, 4, 0, 0,
                    0, 4, 1, 3, 6, 6, 6, 3, 1, 4, 0,
                    4, 1, 3, 6, 5, 5, 5, 6, 3, 1, 4,
                    4, 1, 3, 6, 5, 0, 5, 6, 3, 1, 4,
                    4, 1, 3, 6, 5, 0, 5, 6, 3, 1, 4,
                    0, 4, 1, 3, 6, 0, 6, 3, 1, 4, 0,
                    0, 0, 4, 1, 3, 0, 3, 1, 4, 0, 0,
                    0, 0, 0, 4, 1, 0, 1, 4, 0, 0, 0,
                    0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0];

        case 3:
            return [0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0,
                    0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0,
                    0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
                    3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0,
                    3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0,
                    3, 3, 3, 3, 3, 0, 3, 3, 0, 3, 3,
                    3, 3, 3, 3, 3, 0, 3, 3, 0, 3, 3,
                    3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0,
                    3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0,
                    0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
                    0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0,
                    0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0];

            break;

        default:
            return null;
    }
}

/*
 * Se le envia un color de un ladrillo y devuelve la puntuacion asociada
 */

 function colorPuntuacion(color){
 	switch(color){
 		case "green":
 			return 5;
 		case "blue":
 			return 5;
 		case "yellow":
 			return 10;
 		case "orange":
 			return 15;
 		case "red":
 			return 20;
 		case "brown":
 			return 25;
 		default:
 			return 0;
 	}
 }

/*
 * Inicializa el elemento cronometro del dom
 */

function inicializaCrono(){
    document.getElementById("zona").innerHTML += "<span id=\"cronometro\"></span>";
    var domCronometro = document.getElementById("cronometro");
    domCronometro.style.cssFloat = 'left';
    domCronometro.style.marginLeft = '5%';
    domCronometro.style.color = 'white';
}

/*
 * Devuelve un string del tiempo del cronometro actual
 */

 function dameCrono(){
    var tActual = (new Date()).getTime();
    var tFinal = tActual - tiempoCronometro;
    var segundos = parseInt((tFinal / 1000) % 60);
    var minutos = parseInt((tFinal / 1000) / 60);

    if(segundos < 10) segundos = "0" + segundos;
    if(minutos < 10) minutos = "0" + minutos;

    return minutos + ":" + segundos;
 }

 /*
 * Muestra el cronometro actualizado
 */

 function muestraCrono(){
    document.getElementById("cronometro").innerHTML = dameCrono();
 }

 /*
  * Para y guarda el valor final del cronometro
  */

function paraCrono(){
	tiempoCronometro = dameCrono();
    clearInterval(eventoCrono);
}

/*
 * Inicializa la puntuacion
 */

 function inicializaPuntuacion(){
 	document.getElementById("zona").innerHTML += "<span id=\"puntuacion\"></span>";
 	var domPuntuacion = document.getElementById("puntuacion");
 	domPuntuacion.style.cssFloat = 'left';
 	domPuntuacion.style.marginLeft = '35%';
 	domPuntuacion.style.color = 'white';
 }


/*
 * Muestra la puntuacion actualizada
 */

 function muestraPuntuacion(){
 	document.getElementById("puntuacion").innerHTML = "Puntuacion: " + puntuacion;
 }

/*
 * Empieza una partida, continua a niveles posteriores, hasta que estos terminan
 */

function controlPartida() {
    nivel++;
    var nivelLadrillos = seleccionaNivel();
    if (nivelLadrillos != null) {
        terminaPartida(false);
        inicializaPuntuacion();
        muestraPuntuacion();
        clearInterval(eventoCrono);
        inicializaCrono();
        muestraCrono();
        eventoCrono = setInterval(function(){ muestraCrono(); }, 1000);
        playSonido("inicio");
        playSonido("bso");
        var raqueta = new Raqueta();
        var listaPelotas = new ListaPelotas();
        var listaPU = new ListaPowerUp();
        var listaLadrillos = new ListaLadrillos(nivelLadrillos);
        empezar = true;
        tIni = (new Date()).getTime();
        vel = VEL_INI;

        document.onmousemove = function (evento) { controlaRaquetaRaton(evento, raqueta); };
        document.onkeydown = function (evento) { controlaRaquetaTeclado(evento, raqueta, listaPelotas.lista[0]); };
        document.onkeyup = function (evento) { controlaRaquetaTeclado(evento, raqueta, listaPelotas.lista[0]); };
        document.onclick = function () { onEmpezar(listaPelotas.lista[0]); };
        pararAumentoVel = setInterval(function () { movimientoDeElementos(listaPelotas, raqueta, listaLadrillos, listaPU) }, vel)
        parar = setInterval(function () { velocidadJuego(listaPelotas, raqueta, listaLadrillos, listaPU) }, 5);
    } else {
    	paraCrono();
        terminaPartida(true);
    }
    
}


window.onload = function () {
    inicializaMusica();
    controlPartida();
}

//////////////////////////////////////////////////////////////////////////////////////