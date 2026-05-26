/**
 * Бриф на разработку сайта винодельни.
 * Скрипт создаёт готовую Google Form с 9 секциями.
 *
 * Запуск:
 *   1. https://script.google.com → New project
 *   2. Вставить этот код в Code.gs
 *   3. Выбрать функцию createWineryBriefForm и нажать Run
 *   4. Подтвердить запрос на доступ
 *   5. View → Logs — там будут ссылки на форму
 */
function createWineryBriefForm() {
  const form = FormApp.create('Бриф на разработку сайта винодельни');

  form.setDescription(
    'Спасибо, что выбрали нас для создания вашего сайта.\n' +
    'Эта форма поможет нам понять ваш бизнес, аудиторию и пожелания.\n' +
    'Заполнение займёт около 15–20 минут. Отвечайте свободно — нет «правильных» ответов, нам важно ваше видение.\n' +
    'Поля со звёздочкой (*) обязательные. Остальные — по желанию.'
  );

  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);

  // ---------- СЕКЦИЯ 1. Основная информация ----------
  form.addPageBreakItem()
    .setTitle('1. Основная информация')
    .setHelpText('Расскажите, кто вы и где находитесь.');

  form.addTextItem().setTitle('Название винодельни').setRequired(true);
  form.addTextItem().setTitle('Контактное лицо и должность').setRequired(true);
  form.addTextItem().setTitle('Email для связи').setRequired(true);
  form.addTextItem().setTitle('Телефон или WhatsApp').setRequired(false);
  form.addTextItem().setTitle('Где находится винодельня (страна, регион)').setRequired(true);
  form.addParagraphTextItem()
    .setTitle('Расскажите о винодельне в 2–3 предложениях: история, философия, что вас отличает')
    .setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('Сколько лет винодельне?')
    .setChoiceValues([
      'До 5 лет',
      '5–15 лет',
      '15–30 лет',
      'Более 30 лет',
      'Семейная, несколько поколений'
    ])
    .setRequired(false);

  // ---------- СЕКЦИЯ 2. Цели сайта ----------
  form.addPageBreakItem()
    .setTitle('2. Цели сайта')
    .setHelpText('Поможет понять, что для вас главное.');

  form.addCheckboxItem()
    .setTitle('Зачем вам нужен сайт?')
    .setHelpText('Можно выбрать несколько вариантов')
    .setChoiceValues([
      'Рассказать о винодельне и бренде',
      'Продавать вино онлайн',
      'Принимать брони на дегустации и туры',
      'Привлекать туристов',
      'Работать с импортёрами и дистрибьюторами',
      'Повысить узнаваемость',
      'Заменить устаревший сайт'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Главное действие, которое посетитель должен сделать на сайте')
    .setChoiceValues([
      'Забронировать дегустацию',
      'Купить вино',
      'Оставить заявку',
      'Связаться с нами',
      'Подписаться на новости',
      'Изучить ассортимент'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Есть ли сейчас сайт? Если да — укажите ссылку')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Что не нравится в текущем сайте? (если есть)')
    .setRequired(false);

  // ---------- СЕКЦИЯ 3. Аудитория ----------
  form.addPageBreakItem()
    .setTitle('3. Аудитория')
    .setHelpText('Для кого вы создаёте сайт.');

  form.addCheckboxItem()
    .setTitle('Кто ваши основные клиенты?')
    .setHelpText('Можно выбрать несколько вариантов')
    .setChoiceValues([
      'Туристы и гости региона',
      'Ценители вина и сомелье',
      'Рестораны и HoReCa',
      'Импортёры и дистрибьюторы',
      'Корпоративные клиенты (мероприятия)',
      'Местные жители',
      'Подарочный сегмент'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('На каких языках должен работать сайт?')
    .setChoiceValues([
      'Русский',
      'Испанский',
      'Английский',
      'Португальский',
      'Другой'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Опишите вашего идеального клиента в 1–2 предложениях (возраст, интересы, повод покупки)')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Откуда чаще приходят клиенты?')
    .setChoiceValues([
      'Местный рынок',
      'Туризм',
      'Онлайн-продажи',
      'Дистрибьюторы',
      'Сарафанное радио'
    ])
    .setRequired(false);

  // ---------- СЕКЦИЯ 4. Стиль и образ бренда ----------
  form.addPageBreakItem()
    .setTitle('4. Стиль и образ бренда')
    .setHelpText('Какие эмоции должен вызывать сайт.');

  form.addCheckboxItem()
    .setTitle('Как должен ощущаться сайт?')
    .setHelpText('Выберите 2–3 слова')
    .setChoiceValues([
      'Элегантный',
      'Минималистичный',
      'Тёплый и душевный',
      'Премиальный, дорогой',
      'Современный',
      'Традиционный, аутентичный',
      'Семейный',
      'Художественный',
      'Природный, экологичный'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Какие визуальные ассоциации вам близки?')
    .setChoiceValues([
      'Виноградники и природа',
      'Бочки и винный погреб',
      'Архитектура',
      'Семья и люди',
      'Бокалы и сервировка',
      'Земля и терруар',
      'Этикетки и бутылки'
    ])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Ссылки на 2–3 сайта, которые вам нравятся (необязательно из винной сферы)')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Что точно не должно быть на сайте по стилю или ощущению?')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Есть ли у вас фирменный стиль (логотип, цвета, шрифты)?')
    .setChoiceValues([
      'Да, всё есть',
      'Есть только логотип',
      'Есть, но устарел и хотим обновить',
      'Нет, нужна помощь'
    ])
    .setRequired(true);

  // ---------- СЕКЦИЯ 5. Структура сайта ----------
  form.addPageBreakItem()
    .setTitle('5. Структура сайта')
    .setHelpText('Какие страницы и блоки нужны.');

  form.addCheckboxItem()
    .setTitle('Какие страницы нужны на сайте?')
    .setChoiceValues([
      'Главная',
      'О винодельне',
      'Каталог вин',
      'Карточка вина',
      'Дегустации и туры',
      'Мероприятия',
      'Новости',
      'Блог',
      'Магазин',
      'Корзина',
      'Контакты',
      'Где купить',
      'Для дистрибьюторов',
      'FAQ'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Что обязательно должно быть видно на главной странице?')
    .setChoiceValues([
      'Красивое фото или видео виноградников',
      'Краткая история бренда',
      'Лучшие вина',
      'Кнопка «забронировать дегустацию»',
      'Кнопка «купить»',
      'Отзывы',
      'Награды и сертификаты',
      'Карта и адрес',
      'Соцсети',
      'Подписка на новости'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Дополнительные пожелания по структуре')
    .setRequired(false);

  // ---------- СЕКЦИЯ 6. Вина, дегустации и продукты ----------
  form.addPageBreakItem()
    .setTitle('6. Вина, дегустации и продукты')
    .setHelpText('О ваших винах и услугах.');

  form.addMultipleChoiceItem()
    .setTitle('Сколько примерно вин в ассортименте?')
    .setChoiceValues([
      'До 5',
      '6–15',
      '16–30',
      'Более 30'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Что должно быть в карточке вина?')
    .setChoiceValues([
      'Название',
      'Сорт винограда',
      'Год урожая',
      'Регион',
      'Описание вкуса',
      'Гастрономические сочетания',
      'Температура подачи',
      'Фото бутылки',
      'Награды',
      'Цена',
      'Кнопка «купить»',
      'Кнопка «заказать»',
      'Технический паспорт (PDF)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Какие форматы дегустаций и услуг вы предлагаете?')
    .setChoiceValues([
      'Дегустация в винодельне',
      'Экскурсия по виноградникам',
      'Дегустация с гастрономией',
      'Частные мероприятия',
      'Свадьбы и корпоративы',
      'Винные клубы',
      'Подарочные сертификаты',
      'Онлайн-дегустации'
    ])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Расскажите коротко об одном-двух предложениях, которые особенно важно показать на сайте')
    .setRequired(false);

  // ---------- СЕКЦИЯ 7. Функционал сайта ----------
  form.addPageBreakItem()
    .setTitle('7. Функционал сайта')
    .setHelpText('Что сайт должен уметь делать.');

  form.addCheckboxItem()
    .setTitle('Какой функционал нужен на сайте?')
    .setChoiceValues([
      'Форма заявки',
      'Бронирование дегустаций с календарём',
      'Кнопка WhatsApp',
      'Каталог вин с фильтрами',
      'Интернет-магазин',
      'Онлайн-оплата картой',
      'Google Maps',
      'Лента Instagram',
      'Мультиязычность',
      'Подписка на email-рассылку',
      'Админ-панель для редактирования',
      'SEO-оптимизация',
      'Возрастное подтверждение 18+',
      'Программа лояльности',
      'Отзывы клиентов'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Если планируется онлайн-продажа — куда отправляете заказы?')
    .setChoiceValues([
      'По всей стране',
      'Только локально',
      'Международная доставка',
      'Самовывоз',
      'Пока не решили'
    ])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('Какие способы оплаты должны быть?')
    .setChoiceValues([
      'Карта онлайн',
      'Банковский перевод',
      'Mercado Pago',
      'PayPal',
      'Оплата при получении',
      'Другое'
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Нужна ли интеграция с вашей CRM или учётной системой?')
    .setChoiceValues([
      'Да, есть система',
      'Нет',
      'Не знаю'
    ])
    .setRequired(false);

  // ---------- СЕКЦИЯ 8. Контент и материалы ----------
  form.addPageBreakItem()
    .setTitle('8. Контент и материалы')
    .setHelpText('Что уже готово, а что нужно создать.');

  form.addCheckboxItem()
    .setTitle('Что у вас уже готово?')
    .setChoiceValues([
      'Логотип',
      'Профессиональные фото винодельни',
      'Фото вин',
      'Видео',
      'Тексты о винодельне',
      'Описания вин',
      'Фото команды',
      'Карта виноградников',
      'Награды и сертификаты',
      'Ничего готового нет'
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Ссылка на папку с материалами (Google Drive, Dropbox и т.д.)')
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('Что нужно создать с нуля?')
    .setChoiceValues([
      'Тексты',
      'Фотосессия винодельни',
      'Фото вин',
      'Видео',
      'Логотип',
      'Иконки',
      'Описания вин',
      'Не уверен — обсудим'
    ])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('Ссылки на ваши соцсети')
    .setRequired(false);

  // ---------- СЕКЦИЯ 9. Сроки, бюджет и технические детали ----------
  form.addPageBreakItem()
    .setTitle('9. Сроки, бюджет и технические детали')
    .setHelpText('Финальный блок — почти готово!');

  form.addMultipleChoiceItem()
    .setTitle('Хотите ли самостоятельно редактировать сайт после запуска?')
    .setChoiceValues([
      'Да, обязательно',
      'Иногда — простые правки',
      'Нет, делайте вы'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Есть ли уже домен?')
    .setChoiceValues([
      'Да, есть',
      'Нет, нужно купить',
      'Не знаю, что это'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Когда хотите запустить сайт?')
    .setChoiceValues([
      'Срочно (до 1 месяца)',
      '1–2 месяца',
      '2–3 месяца',
      'Без жёсткого срока'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Ориентировочный бюджет на сайт')
    .setChoiceValues([
      'До $1 500',
      '$1 500–3 000',
      '$3 000–6 000',
      '$6 000–12 000',
      'Более $12 000',
      'Хочу услышать предложение'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Самый главный приоритет проекта')
    .setChoiceValues([
      'Красивый имиджевый сайт',
      'Продажи онлайн',
      'Бронирование туров и дегустаций',
      'Привлечение туристов',
      'B2B и дистрибьюторы',
      'Всё вместе'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Что-то ещё, что нам важно знать?')
    .setRequired(false);

  // ---------- Финал ----------
  form.setConfirmationMessage(
    'Спасибо! Мы получили ваш бриф и свяжемся с вами в течение 1–2 рабочих дней ' +
    'с предложением по структуре и стоимости сайта.'
  );

  Logger.log('Форма создана');
  Logger.log('Edit URL:      ' + form.getEditUrl());
  Logger.log('Published URL: ' + form.getPublishedUrl());
}
