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
    photo: 'images/masters/artem.jpg?v=2',
    photoFit: 'contain',
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
    photoFit: 'contain',
    works: [
      'images/works/Murat-1.jpg',
      'images/works/Murat-2.jpg',
      'images/works/Murat-3.jpg'
    ],
    name: {
      ru: 'Марат',
      es: 'Marat',
      en: 'Marat'
    },
    role: {
      ru: 'Эксперт-колорист · парикмахер-универсал',
      es: 'Colorista experto · peluquero integral',
      en: 'Expert Colorist · All-round Hairdresser'
    },
    desc: {
      ru: 'Мужские и женские стрижки, окрашивание и тотал-блонд.',
      es: 'Cortes para hombre y mujer, coloración y rubio total.',
      en: 'Men’s and women’s haircuts, coloring and total blonde.'
    },
    tags: {
      ru: ['Стрижки', 'Окрашивание', 'Тотал-блонд'],
      es: ['Cortes', 'Coloración', 'Rubio total'],
      en: ['Haircuts', 'Coloring', 'Total blonde']
    },
    prices: [
      {
        service: { ru: 'Мужская стрижка', es: 'Corte masculino', en: 'Men’s haircut' },
        price: '$ 700'
      },
      {
        service: { ru: 'Женская стрижка', es: 'Corte femenino', en: 'Women’s haircut' },
        price: '$ 1.000'
      },
      {
        service: { ru: 'Окрашивание', es: 'Coloración', en: 'Coloring' },
        note: { ru: 'от', es: 'desde', en: 'from' },
        price: '$ 1.600'
      },
      {
        service: { ru: 'Тотал-блонд', es: 'Rubio total', en: 'Total blonde' },
        note: { ru: 'от', es: 'desde', en: 'from' },
        price: '$ 3.000'
      }
    ]
  },

  {
    id:    'nacho',
    photo: 'images/masters/nacho.png?v=1',
    photoFit: 'contain',
    works: [
      'images/works/nacho-1.jpg?v=1',
      'images/works/nacho-2.jpg?v=1'
    ],
    name: {
      ru: 'Начо',
      es: 'Nacho',
      en: 'Nacho'
    },
    role: {
      ru: 'Стилист-парикмахер · колорист · барбер',
      es: 'Estilista · colorista · barbero',
      en: 'Hair Stylist · Colorist · Barber'
    },
    desc: {
      ru: 'Мужские и женские стрижки, оформление бороды и окрашивание.',
      es: 'Cortes para hombre y mujer, barba y coloración.',
      en: 'Men’s and women’s haircuts, beard grooming and coloring.'
    },
    tags: {
      ru: ['Стрижки', 'Борода', 'Окрашивание'],
      es: ['Cortes', 'Barba', 'Coloración'],
      en: ['Haircuts', 'Beard', 'Coloring']
    },
    frontPromo: {
      ru: '−20% на стрижки',
      es: '−20% en cortes',
      en: '−20% on haircuts'
    },
    prices: [
      {
        service: { ru: 'Мужская стрижка + борода', es: 'Corte masculino + barba', en: 'Men’s haircut + beard' },
        price: '$ 1.000',
        promo: { ru: 'Скидка 20%', es: '20% de descuento', en: '20% off' }
      },
      {
        service: { ru: 'Женская стрижка', es: 'Corte femenino', en: 'Women’s haircut' },
        note: { ru: 'Мытьё и укладка входят', es: 'Incluye lavado y peinado', en: 'Wash and styling included' },
        price: '$ 1.300',
        promo: { ru: 'Скидка 20%', es: '20% de descuento', en: '20% off' }
      },
      {
        service: { ru: 'Окрашивание · короткие волосы', es: 'Coloración · cabello corto', en: 'Coloring · short hair' },
        note: { ru: 'Остальное — по запросу', es: 'Otros largos: consultar', en: 'Other lengths: on request' },
        price: '$ 2.000'
      }
    ]
  }

  /* Добавить нового мастера — скопируй блок выше, измени id и данные */
];
