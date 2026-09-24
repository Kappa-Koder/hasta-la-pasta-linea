// Unica fonte dei contenuti del sito. Ogni dato viene da ricerca/ticket-ricerca.md
// (letto il 24/09/2026). `tbc` = "por confirmar": dato mancante o in conflitto nel ticket.

export const BRAND = {
  nombre: 'Hasta la Pasta',
  lema: 'Sempre fresca',
  desde: 2020,
  claim: 'Sabor italiano, listo en minutos', // bio Instagram
  email: 'hastalapasta.es@gmail.com',
  telefonoGeneral: '+34 622 74 43 93',
  instagram: 'https://www.instagram.com/hastalapastaoficial/',
  instagramHandle: '@hastalapastaoficial',
  facebook: 'https://www.facebook.com/61572382390601/',
  fechaDatos: '24 de septiembre de 2026',
};

// Frasi pubblicate dal brand (feed Instagram, agosto-settembre 2026)
export const FRASES = {
  bio: 'Sabor italiano, listo en minutos',
  delivery: 'Tu pasta sin salir de casa',
  herencia: 'La pasta italiana no solo se come. Se hereda.',
  lejos: 'Hay sabores que vienen de lejos y siguen sintiéndose cerca.',
  terapia: 'La mejor terapia es una buena pasta',
  indecisos: 'Las primeras 2 que veas son las que vas a pedir',
};

// Carosello ufficiale del 12/09/2026
export const GIANFRANCO = {
  nombre: 'Gianfranco Rucco',
  cita: [
    'Es la materialización del sueño de poder compartir parte de la gastronomía italiana con la que crecí.',
    'Poder compartir con más personas platos que me llevan de vuelta a los momentos más felices de mi infancia, en la cocina de mis nonnos, es verdaderamente especial y significativo.',
  ],
  fuente: 'https://www.instagram.com/hastalapastaoficial/p/DdML2-fFU76/',
};

// Cartello del banco (foto banco-scelta-pasta.jpg) + extra dei menu Uber
export const RITUAL = [
  {
    paso: 'Coge tu pasta favorita',
    corto: 'Coge tu pasta',
    texto: 'Pasta fresca, sempre fresca. El formato lo eliges tú, en el mostrador.',
    tbc: 'Formatos disponibles por confirmar',
    img: 'pasta-fresca',
    alt: 'Manos levantando pasta fresca recién cortada junto a nidos de pasta',
  },
  {
    paso: 'Elige una salsa',
    corto: 'Elige una salsa',
    texto: 'Ocho recetas italianas: de la Cacio e Pepe a la Carbonara con guanciale.',
    img: 'pesto',
    alt: 'Primer plano de pasta al pesto con tomates cherry y queso rallado',
  },
  {
    paso: 'Añade extra toppings',
    corto: 'Añade extra',
    texto: 'Parmesano, pecorino, salsa de tomate y albahaca o aceite picante.',
    img: 'pomodorini',
    alt: 'Pasta con salsa de tomate, tomates cherry y mucho queso rallado',
  },
];

export const EXTRAS = ['Parmesano', 'Pecorino', 'Salsa de tomate y albahaca', 'Aceite picante'];

// Carta Instagram (highlight CARTA) + ingredienti dei menu delivery. Nessun prezzo.
export const PASTAS = [
  { id: 'pomodoro', nombre: 'Pomodoro & Basilico', ing: 'Salsa de tomate, aceite de albahaca y tomates cherry.', img: 'plato-pomodoro' },
  { id: 'genovese', nombre: 'Pesto alla Genovese', ing: 'Albahaca, almendras, parmesano, pecorino y tomates cherry.', aviso: 'Contiene almendras', img: 'plato-genovese' },
  { id: 'cacio', nombre: 'Cacio e Pepe', ing: 'Crema de pecorino y pimienta negra.', img: 'plato-cacio' },
  { id: 'amatriciana', nombre: 'Amatriciana', ing: 'Salsa de tomate, guanciale y pecorino.', img: 'plato-amatriciana' },
  { id: 'bolognese', nombre: 'Ragù alla Bolognese', ing: 'Carne picada, salsa de tomate y aceite de albahaca.', img: 'plato-bolognese' },
  { id: 'carbonara', nombre: 'Carbonara', ing: 'Guanciale, crema de huevo, queso y pimienta negra.', img: 'plato-carbonara' },
  { id: 'pollo-pesto', nombre: 'Pollo & Pesto', ing: 'Menta, almendras, alcaparras, queso de cabra y pollo.', aviso: 'Contiene almendras', img: 'plato-pollo-pesto' },
  { id: 'gricia', nombre: 'Gricia', ing: 'Crema de pecorino, pimienta negra y guanciale.', img: 'plato-gricia' },
];

// "Para los indecisos": ingredienti dichiarati -> piatti che li contengono (dalle descrizioni sopra)
export const FILTROS = [
  { id: 'guanciale', label: 'Guanciale', platos: ['amatriciana', 'carbonara', 'gricia'] },
  { id: 'tomate', label: 'Tomate', platos: ['pomodoro', 'genovese', 'amatriciana', 'bolognese'] },
  { id: 'pecorino', label: 'Pecorino', platos: ['genovese', 'cacio', 'amatriciana', 'gricia'] },
  { id: 'pimienta', label: 'Pimienta negra', platos: ['cacio', 'carbonara', 'gricia'] },
  { id: 'albahaca', label: 'Albahaca', platos: ['pomodoro', 'genovese', 'bolognese'] },
  { id: 'almendras', label: 'Almendras', platos: ['genovese', 'pollo-pesto'] },
];

