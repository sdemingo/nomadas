
var userAdmin
var userAdminMail = "sdemingo@gmail.com"


$(document).ready(function(){

    getUserByMail(userAdminMail,function(u){
	userAdmin=u
    },false)

    if (!userAdmin){
	showConfirmation("Se necesita importar datos de usuario y puntos ¿Desea importar ahora?",importar)
    }
});





function importar(){

    // Importamos el usuario que realizará la creación

    userAdmin={
	Id:0,
	Name:"Sergio de Mingo",
	Mail:"sdemingo@gmail.com",
	Role:15
    }

    addUser(userAdmin,function(u){
	userAdmin=u
    },false)
    


    // Importamos los puntos

/*
    console.log("preparados para importar "+puntos_antiguos.length+" puntos")

    for (var i=0;i<puntos_antiguos.length;i++){
	var p = new Point()
	
	p.Name = puntos_antiguos[i].nombre
	p.UserId = userAdmin.Id
	p.Lat = puntos_antiguos[i].lat.toString()
	p.Lon = puntos_antiguos[i].lon.toString()
	p.Desc = puntos_antiguos[i].desc

	sendPoint(p)
    }
*/

    for (var i=0;i<areas.length;i++){
	var p = new Point()
	
	p.Name = areas[i].nombre
	p.UserId = userAdmin.Id
	p.Lat = areas[i].lat.toString()
	p.Lon = areas[i].lon.toString()
	p.Desc = areas[i].desc

	sendPoint(p)
    }

}



var areas=[
    {
	nombre:"Area de Vagueria",
	lat:40.549531,
	lon:-8.770207,
	creado:"4/15",
	img:"",
	href:"",
	desc:"Área privada. La carga y descarga de agua costó 2.50 €. Parecía que también se podia pernoctar aunque no preguntamos el precio. Está en primera línea de playa tras una duna"
    },
    {
	nombre:"Area Vila Praia de Ancora",
	lat:41.811456,
	lon: -8.859773,
	creado:"8/14",
	img:"",
	href:"",
	desc:"Área gratuita en la estación de autobuses, en pleno centro urbano. A pesar de esto tiene buena entrada por la calle y permite maniobrar bien. No tiene espacio para pernocta"
    },
    {
	nombre:"Area Vila Nova de Cerveira",
	lat:41.938084, 
	lon:-8.746724,
	creado:"8/14",
	img:"",
	href:"",
	desc:"Área gratuita en la estación de autobuses, en las afueras del pueblo. Tiene un parking grande donde poder aparcar y pernoctar"
    },
    {
	nombre:"Area de Muñogrande",
	lat:40.828255, 
	lon:-4.936005,
	creado:"8/14",
	img:"",
	href:"",
	desc:"Área gratuita en gasolinera Repsol. Tiene servicio de cambio de aguas y vaciado de negras"
    },
    {
	nombre:"Area de Lagartera",
	lat:39.911874, 
	lon:-5.199965,
	creado:"3/14",
	img:"",
	href:"",
	desc:"Área gratuita urbana. Apenas tiene sitio para aparcar aunque por el pueblo no hay problema"
    },
    {
	nombre:"Area de Duruelo",
	lat:41.952362, 
	lon:-2.927180,
	creado:"8/14",
	img:"",
	href:"",
	desc:"Área de pago. En las afueras del pueblo, no es un gran sitio para pernoctar. El coste era un 1€ por cambiar aguas, a pagar en el ayuntamiento pero estaba sin vigilancia."
    }
]








