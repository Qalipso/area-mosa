/* AREA MOSA — Masters data file
   ============================================================
   Чтобы добавить настоящее фото мастера:
     1. Положи файл в images/masters/ с тем же именем (напр. artem.jpg)
     2. Плейсхолдер автоматически заменится на фото — больше ничего менять не нужно.

   Чтобы добавить примеры работ:
     1. Положи файлы в images/works/ (напр. artem-1.jpg, artem-2.jpg, artem-3.jpg)
     2. Аналогично — файлы уже подключены, просто замени плейсхолдер.

   photo:        Путь к фото мастера.
   works:        Массив из 3 путей к работам.
   name / role / desc / tags — на трёх языках: ru, es, en.
   ============================================================ */

var MASTERS_DATA = [
  {
    id:    'artem',
    photo: 'images/masters/artem.jpg',
    works: [
      'images/works/artem-1.jpg',
      'images/works/artem-2.jpg?v=2',
      'images/works/artem-3.jpg?v=2'
    ],
    name: {
      ru: 'Артём',
      es: 'Artem',
      en: 'Artem'
    },
    role: {
      ru: 'Мастер-стилист',
      es: 'Maestro estilista',
      en: 'Master Stylist'
    },
    desc: {
      ru: 'Авторские стрижки и окрашивание любой сложности. Создаёт уникальный образ для каждого клиента — с вниманием к деталям и характеру.',
      es: 'Cortes de autor y coloración de cualquier complejidad. Crea una imagen única para cada cliente con atención al detalle y al carácter.',
      en: 'Signature haircuts and coloring of any complexity. Creates a unique look for every client with attention to detail and character.'
    },
    tags: {
      ru: ['Стрижки', 'Окрашивание', 'Уход'],
      es: ['Cortes', 'Coloración', 'Cuidado'],
      en: ['Haircuts', 'Coloring', 'Care']
    }
  },

  {
    id:    'murat',
    photo: 'images/masters/Murat.jpg?v=2',
    works: [
      'images/works/Murat-1.jpg',
      'images/works/Murat-2.jpg',
      'images/works/Murat-3.jpg'
    ],
    name: {
      ru: 'Мурат',
      es: 'Murat',
      en: 'Murat'
    },
    role: {
      ru: 'Мастер-стилист',
      es: 'Maestro estilista',
      en: 'Master Stylist'
    },
    desc: {
      ru: 'Мастер с тонким чувством стиля и вниманием к деталям. Создаёт образы, которые подчёркивают индивидуальность каждого клиента.',
      es: 'Maestro con un fino sentido del estilo y atención al detalle. Crea looks que realzan la individualidad de cada cliente.',
      en: 'Master with a fine sense of style and attention to detail. Creates looks that highlight the individuality of each client.'
    },
    tags: {
      ru: ['Стрижки', 'Уход', 'Стиль'],
      es: ['Cortes', 'Cuidado', 'Estilo'],
      en: ['Haircuts', 'Care', 'Style']
    }
  }

  /* Добавить нового мастера — скопируй блок выше, измени id и данные */
];