export const PICAR = [
  { id: 'ravioli', nombre: 'Raviolis fritos', ing: '6 raviolis fritos de ricotta y espinacas. En Cabanyal: de trufa y Grana Padano.', img: 'plato-ravioli' },
  { id: 'fingers', nombre: 'Fingers de mozzarella', ing: '6 dedos de mozzarella fritos.', img: 'plato-fingers' },
];

export const POSTRE = { id: 'tiramisu', nombre: 'Tiramisù', ing: 'Nuestra versión del clásico italiano.', nota: 'Disponibilidad según sede', img: 'plato-tiramisu' };

export const ALERGENOS_TBC = 'Información completa de alérgenos por confirmar: pregunta en tienda antes de pedir.';

// Orari delle schede Maps (24/09/2026). Chiave: 0 = domenica ... 6 = sabato.
// Ogni fascia [apertura, chiusura] in "HH:MM"; "24:00" = mezzanotte.
export const SEDES = [
  {
    id: 'centro',
    ciudad: 'Valencia',
    zona: 'Centro',
    barrio: 'Ciutat Vella · junto a la Catedral',
    direccion: 'C/ del Pes de la Farina, 1',
    cp: '46003 València',
    telefono: '+34 640 62 98 79',
    maps: 'https://www.google.es/maps/place/?q=place_id:ChIJ00Qu8o2YYA0RTEsG-dHnrMw',
    google: { nota: '4,4', resenas: '1.837' },
    horario: {
      1: [],
      2: [['11:30', '23:30']], 3: [['11:30', '23:30']], 4: [['11:30', '23:30']],
      5: [['11:30', '23:30']], 6: [['11:30', '23:30']], 0: [['11:30', '23:30']],
    },
    horarioTbc: 'Horario por confirmar: en Instagram figura 11:30–22:30 de martes a viernes y 11:30–22:00 el fin de semana.',
    pedir: [
      { plataforma: 'Uber Eats', url: 'https://www.ubereats.com/es-en/store/hasta-la-pasta/xoyya2siU6y2eij32pE1Ug' },
      { plataforma: 'Glovo', url: 'https://glovoapp.com/es/es/valencia/stores/hasta-la-pasta-valencia' },
    ],
    img: 'plaza-valencia',
    color: 'red',
  },
  {
    id: 'cabanyal',
    ciudad: 'Valencia',
    zona: 'Cabanyal',
    nombreLocal: 'Pasta Bar',
    barrio: 'Poblats Marítims',
    direccion: 'C/ de Joan Mercader, 16',
    cp: '46011 València',
    telefono: '+34 640 62 98 79',
    telefonoTbc: 'Teléfono por confirmar: Uber Eats indica +34 658 45 13 55.',
    maps: 'https://www.google.com/maps/search/Hasta+La+Pasta+Joan+Mercader+16+Valencia',
    google: { nota: '4,1', resenas: '43' },
    horario: {
      1: [['17:00', '23:00']], 2: [['17:00', '23:00']], 3: [['13:00', '23:00']],
      4: [['13:00', '23:30']], 5: [['13:00', '24:00']], 6: [['13:00', '24:00']], 0: [['13:00', '23:00']],
    },
    pedir: [
      { plataforma: 'Uber Eats', url: 'https://www.ubereats.com/es-en/store/hasta-la-pasta-pasta-bar/aujUoOkSQreMSuj-cSyBWw' },
    ],
    especiales: [
      { nombre: 'Especial', ing: 'Crema de parmesano a la rueda, pimienta y guanciale.' },
      { nombre: 'Alfredo', ing: '', tbc: 'Receta por confirmar' },
      { nombre: 'Raviolis fritos de trufa', ing: 'Con trufa y Grana Padano.' },
    ],
    color: 'yellow',
  },
  {
    id: 'madrid',
    ciudad: 'Madrid',
    zona: 'Chamberí',
    barrio: 'Chamberí · Arapiles',
    direccion: 'C. de Galileo, 40',
    cp: '28015 Madrid',
    telefono: '+34 624 61 75 11',
    maps: 'https://www.google.com/maps/search/Hasta+La+Pasta+Galileo+40+Madrid',
    google: { nota: '4,7', resenas: '258' },
    horario: {
      1: [],
      2: [['13:00', '16:00'], ['18:30', '23:00']],
      3: [['13:00', '16:00'], ['18:00', '23:00']],
      4: [['13:00', '16:00'], ['18:00', '23:00']],
      5: [['12:30', '24:00']], 6: [['12:30', '24:00']], 0: [['12:30', '23:00']],
    },
    pedir: [
      { plataforma: 'Uber Eats', url: 'https://www.ubereats.com/es/store/hasta-la-pasta-madrid/6ZEW4FY3Vdu6boaDcuw0XA' },
    ],
    pedirTbc: 'Glovo Madrid: por confirmar',
    especiales: [
      { nombre: 'Insalata al porco tonnato', ing: 'Fusilli, lomo de cerdo a baja temperatura, rúcula y salsa tonnata.' },
      { nombre: 'Combo Hasta la Pasta', ing: 'Pasta y bebida.' },
    ],
    color: 'green',
  },
];

export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const PRENSA = {
  medio: 'Hortanoticias',
  fecha: '21 de mayo de 2026',
  texto: 'Festival Mamma Mia, Sapore d’Italia · Torrent, 28–31 de mayo',
  url: 'https://www.hortanoticias.com/torrent-acoge-el-festival-gastronomico-mamma-mia-sapore-ditalia-del-28-al-31-de-mayo/',
};

export const LEGAL_TBC = 'Razón social, aviso legal y política de privacidad por confirmar.';