var puntos_antiguos=[
    {
	nombre:"La Fabriquilla",
	lat:36.736030,
	lon:-2.205797,
	creado:"",
	img:"img/la-fabriquilla.jpg",
	href:"",
	desc: "Un lugar ideal para disfrutar de atardeceres espectaculares sobre el mar. Salvaje y poco masificado"
    },
    {
	nombre:"Isleta del Moro",
	lat:36.816559,
	lon:-2.051005,
	creado:"",
	img:"img/isleta-moro.jpg",
	href:"",
	desc: "Muy cerca del pueblo en el que se pueden encontrar tiendas de comida, restaurantes y unos lavaderos públicos en la plaza en los que coger agua dulce."
    },
    {
	nombre:"Las Huertas de Xeraco",
	lat:39.072792,
	lon:-0.207898,
	creado:"",
	img:"img/tavernes-huertas.jpg",
	href:"",
	desc: "Zona salvaje y solitaria cercana a Tavernes. Bastante escondida y dificil de encontrar sin GPS. Carece de cualquier servicio cercano pero se encuentra a escasos 30 metros del agua y sin posibilidad de atascarse en bancos de arena o barro."
    },
    {
	nombre:"Parking de Tavernes",
	lat:39.081535,
	lon:-0.213713,
	creado:"",
	img:"",
	href:"",
	desc: "Parking de autocaravanas y zona de estacionamiento no multado. Cercana al pueblo y a la zona de apartamentos. Posiblemente esté muy masificada en verano."
    },
    {
	nombre:"Camping de Casavieja",
	lat:40.303696,
	lon:-4.761029,
	creado:"",
	img:"img/casavieja.jpg",
	href:"",
	desc: "Frente al camping podemos encontrar una zona de estacionamiento no multado. Puede que se llene en temporada alta. Además de los servicios del camping, tiene agua dulce, merendero y barbacoas a libre disposición."
    },
    {
	nombre:"El Palmar",
	lat:36.223782,
	lon:-6.064035,
	creado:"",
	img:"img/elpalmar.jpg",
	href:"",
	desc: "Aparcamiento junto a la playa. Posibilidad de bancales de arena con tiempo seco. Baños municipales y supermercado a 70 metros. En temporada alta puede haber problema con los municipales."
    },
    {
	nombre:"Nacimiento del Río Mundo",
	lat:38.472710,
	lon:-2.445831,
	creado:"",
	img:"img/rio-mundo.jpg",
	href:"",
	desc: "Lugar arbolado aunque escondido de la carretera. Sin agua dulce pero con abundante sombra. Es parte de una pista forestal y además pertenece al terreno del parque natural por lo que puede ser peligroso si quereis evitar multas."
    },
    {
	nombre:"Ríopar Viejo",
	lat:38.503548,
	lon:-2.447505,
	creado:"",
	img:"img/riopar-viejo.jpg",
	href:"",
	desc: "Situado a unos 6 kilómetros de la localidad de Ríopar y a unos 10 del nacimiento del Río Mundo. Sin agua y con pocas sombras. Es muy tranquilo y un paraje con mucho encanto pues el pueblo esta semiabandonado."
    },
    {
	nombre:"Sebúlcor",
	lat:41.271645,
	lon:-3.889139,
	creado:"",
	img:"img/sebulcor.jpg",
	href:"",
	desc: "Aparcamiento de grava gruesa sin peligro de atascos. Junto a los campos de futbol y a una zona infantil. Zona muy tranquila a las afueras del pueblo y con sombras. Sin agua ni servicios de ningún tipo."
    },
    {
	nombre:"Abanco",
	lat:41.381557,
	lon:-2.950794,
	creado:"",
	img:"img/abanco.jpg",
	href:"",
	desc: "Si buscais huir de lo cotidiano, del ruido, de la ciudad y del estress, debeis pasar al menos una noche bajo un cielo estrellado en mitad de los campos sorianos."
    },
    {
	nombre:"Lac-de-la-Raho",
	lat:42.624329,
	lon:2.892537,
	creado:"",
	img:"img/lac-raho.jpg",
	href:"",
	desc: "Un buen sitio para descansar en la zona de Perpignan, bien para seguir camino al norte o bien para moverte por la zona. Los fines de semana, según me pareció, puede llenarse de franceses en plan dominguero hasta después del atardecer."
    },
    {
	nombre:"Frejús",
	lat:43.424412,
	lon:6.735139,
	creado:"",
	img:"img/frejus.jpg",
	href:"",
	desc: "Dormimos en el parking del centro comercial junto con varias autocaravanas. Un poco más adelante, justo al lado del puerto, existe un parking gratuito para autos pero la zona estaba abarrotada de coches (sabado de agosto por la noche), de arena y de polvo."
    },
    {
	nombre:"Kamp Laguna",
	lat:44.824131,
	lon:13.852344,
	creado:"",
	img:"img/kamp-laguna.jpg",
	href:"",
	desc: "Este es un perfecto camping si quereis pasar unos días tranquilos en Pula. Con playa privada y la señora Margareta que convierte esta finquita en un oasis de tranquilidad familiar un buen rollito."
    },
    {
	nombre:"Autocamp Turist",
	lat:44.973358,
	lon:15.647664,
	creado:"",
	img:"img/autocamp-turist-plivitce.jpg",
	href:"",
	desc: "Este es un sitio ideal para descansar cuando visiteis el Parque Nacional de Los Lagos de Plivitce. Es un camping muy tranquilo y con instalaciones bastante majas. Es todo muy verde y con muchas sombras, asi que no os será difícil encontrar una buena zona de aparcamiento. Además tiene barbacoas para poder cocinar a cualquier hora y admiten perros."
    },
    {
	nombre:"Novi Ligure",
	lat:44.799927,
	lon:8.749495,
	creado:"",
	img:"img/novi-ligure.jpg",
	href:"",
	desc: "No es un mal sitio para parar aunque puede parecer algo desanjelado. Es un sitio tranquilo, con bar, gasolinera y baños. Entre Genova y Brescia."
    },
    {
	nombre:"La Plataforma",
	lat:40.275154,
	lon:-5.232389,
	creado:"",
	img:"img/gredos-plataforma.jpg",
	href:"",
	desc: "Para dormir a pie del macizo central de Gredos. Al ser parque nacional suele pasarse la guardia civil los fines de semana, asi que es recomendable no dejar la furgoneta mal aparcada para no darles argumentos. En principio no suelen poner problemas para pernoctar alli. No tiene ningún servicio y esta ligeramente inclinado."
    },
    {
	nombre:"Embalse de Burguillo",
	lat:40.420685,
	lon:-4.592650,
	creado:"",
	img:"rinconada.jpg",
	href:"",
	desc: "Sitio tranquilo en las cercanias de la urbanización La Rinconada, en el Valle de Iruelas. De difícil acceso por un estrecho camino en cuesta que puede dejar a más de uno atascado. Si el nivel del pantano es decente el sitio es casi una playa."
    },
    {
	nombre:"Torre del Pirulico",
	lat:37.068512,
	lon:-1.850435,
	creado:"",
	img:"img/torre-pirulico.jpg",
	href:"",
	desc: "Un precioso sitio donde pasar la noche, a borde de un rocoso acantilado de arena y roca. No tiene agua o construcciones cerca y no es posible aparcar más de tres o cuatro furgonetas con seguridad. Recomendado llegar de día, sobre todo si se tiene vértigo."
    },
    {
	nombre:"Cala del Sombrerico",
	lat:37.060635,
	lon:-1.855627,
	creado:"",
	img:"img/sombrerico.jpg",
	href:"",
	desc: "Cala salvaje en las cercanías de Mojacar. A unos 300 metros al sur, siguiendo por la pista encontramos un chiringuito con agua. El camino para llegar es aceptable para casi cualquier furgoneta aunque no lo recomiendo recorrer de noche."
    },
    {
	nombre:"Porto Covo",
	lat:37.858521,
	lon:-8.792902,
	creado:"",
	img:"img/porto-covo.jpg",
	href:"",
	desc: "Área de autocaravanas a borde de playa. A unos 15 minutos andando del pueblo. Sin baños ni agua. A pesar de ser finales de julio, la encontré tranquila."
    },
    {
	nombre:"Fontainhas",
	lat:38.177555,
	lon:-8.780281,
	creado:"",
	img:"img/fontainhas.jpg",
	href:"",
	desc: "Parking de playa. Sin baños ni agua pero justo al lado de un chiringuito de gente muy maja. Playa solitaria."
    },
    {
	nombre:"Playa de Melides",
	lat:38.127853,
	lon:-8.791915,
	creado:"",
	img:"img/melides.jpg",
	href:"",
	desc: "Se aparca a un borde de un camino bastante arenoso. Cerca de los chiringuitos y es posible que estos hagan algo de ruido de noche. Por lo demás muy tranquilo. Para llegar a la playa es necesario cruzar unas dunas (unos 100 metros)"
    },
    {
	nombre:"Playa de Aivados",
	lat:37.806007,
	lon:-8.796278,
	creado:"img/aivados.jpg",
	img:"",
	href:"",
	desc: "Aparcamiento de arena y algo de cesped a borde de playa. Tranquilo y apartado. Para repostar agua o comida lo más cercano es Porto Covo. Es necesario llegar por un camino de tierra de unos 2 km sin problemas para cualquier furgoneta."
    },
    {
	nombre:"Playa de Malhao",
	lat:37.778522,
	lon:-8.801461,
	creado:"",
	img:"img/malhao.jpg",
	href:"",
	desc: "Playa tranquila y bonita. Sin agua ni baños. Hay un camping cerca. Los fines de semana está bastante masificada y encontrar sitio cerca de los accesos a la arena es dificil."
    },
    {
	nombre:"Playa de Fornas",
	lat:37.716599,
	lon:-8.784078,
	creado:"",
	img:"img/vilanova.jpg",
	href:"",
	desc: "Situado en la localidad de Vila Nova de Milfontes, Fornas es una playa situada en la desembocadura de una bonita ria. El aparcamiento no tiene agua ni baños pero la playa está al lado y es grande y espaciosa."
    },
    {
	nombre:"Playa de Almograve",
	lat:37.648605,
	lon:-8.805395,
	creado:"",
	img:"img/almograve.jpg",
	href:"",
	desc: "Algo alejada del pueblo pero con un pequeño chiringuito y un caño de agua dulce. Puedes usar los baños del bar. Es una playa no muy grande y bastante rocosa. Ideal para bucear y hacer surf si no te dan miedo las rocas."
    },
    {
	nombre:"Playa de Amado",
	lat:37.169281,
	lon:-8.900951,
	creado:"",
	img:"img/carrapateira.jpg",
	href:"",
	desc: "Situada en la localidad de Carrapateira, está bien para aparcar. Tiene baños y agua dulce aunque suele estar muy masificada. Sobre todo por surfistas. Si no te gustan las playas masificadas es mejor evitar."
    },
    {
	nombre:"Fuente de La Piedra",
	lat:37.135651,
	lon:-4.737162,
	creado:"",
	img:"",
	href:"",
	desc: "El pueblo no tiene nada de especial y lo encontramos de casualidad. Lo mejor es que es tranquilo y que está a borde de la A-92. El sitio se encuentra cerca de la estación de tren."
    },
    {
	nombre:"Cabopino",
	lat:36.485233,
	lon:-4.742698,
	creado:"",
	img:"img/cabopino.jpg",
	href:"",
	desc: "Buen lugar a borde de playa. Tiene baños y agua potable a discreción. Ojo a los chiringuitos que son caros."
    },
    {
	nombre:"Zahara de los Atunes",
	lat:36.133751,
	lon:-5.844504,
	creado:"",
	img:"img/zahara.jpg",
	href:"",
	desc: "Aparcamiento público a pie de playa y cerca del pueblo. Sin agua ni baños. Con un supermercado Dia al lado."
    },
    {
	nombre:"Zambujeira do Mar",
	lat:37.520050,
	lon:-8.786724,
	creado:"",
	img:"img/zambujeira.jpg",
	href:"",
	desc: "Aparcamiento de tierra. Situado cerca de las dos playas del pueblo. Con una fuente de agua dulce como a unos 5 minutos de paseo."
    },
    {
	nombre:"Sagres",
	lat:37.003208,
	lon:-8.945655,
	creado:"",
	img:"img/sagres.jpg",
	href:"",
	desc: "Aparcamiento de asfalto al lado de la fortaleza. Se encuentra un poco lejos del acceso a la playa aunque tiene buenas vistas. Sin agua ni baños cerca."
    },
    {
	nombre:"Parque de Monfragüe",
	lat:39.850407,
	lon:-6.032229,
	img:"img/monfrague.jpg",
	creado:"3/14",
	href:"",
	desc: "Zona de aparcamiento del paque. Terreno llano y de grava. Sin servicios ni agua. Tranquilo y no visible desde la carretera"
    },
    {
	nombre:"Puente del Arzobispo",
	lat:39.819023,
	lon:-5.162915,
	creado:"3/14",
	img:"img/puente-del-arzobispo.jpg",
	href:"",
	desc: "Ermita de la Virgen de la Bienvenida. Muy tranquilo y alejado del pueblo. Zona llana y de cesped. Por el camino solo pasan algún paseante. Ojo al camino de entrada, estrecho, la auto paso lenta pero con cuidado. Mejor llegar de día."
    },
    {
	nombre:"Area Romero Mérida",
	lat:38.859334, 
	lon:-6.363803,
	creado:"4/14",
	img:"img/area-merida.jpg",
	href:"",
	desc: "Área de servicio en la confluencia entre la A-66 y la A-5 en Mérida. El hotel y la cafetería abren 24 horas. La gasolinera no."
    },
    {
	nombre:"Madrigal de la Vera",
	lat:40.146839,  
	lon:-5.362434,
	creado:"5/14",
	img:"img/madrigal-de-la-vera.jpg",
	href:"",
	desc: "A unos minutos del centro del pueblo. Parece un parking de autobuses. Caminando hacia el pueblo hay varias fuentes."
    },
    {
	nombre:"Losar de la Vera",
	lat:40.118521, 
	lon:-5.605538,
	creado:"5/14",
	img:"img/losar-de-la-vera.jpg",
	href:"",
	desc: "Área de autocaravanas. Con vaciado y llenado completo. El pueblo es bastante feo y no merece dedicarle ni un minuto."
    },
    {
	nombre:"Riaza",
	lat:41.279199, 
	lon:-3.488602,
	creado:"6/14",
	img:"img/riaza-pueblo.jpg",
	href:"",
	desc: "Solar a las afueras de Riaza y muy próximo a la salida a la N-110. Tranquilo y despejado. Del centro del pueblo como a 15 minutos andando."
    },
    {
	nombre:"Ermita de Hontanares",
	lat:41.28496, 
	lon:-3.437825,
	creado:"6/14",
	img:"img/riaza.jpg",
	href:"",
	desc: "Zona recreativa en en el municipio de Riaza. Ideal para pasar el día o el fin de semana. Con rutas para senderismo o btt. Barbacoas de ladrillo con posibilidad de usar en verano. Varias fuentes de agua y muchas sombras."
    },
    {
	nombre:"Ciudad Rodrigo",
	lat: 40.607948, 
	lon: -6.524334,
	creado:"8/14",
	img:"",
	href:"",
	desc: "Zona comercial a las afueras de Ciudad Rodrigo. Muy tranquila. El lugar esta justo a lado de un Supermercado Lupa."
    },
    {
	nombre:"Furadouro",
	lat:40.876186,  
	lon:-8.673841,
	creado:"8/14",
	img:"img/furadouro.jpg",
	href:"",
	desc: "Aparcamiento de asfalto junto a la ciudad. Casi en primera línea de playa. Cerca de bares y restaurantes. Con duchas y agua gratis a cincuenta metros."
    },
    {
	nombre:"Sao Jacinto",
	lat:40.668730,
	lon: -8.742411,
	creado:"8/14",
	img:"img/sao-jacinto.jpg",
	href:"",
	desc: "Aparcamiento de asfalto un poco apartado del pueblo. Tiene un chiringuito, duchas y grifo de agua gratis pero el supermercado y el resto de cosas pillan un poco lejos."
    },
    {
	nombre:"Praia de Cortegaça",
	lat:40.940603, 
	lon: -8.657185,
	creado:"8/14",
	img:"img/cortegasa.jpg",
	href:"",
	desc: "Una pequeña calle paralela a la playa y junto al camping. En la playa, a unos 100 metros hay duchas exteriores e interiores junto al bar con monedas. No hay grifo de agua por ningún lado. Calle tranquila y sin jaleo."
    },
    {
	nombre:"Camping Angreiras",
	lat:41.267090,
	lon:  -8.719885,
	creado:"8/14",
	img:"img/camping-angreiras.jpg",
	href:"",
	desc: "Caro y muy normalito. Entrada y viales muy angostos y asfaltados con adoquines. Lejos de la playa."
    },
    {
	nombre:"Mindelo",
	lat:41.312291, 
	lon: -8.739284,
	creado:"8/14",
	img:"img/mindelo.jpg",
	href:"",
	desc: "Parking de asfalto con duchas cubiertas pero de pago. Como Furadouro cerca de la ciudad y de los restaurantes y supermercados aunque más pequeño que este."
    },
    {
	nombre:"Carreço",
	lat:41.739641, 
	lon: -8.874674,
	creado:"8/14",
	img:"img/carreso.jpg",
	href:"",
	desc: "Parking de adoquinado junto a la playa. Muy solitario y tranquilo. Sin agua, ni duchas ni bares cerca. El pueblo esta como a unos 2 kilómetros. En Viana do castelo, a unos 5 kilómetros, hay hipermercados."
    },
    {
	nombre:"Vila Praia do Ançora",
	lat: 41.817589, 
	lon: -8.870506,
	creado:"8/14",
	img:"img/vila-praia-ancora.jpg",
	href:"",
	desc: "Parking de asfalto junto a una zona de rocas apta para el baño. Del paseo de la playa y la zona de chiringuitos está como a unos 5 minutos andando. En este pueblo hay área de autocaravanas donde cambiar aguas"
    },
    {
	nombre:"Moledo",
	lat: 41.849918, 
	lon: -8.865788,
	creado:"8/14",
	img:"img/moledo.jpg",
	href:"",
	desc: "Calle residencial algo ruidosa y estrecha. El pueblo no vale mucho la pena. La playa es tranquila y muy bonita. En vila nova de Cerveira hay otro área de autocaravanas donde cambiar aguas."
    },
    {
	nombre:"Allariz",
	lat: 42.193352, 
	lon: -7.803507,
	creado:"8/14",
	img:"img/allariz.jpg",
	href:"",
	desc: "Calle junto al rio. Muy tranquila y cerca del centro. Junto a las piscinas. No hay agua ni zona de carga pero hay un camping en el propio municipio."
    },
    {
	nombre:"Aranda de Duero",
	lat: 41.668331,
	lon:-3.695754,
	creado:"8/14",
	img:"img/aranda-de-duero.jpg",
	href:"",
	desc: "Parking de autocaravanas con servicio de cambio de aguas gratituito. Cerca del centro urbano"
    },
    {
	nombre:"Covarrubias",
	lat: 42.055970,
	lon: -3.518304,
	creado:"8/14",
	img:"img/covarrubias.jpg",
	href:"",
	desc: "Merendero junto al rio. Muy fresco por las noches. No es muy grande y en verano por el día está lleno y resulta masificado"
    },
    {
	nombre:"Merendero de Revenga",
	lat: 41.958057, 
	lon: -3.013225,
	creado:"8/14",
	img:"img/revenga.jpg",
	href:"",
	desc: "Merendero en una zona boscosa y fresca cerca de Revenga y Quintanar de la Sierra. Muy tranquilo sobre todo al caer la tarde"
    },
    {
	nombre:"Playa Pita",
	lat: 41.853193, 
	lon: -2.787096,
	creado:"8/14",
	img:"img/playa-pita.jpg",
	href:"",
	desc: "Aparcamiento junto al embalse y los chiringuitos. De asfalto y muy tranquilo por la noche. Algo inclinado"
    },
    {
	nombre:"El Burgo de Osma",
	lat: 41.586734, 
	lon: -3.073124,
	creado:"8/14",
	img:"img/burgo-de-osma.jpg",
	href:"",
	desc: "Aparcamiento urbano junto a la catedral y el rio. Asfalto y llano. Zona tranquila aunque muy cerca del centro."
    },
    {
	nombre:"El Saler",
	lat: 39.386649,
	lon: -0.331892,
	creado:"2/15",
	img:"img/valencia-el-saler.jpg",
	href:"http://www.123miweb.es/CAMPING-CAR/",
	desc: "Área privada de autocaravanas. Sin sombras. De suelo de grava. El pueblo está a cinco minutos y la parada de autobús de valencia justo en la puerta. 11 € la noche. (Tel. 696 510 897 Email: campingcarlamarina2011@hotmail.com)"
    },
    {
	nombre:"Barra",
	lat: 40.641924,
	lon: -8.747657,
	creado:"4/15",
	img:"img/praia-barra.jpg",
	href:"",
	desc: "Zona urbana pero tranquila por lo menos en semana santa. Para el agua es necesario retroceder por la autovia en dirección a Aveiro, en este barrio no hay gasolineras"
    },
    {
	nombre:"Maceda",
	lat: 40.920589,
	lon:  -8.660809,
	creado:"4/15",
	img:"img/praia-maceda.jpg",
	href:"",
	desc: "Paraje alejado de zonas urbanas, con merenderos de mesas y mucho arbolado aunque sin aguas ni servicios cerca. El parking es de grava y arena aunque no hay peligro de embarrancar."
    },
    {
	nombre:"Praia de Vagueira",
	lat: 40.565062, 
	lon:  -8.766929,
	creado:"4/15",
	img:"img/praia-vagueira.jpg",
	href:"",
	desc: "Parking de autocaravanas en zona urbana similar a Furaoduro. Es un barrio de apartamentos sin muchos servicios pero con bares y restaurantes. Existe un área de autoracaravas con servicio de aguas pagando 2,50 € en las cercanias, en dirección a Mira"
    },
    {
	nombre:"Ávila",
	lat: 40.661313,
	lon:  -4.705227,
	creado:"4/15",
	img:"img/avila.jpg",
	href:"",
	desc: "Parking de autobuses junto a la muralla. Con cientos de plazas. No tiene servicios y está algo inclinado aunque es de asfalto. Parece que suele estar muy solicitado"
    }
]

