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