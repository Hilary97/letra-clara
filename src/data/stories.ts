export type Level = 'inicial' | 'intermedio'

export interface Question {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  praise: string
  retry: string
}

export interface Story {
  id: string
  title: string
  emoji: string
  level: Level
  minutes: number
  ages: string
  summary: string
  tint: string
  paragraphs: string[]
  questions: Question[]
}

export const stories: Story[] = [
  {
    id: 'miga-en-el-techo',
    title: 'El gato del techo',
    emoji: '🐈',
    level: 'inicial',
    minutes: 2,
    ages: '6 a 8 años',
    summary: 'Miga duerme arriba, bien arriba. Un día desaparece y hay que buscarlo.',
    tint: '#f2c14e',
    paragraphs: [
      'Tomi tiene un gato que se llama Miga.',
      'Miga no duerme en una cama. Miga duerme en el techo, arriba de todo.',
      'Una tarde, Miga no estaba en el techo. Tomi lo buscó en la cocina, en el patio y en el ropero.',
      'Al final escuchó un ruido muy suave. Venía de la caja del pan. Miga estaba adentro, tapado con una servilleta.',
      'Tomi se rió fuerte. Ahora Miga tiene dos camas: el techo y la caja del pan.',
    ],
    questions: [
      {
        id: 'miga-nombre',
        prompt: '¿Cómo se llama el gato?',
        options: ['Tomi', 'Miga', 'Pancho'],
        correctIndex: 1,
        praise: '¡Sí! Miga es el gato de Tomi.',
        retry: 'Podés volver al primer renglón y leerlo otra vez. No hay apuro.',
      },
      {
        id: 'miga-lugar',
        prompt: '¿Dónde encontró Tomi a Miga?',
        options: ['En el ropero', 'En el techo', 'En la caja del pan'],
        correctIndex: 2,
        praise: '¡Muy bien! Estaba tapado con una servilleta.',
        retry: 'Leé el cuarto renglón: ahí dice de dónde venía el ruido suave.',
      },
    ],
  },
  {
    id: 'lola-y-el-semaforo',
    title: 'La tortuga y el semáforo',
    emoji: '🐢',
    level: 'inicial',
    minutes: 2,
    ages: '6 a 8 años',
    summary: 'Lola cruza despacio. Alguien le dice que no hace falta apurarse.',
    tint: '#8fc9a9',
    paragraphs: [
      'La tortuga Lola camina despacio. Muy despacio.',
      'Un día llega a una esquina con un semáforo. El semáforo tiene tres luces: rojo, amarillo y verde.',
      'Lola espera. La luz se pone verde, pero ella sigue mirando para los costados.',
      'Un chico le dice: —Podés pasar. No hay apuro. Yo te espero.',
      'Lola sonríe y cruza. Cuando llega a la otra vereda, la luz todavía está verde. A veces, ir despacio también llega a tiempo.',
    ],
    questions: [
      {
        id: 'lola-colores',
        prompt: '¿Qué colores tiene el semáforo?',
        options: ['Rojo, amarillo y verde', 'Azul y verde', 'Rojo y violeta'],
        correctIndex: 0,
        praise: '¡Eso! Son tres luces.',
        retry: 'Está en el segundo renglón. Leelo despacio.',
      },
      {
        id: 'lola-chico',
        prompt: '¿Qué le dice el chico a Lola?',
        options: ['Que corra rápido', 'Que no hay apuro', 'Que vuelva a su casa'],
        correctIndex: 1,
        praise: '¡Bien! Y Lola cruza tranquila.',
        retry: 'Buscá las palabras del chico en el cuarto renglón.',
      },
    ],
  },
  {
    id: 'pia-la-estrella',
    title: 'La estrella que no quería brillar',
    emoji: '⭐',
    level: 'inicial',
    minutes: 3,
    ages: '6 a 9 años',
    summary: 'Pía tiene miedo de molestar con su luz. Un nene le muestra que su brillo sirve.',
    tint: '#b7a6e8',
    paragraphs: [
      'En el cielo hay una estrella chiquita que se llama Pía.',
      'Pía no quiere brillar. Tiene miedo de molestar a las otras estrellas.',
      'Las estrellas grandes le dicen: —Brillá como quieras. No hay una sola forma de brillar.',
      'Pía prueba. Brilla un ratito, muy suave, como una luciérnaga. Después descansa.',
      'Un nene la mira desde la ventana de su cuarto y le sonríe. Pía entiende que su luz suave también sirve.',
    ],
    questions: [
      {
        id: 'pia-nombre',
        prompt: '¿Cómo se llama la estrella?',
        options: ['Luci', 'Pía', 'Luna'],
        correctIndex: 1,
        praise: '¡Sí! Pía, la estrella chiquita.',
        retry: 'Está en el primer renglón, al final.',
      },
      {
        id: 'pia-consejo',
        prompt: '¿Qué le dicen las estrellas grandes?',
        options: [
          'Que se apague para siempre',
          'Que brille como quiera',
          'Que se vaya a otra parte del cielo',
        ],
        correctIndex: 1,
        praise: '¡Muy bien! Cada uno brilla a su manera.',
        retry: 'Las palabras están entre guiones, en el tercer renglón.',
      },
    ],
  },
  {
    id: 'nico-y-el-mar',
    title: 'Nico y el ruido del mar',
    emoji: '🌊',
    level: 'intermedio',
    minutes: 3,
    ages: '8 a 11 años',
    summary: 'El mar hace mucho ruido. Nico tiene su propio plan para que no sea tan grande.',
    tint: '#7fc4d8',
    paragraphs: [
      'Nico va a la playa con su familia.',
      'Al principio el mar le gusta. Después el ruido se hace grande. Las gaviotas gritan y la gente habla fuerte.',
      'Nico se tapa las orejas y se sienta en la arena, lejos de las sombrillas.',
      'Su papá le alcanza sus auriculares. Nico escucha música bajita y respira hondo tres veces.',
      'Ahora el ruido no es tan grande. Nico camina hasta el agua y moja los pies.',
      'Antes de irse, junta tres caracoles para su caja de tesoros.',
    ],
    questions: [
      {
        id: 'nico-que-hace',
        prompt: '¿Qué hace Nico cuando el ruido se hace grande?',
        options: [
          'Se tapa las orejas y se sienta en la arena',
          'Se pone a gritar como las gaviotas',
          'Se mete al agua corriendo',
        ],
        correctIndex: 0,
        praise: '¡Eso! Primero se aleja un poco del ruido.',
        retry: 'Está en el tercer renglón del cuento.',
      },
      {
        id: 'nico-papa',
        prompt: '¿Qué le da su papá?',
        options: ['Una gorra', 'Auriculares', 'Un helado'],
        correctIndex: 1,
        praise: '¡Bien! Con música bajita el ruido se achica.',
        retry: 'Leé el cuarto renglón, donde aparece el papá.',
      },
    ],
  },
  {
    id: 'mandarinas-de-la-abuela',
    title: 'El secreto del árbol de mandarinas',
    emoji: '🍊',
    level: 'intermedio',
    minutes: 3,
    ages: '8 a 11 años',
    summary: 'La abuela riega poquito todos los días. Juana descubre que leer es parecido.',
    tint: '#f19a6b',
    paragraphs: [
      'En el fondo de la casa de la abuela hay un árbol de mandarinas.',
      'Juana y su primo Tomás quieren saber por qué el árbol da fruta tan dulce.',
      'La abuela les dice: —El secreto es que nadie lo apura. Lo regamos poquito, todos los días.',
      'Juana piensa que es como leer. Si lee un ratito cada día, cada vez entiende más.',
      'En verano llenan dos baldes. Algunas mandarinas son ácidas, pero casi todas son dulces.',
    ],
    questions: [
      {
        id: 'abuela-riego',
        prompt: '¿Cómo cuida la abuela el árbol?',
        options: [
          'Lo riega mucho una sola vez',
          'Lo riega poquito todos los días',
          'No lo riega nunca',
        ],
        correctIndex: 1,
        praise: '¡Muy bien! Poquito y todos los días.',
        retry: 'El secreto está en el tercer renglón, cuando habla la abuela.',
      },
      {
        id: 'abuela-balde',
        prompt: '¿Cuántos baldes llenan en verano?',
        options: ['Uno', 'Dos', 'Cinco'],
        correctIndex: 1,
        praise: '¡Sí! Dos baldes de mandarinas.',
        retry: 'Está en el último renglón del cuento.',
      },
    ],
  },
  {
    id: 'pan-de-nube',
    title: 'La receta del pan de nube',
    emoji: '🍞',
    level: 'intermedio',
    minutes: 4,
    ages: '9 a 12 años',
    summary: 'La receta es larga y Mateo se cansa. Un lápiz y un puntito cambian todo.',
    tint: '#e8b4c8',
    paragraphs: [
      'Mateo quiere hacer pan. Su tía le presta un cuaderno con tres recetas.',
      'La primera receta es muy larga. Mateo se cansa de leerla y cierra el cuaderno.',
      'Entonces busca un lápiz y hace una marca: pone un puntito al final de cada paso. Lee un paso, hace un paso.',
      'La harina vuela, la cocina queda blanca y la masa crece despacio.',
      'El pan sale un poco torcido, pero huele rico. Su tía dice: —Así se aprende: de a un paso por vez.',
    ],
    questions: [
      {
        id: 'mateo-puntito',
        prompt: '¿Qué hace Mateo para no cansarse?',
        options: [
          'Cambia de receta',
          'Pone un puntito al final de cada paso',
          'Lee todo de una sola vez',
        ],
        correctIndex: 1,
        praise: '¡Eso! Un paso por vez.',
        retry: 'Está en el tercer renglón, donde aparece el lápiz.',
      },
      {
        id: 'mateo-pan',
        prompt: '¿Cómo sale el pan?',
        options: ['Perfecto y derecho', 'Un poco torcido, pero rico', 'Quemado'],
        correctIndex: 1,
        praise: '¡Bien! Torcido también es un buen pan.',
        retry: 'Leé el último renglón del cuento.',
      },
    ],
  },
]

export function findStory(id: string): Story | undefined {
  return stories.find((story) => story.id === id)
}
