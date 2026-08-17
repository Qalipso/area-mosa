/**
 * AREA MOSA — чат-виджет записи.
 * Встраивание:  <script src="https://ваш-домен/widget.js" data-api="https://ваш-домен"></script>
 * Всё живёт в Shadow DOM, так что стили сайта-хоста не конфликтуют.
 */
(function () {
  const script = document.currentScript;
  const API = (script?.dataset.api || new URL('.', script.src).origin).replace(/\/$/, '');
  // Код бизнеса: из data-tenant, либо из ?tenant= в адресе страницы (удобно для демо).
  const TENANT = script?.dataset.tenant
    || new URLSearchParams(location.search).get('tenant') || '';
  const withTenant = (path) => (TENANT
    ? path + (path.includes('?') ? '&' : '?') + 'tenant=' + encodeURIComponent(TENANT)
    : path);

  // ---- языки --------------------------------------------------------------
  // Виджет говорит на языке страницы, а после первого сообщения — на языке клиента.
  const DICT = {
    ru: {
      fabLabel: 'Записаться онлайн', closeLabel: 'Закрыть окно записи',
      answerPh: 'Введите ответ…', answerLabel: 'Ваш ответ', sendLabel: 'Отправить',
      status: 'Онлайн-запись', sub: 'Подберём услугу, мастера и удобное время',
      subChat: 'Спросите про услуги, цены и время — или просто запишитесь',
      tip: 'Записаться онлайн ✦', hours: '{days} {from}–{to}',
      dayShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      apiDown: 'Сервис записи недоступен',
      offline: 'Не могу связаться с сервисом записи. Напишите нам в WhatsApp 🙏',
      greeting: 'Здравствуйте! Я помогу записаться в {salon}.\nЧто вас интересует?',
      greetingChat: 'Здравствуйте! Я администратор {salon}.\nНапишите, что хотите сделать — подберу время и запишу.',
      chatHint: 'Можно начать с услуги или написать своими словами',
      wantService: 'Хочу записаться: {title}', fromList: 'Выбрать из списка',
      msgPh: 'Ваше сообщение…', writeWa: 'Написать в WhatsApp',
      guidedStart: 'Хорошо, выберем по шагам.',
      pickService: 'Выберите услугу', pickMaster: 'Выберите мастера',
      noMasters: 'На эту услугу сейчас нет свободных мастеров. Напишите в WhatsApp — подберём вариант.',
      whichMaster: '«{title}» — {price}.\nК кому записать?', minutes: '{n} мин',
      serviceItem: '{title} · {n} мин', slotHint: '{date} · {n} мин',
      noDays: 'У мастера нет рабочих дней в ближайшие две недели.',
      whichDay: 'На какой день?', nearestDates: 'Ближайшие даты',
      noSlots: 'На этот день свободных окон нет. Выберем другой?', otherDate: '← Другая дата',
      freeAt: 'Свободное время у {master}:',
      askName: 'Как вас зовут?', namePh: 'Ваше имя',
      askPhone: 'Телефон или WhatsApp для связи?', phonePh: '+598 ...',
      badPhone: 'Похоже, номер неполный. Проверьте, пожалуйста.',
      askComment: 'Есть пожелания к мастеру? Можно пропустить.', commentPh: 'Комментарий', skip: 'Пропустить',
      askConsent: 'Прислать подтверждение и напоминание о записи в WhatsApp?',
      yesNotify: 'Да, присылайте', noNotify: 'Не нужно',
      summary: 'Проверьте запись:\n\n{service} · {duration}\nМастер: {master}\nКогда: {date}, {time}\nИмя: {name}\nТелефон: {phone}',
      summaryComment: '\nКомментарий: {comment}',
      summaryNotify: '\nНапоминания: {value}', notifyOn: 'в WhatsApp', notifyOff: 'не присылать',
      confirmBtn: '✓ Подтвердить', restart: 'Начать заново',
      booked: 'Вы записаны', bookedNote: 'Событие добавлено в календарь мастера. До встречи!',
      bookedNoteLocal: 'Записали вас. Администратор подтвердит визит — до встречи!',
      sending: 'Отправляю запись…', bookAgain: 'Записаться ещё раз', otherTime: 'Выбрать другое время',
    },
    es: {
      fabLabel: 'Reservar en línea', closeLabel: 'Cerrar la ventana de reserva',
      answerPh: 'Escriba su respuesta…', answerLabel: 'Su respuesta', sendLabel: 'Enviar',
      status: 'Reserva en línea', sub: 'Elegimos servicio, profesional y horario',
      subChat: 'Pregunte por servicios, precios y horarios — o reserve directamente',
      tip: 'Reservar en línea ✦', hours: '{days} {from}–{to}',
      dayShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      apiDown: 'El servicio de reservas no está disponible',
      offline: 'No puedo conectar con el servicio de reservas. Escríbanos por WhatsApp 🙏',
      greeting: '¡Hola! Le ayudo a reservar en {salon}.\n¿Qué le interesa?',
      greetingChat: '¡Hola! Soy el asistente de {salon}.\nEscriba qué necesita — busco el horario y le reservo.',
      chatHint: 'Empiece por un servicio o escríbalo con sus palabras',
      wantService: 'Quiero reservar: {title}', fromList: 'Elegir de la lista',
      msgPh: 'Su mensaje…', writeWa: 'Escribir por WhatsApp',
      guidedStart: 'Perfecto, vamos paso a paso.',
      pickService: 'Elija el servicio', pickMaster: 'Elija al profesional',
      noMasters: 'Ahora no hay profesionales libres para este servicio. Escríbanos por WhatsApp.',
      whichMaster: '«{title}» — {price}.\n¿Con quién le reservo?', minutes: '{n} min',
      serviceItem: '{title} · {n} min', slotHint: '{date} · {n} min',
      noDays: 'El profesional no tiene días laborables en las próximas dos semanas.',
      whichDay: '¿Qué día le viene bien?', nearestDates: 'Próximas fechas',
      noSlots: 'Ese día no queda ningún hueco. ¿Probamos otro?', otherDate: '← Otra fecha',
      freeAt: 'Horarios libres de {master}:',
      askName: '¿Cómo se llama?', namePh: 'Su nombre',
      askPhone: '¿Teléfono o WhatsApp de contacto?', phonePh: '+598 ...',
      badPhone: 'El número parece incompleto. Revíselo, por favor.',
      askComment: '¿Alguna preferencia? Puede omitirlo.', commentPh: 'Comentario', skip: 'Omitir',
      askConsent: '¿Le enviamos la confirmación y el recordatorio por WhatsApp?',
      yesNotify: 'Sí, envíenmelo', noNotify: 'No hace falta',
      summary: 'Revise la reserva:\n\n{service} · {duration}\nProfesional: {master}\nCuándo: {date}, {time}\nNombre: {name}\nTeléfono: {phone}',
      summaryComment: '\nComentario: {comment}',
      summaryNotify: '\nRecordatorios: {value}', notifyOn: 'por WhatsApp', notifyOff: 'no enviar',
      confirmBtn: '✓ Confirmar', restart: 'Empezar de nuevo',
      booked: 'Reserva confirmada', bookedNote: 'El evento se añadió al calendario. ¡Hasta pronto!',
      bookedNoteLocal: 'Reserva registrada. El administrador la confirmará. ¡Hasta pronto!',
      sending: 'Enviando la reserva…', bookAgain: 'Reservar otra vez', otherTime: 'Elegir otro horario',
    },
    en: {
      fabLabel: 'Book online', closeLabel: 'Close the booking window',
      answerPh: 'Type your answer…', answerLabel: 'Your answer', sendLabel: 'Send',
      status: 'Online booking', sub: 'We will pick the service, specialist and time',
      subChat: 'Ask about services, prices and times — or just book',
      tip: 'Book online ✦', hours: '{days} {from}–{to}',
      dayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      apiDown: 'The booking service is unavailable',
      offline: 'I cannot reach the booking service. Please message us on WhatsApp 🙏',
      greeting: 'Hello! I will help you book at {salon}.\nWhat are you interested in?',
      greetingChat: 'Hello! I am the {salon} assistant.\nTell me what you need — I will find a time and book it.',
      chatHint: 'Start with a service or just write in your own words',
      wantService: 'I would like to book: {title}', fromList: 'Choose from the list',
      msgPh: 'Your message…', writeWa: 'Message on WhatsApp',
      guidedStart: 'Sure, let us go step by step.',
      pickService: 'Choose a service', pickMaster: 'Choose a specialist',
      noMasters: 'No specialist is available for this service right now. Please write to us on WhatsApp.',
      whichMaster: '“{title}” — {price}.\nWho should I book you with?', minutes: '{n} min',
      serviceItem: '{title} · {n} min', slotHint: '{date} · {n} min',
      noDays: 'This specialist has no working days in the next two weeks.',
      whichDay: 'Which day works for you?', nearestDates: 'Nearest dates',
      noSlots: 'No free slots that day. Shall we try another?', otherDate: '← Another date',
      freeAt: 'Free times with {master}:',
      askName: 'What is your name?', namePh: 'Your name',
      askPhone: 'Phone or WhatsApp to reach you?', phonePh: '+598 ...',
      badPhone: 'That number looks incomplete. Please check it.',
      askComment: 'Any preferences? You can skip this.', commentPh: 'Comment', skip: 'Skip',
      askConsent: 'Send the confirmation and a reminder on WhatsApp?',
      yesNotify: 'Yes, please', noNotify: 'No need',
      summary: 'Please check the booking:\n\n{service} · {duration}\nSpecialist: {master}\nWhen: {date}, {time}\nName: {name}\nPhone: {phone}',
      summaryComment: '\nComment: {comment}',
      summaryNotify: '\nReminders: {value}', notifyOn: 'on WhatsApp', notifyOff: 'do not send',
      confirmBtn: '✓ Confirm', restart: 'Start over',
      booked: 'You are booked', bookedNote: 'The event was added to the calendar. See you soon!',
      bookedNoteLocal: 'Your booking is saved. The manager will confirm it — see you soon!',
      sending: 'Sending the booking…', bookAgain: 'Book again', otherTime: 'Pick another time',
    },
  };

  const SUPPORTED = Object.keys(DICT);
  const normLang = (raw) => {
    const code = String(raw || '').trim().toLowerCase().slice(0, 2);
    return SUPPORTED.includes(code) ? code : null;
  };
  const siteLang = () => normLang(document.documentElement.getAttribute('lang'))
    || normLang(document.documentElement.getAttribute('xml:lang'));

  let lang = normLang(script?.dataset.lang) || siteLang() || normLang(navigator.language) || 'ru';
  // Пока клиент не написал сам, язык следует за языком страницы.
  let langPinned = Boolean(normLang(script?.dataset.lang));

  const t = (key, vars) => String((DICT[lang] || DICT.ru)[key] ?? DICT.ru[key] ?? key)
    .replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ''));

  /** Язык текста клиента: кириллица → ru, испанские приметы → es, иначе en. */
  function detectLang(text) {
    const s = String(text || '');
    if (/[а-яё]/i.test(s)) return 'ru';
    if (/[áéíóúñ¿¡]/i.test(s)) return 'es';
    const es = /\b(hola|quiero|quisiera|cita|turno|reserva|reservar|corte|color|gracias|por favor|cuanto|cuánto|precio|hoy|mañana|tarde|para)\b/i;
    const en = /\b(hi|hello|i|want|would|like|book|booking|appointment|haircut|price|today|tomorrow|please|thanks)\b/i;
    if (es.test(s)) return 'es';
    if (en.test(s)) return 'en';
    return null;
  }

  /** Подпись рабочих дней: «Пн–Сб» для непрерывной недели, иначе перечислением.
      Салон с выходным не должен читаться в подвале как работающий все семь дней. */
  function workDaysLabel(days) {
    const names = DICT[lang]?.dayShort ?? DICT.ru.dayShort;
    const week = [1, 2, 3, 4, 5, 6, 0];               // неделя начинается с понедельника
    const open = Array.isArray(days) && days.length ? week.filter((d) => days.includes(d)) : week;
    if (!open.length) return '';
    const contiguous = open.every((d, i) => i === 0 || week.indexOf(d) === week.indexOf(open[i - 1]) + 1);
    if (open.length === 1) return names[open[0]];
    return contiguous
      ? `${names[open[0]]}–${names[open[open.length - 1]]}`
      : open.map((d) => names[d]).join(', ');
  }

  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <div class="dock">
      <div class="bubble" role="status" aria-live="polite"></div>
      <button class="fab" aria-expanded="false" aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 20l1.1-4.6A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>
        </svg>
      </button>
    </div>
    <section class="panel" role="dialog" tabindex="-1" aria-labelledby="am-title" aria-describedby="am-sub">
      <header>
        <div class="avatar" aria-hidden="true">A</div>
        <div class="ttl">
          <h3 id="am-title">AREA MOSA</h3>
          <div class="status"><span class="dot" aria-hidden="true"></span><span class="status-text"></span></div>
          <div class="sub" id="am-sub"></div>
        </div>
        <button class="close">✕</button>
      </header>
      <div class="log" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <div class="choices"></div>
      <form autocomplete="off"><input type="text"><button type="submit">→</button></form>
      <footer><span class="hours"></span><a href="#" class="wa" target="_blank" rel="noopener">WhatsApp</a></footer>
    </section>`;

  // Стили отдельным файлом с того же домена, что и сам виджет: строгий CSP сайта
  // (style-src без 'unsafe-inline') блокирует инлайновый <style> и replaceSync.
  // Адрес считается от самого widget.js, а не от API: сайт с CSP `style-src 'self'`
  // кладёт виджет рядом с собой, а к API обращается только через connect-src.
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = new URL('widget.css', script.src).href;
  root.insertBefore(sheet, root.firstChild);

  const $ = (s) => root.querySelector(s);
  const fab = $('.fab'), panel = $('.panel'), log = $('.log'), choices = $('.choices'),
        form = $('form'), input = $('form input'), bubble = $('.bubble'), dock = $('.dock');

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => calm.matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

  let cfg = null;
  const draft = {};
  let step = 'idle';
  let conversationId = null;
  let chatMode = false;

  /** Переводит статичные части интерфейса. Уже показанные сообщения не переписываем. */
  function applyLang() {
    panel.setAttribute('lang', lang);
    fab.setAttribute('aria-label', t('fabLabel'));
    $('.close').setAttribute('aria-label', t('closeLabel'));
    $('.status-text').textContent = t('status');
    $('#am-sub').textContent = chatMode ? t('subChat') : (cfg?.salon?.tagline || t('sub'));
    input.setAttribute('aria-label', t('answerLabel'));
    form.querySelector('button').setAttribute('aria-label', t('sendLabel'));
    input.placeholder = t(phKey);
    const hours = cfg?.salon?.workHours;
    $('.hours').textContent = hours
      ? t('hours', { days: workDaysLabel(cfg?.salon?.workDays), from: hours.start, to: hours.end })
      : '';
    if (bubble.classList.contains('on')) bubble.textContent = t('tip');
    rerender();
  }

  function setLang(next, { pin = false } = {}) {
    if (pin) langPinned = true;
    if (!next || next === lang) return false;
    lang = next;
    applyLang();
    // Названия услуг и подпись выбранного дня живут на сервере — забираем на новом языке.
    reloadCatalog();
    if (draft.date) relabelDate().then(rerender);
    return true;
  }

  // Язык страницы может меняться переключателем сайта — следим за <html lang>.
  new MutationObserver(() => {
    if (langPinned) return;
    setLang(siteLang());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'xml:lang'] });

  /** Перезабирает каталог на текущем языке. Кнопки услуг, если они на экране,
      перерисовываются: незачем показывать испанцу русские названия до перезапуска. */
  async function reloadCatalog() {
    if (!cfg) return;
    const want = lang;
    try {
      const fresh = await api(`/api/config?lang=${want}`);
      if (want !== lang) return;          // язык успел смениться снова — ответ уже неактуален
      cfg = fresh;
      // Список услуг на экране — перерисовываем его новыми названиями.
      if (lastChoices?.hint?.k === 'pickService') askService();
    } catch { /* каталог остаётся прежним — язык интерфейса уже переключился */ }
  }

  /** Первое сообщение клиента фиксирует язык диалога. */
  function adoptLang(text) {
    setLang(detectLang(text), { pin: true });
  }

  // Плавная прокрутка к новому сообщению: собственная анимация — надёжнее CSS smooth
  // и сама подстраивается, если контент дорисовался уже во время движения.
  let scrollTimer = 0;
  const scroll = () => {
    clearInterval(scrollTimer);
    const target = () => log.scrollHeight - log.clientHeight;
    if (reduced()) { log.scrollTop = target(); return; }
    const from = log.scrollTop;
    const t0 = Date.now();
    scrollTimer = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / 320);
      const e = 1 - Math.pow(1 - p, 3);
      log.scrollTop = from + (target() - from) * e;
      if (p >= 1) { clearInterval(scrollTimer); log.scrollTop = target(); }
    }, 16);
  };

  /**
   * spec — либо готовая строка (текст клиента, ответ модели), либо рецепт
   * { k: ключ словаря, v: переменные или функция, их возвращающая }.
   * Рецепт остаётся на элементе, поэтому при смене языка сообщение перерисовывается.
   */
  const render = (spec) => {
    if (typeof spec === 'string') return spec;
    if (spec.fn) return spec.fn();
    return t(spec.k, typeof spec.v === 'function' ? spec.v() : spec.v);
  };

  function say(spec, cls = 'bot') {
    const el = document.createElement('div');
    el.className = `msg ${cls}`;
    el.textContent = render(spec);
    if (typeof spec !== 'string') el.__i18n = spec;
    log.appendChild(el);
    scroll();
    return el;
  }

  async function botSay(spec, cls = 'bot') {
    const text = render(spec);
    const t0 = document.createElement('div');
    t0.className = 'typing';
    t0.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(t0);
    scroll();
    await wait(Math.min(750, 260 + text.length * 8));
    t0.remove();
    return say(spec, cls);
  }

  /** Перерисовывает всё, что уже показано: сообщения, карточки и кнопки. */
  function rerender() {
    [...log.children].forEach((el) => {
      if (el.__dateEcho) { el.textContent = draft.dateLabel || el.textContent; return; }
      if (!el.__i18n) return;
      if (el.classList.contains('card-ok')) {
        el.querySelector('b').textContent = t('booked');
        el.querySelector('span').textContent = successText(el.__i18n.summary);
      } else {
        el.textContent = render(el.__i18n);
      }
    });
    if (lastChoices) setChoices(lastChoices.items, lastChoices.hint, { keepSelection: true });
  }

  const TICK = '<svg class="tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 8.6 6.2 12.3 13.5 4"/></svg>';

  let lastChoices = null;

  function setChoices(items, hint, opts = {}) {
    lastChoices = items.length ? { items, hint } : null;
    choices.innerHTML = '';
    if (hint) {
      const h = document.createElement('div');
      h.className = 'hint';
      h.textContent = render(hint);
      choices.appendChild(h);
    }
    items.forEach((it, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span></span>${TICK}`;
      b.querySelector('span').textContent = render(it.label);
      if (it.kind) b.className = it.kind;
      if (!reduced()) b.style.animationDelay = `${(hint ? i + 1 : i) * 55}ms`;
      // «Подтвердить» плавно оживает после того, как сводка дочитана.
      if (it.pending) {
        b.disabled = !opts.keepSelection;
        if (!opts.keepSelection) {
          setTimeout(() => { b.disabled = false; b.classList.remove('pending'); b.classList.add('primary'); }, reduced() ? 0 : 480);
        } else {
          b.classList.remove('pending'); b.classList.add('primary');
        }
      }
      b.addEventListener('click', async () => {
        if (b.disabled) return;
        [...choices.querySelectorAll('button')].forEach((x) => { x.disabled = true; });
        b.classList.add('selected');
        await wait(240);
        choices.innerHTML = '';
        lastChoices = null;
        it.onClick();
      });
      choices.appendChild(b);
    });
    scroll();
  }

  let phKey = 'answerPh';   // ключ текущего плейсхолдера — чтобы пережить смену языка

  function askText(key, next) {
    choices.innerHTML = '';
    form.classList.add('on');
    phKey = key;
    input.placeholder = t(key);
    input.value = '';
    input.focus();
    step = next;
  }

  const hideForm = () => { form.classList.remove('on'); step = 'idle'; };

  applyLang();

  const api = async (path, opts) => {
    const res = await fetch(API + withTenant(path), opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.detail?.error || data.detail || t('apiDown'));
    return data;
  };

  // ---- сценарий ----------------------------------------------------------

  async function start() {
    log.innerHTML = '';
    choices.innerHTML = '';
    hideForm();
    Object.keys(draft).forEach((k) => delete draft[k]);
    conversationId = null;
    try {
      if (!cfg) cfg = await api(`/api/config?lang=${lang}`);
    } catch (e) {
      return say({ k: 'offline' }, 'err');
    }
    // Название, инициал и подпись — из настроек бизнеса: один виджет обслуживает разные салоны.
    $('#am-title').textContent = cfg.salon.name || t('status');
    $('.avatar').textContent = (cfg.salon.name || 'A').trim().charAt(0).toUpperCase();
    applyLang();
    const wa = $('.wa');
    if (cfg.salon.whatsapp) wa.href = cfg.salon.whatsapp;
    else wa.style.display = 'none';

    if (cfg.aiEnabled) return startChat();

    await botSay({ k: 'greeting', v: () => ({ salon: cfg.salon.name }) });
    askService();
  }

  // ---- свободный диалог (AI включён) -------------------------------------

  async function startChat() {
    chatMode = true;
    $('.sub').textContent = t('subChat');
    await botSay({ k: 'greetingChat', v: () => ({ salon: cfg.salon.name }) });
    setChoices(
      [
        ...cfg.services.slice(0, 3).map((s) => ({
          label: s.title,
          onClick: () => sendChat(t('wantService', { title: s.title })),
        })),
        { label: { k: 'fromList' }, kind: 'ghost', onClick: startGuided },
      ],
      { k: 'chatHint' },
    );
    openInput();
  }

  /** Поле ввода в свободном диалоге доступно всегда, кроме момента ожидания ответа. */
  function openInput() {
    form.classList.add('on');
    phKey = 'msgPh';
    input.placeholder = t('msgPh');
    input.value = '';
    input.disabled = false;
    form.querySelector('button').disabled = false;
    step = 'chat';
    input.focus();
  }

  const lockInput = (on) => {
    input.disabled = on;
    form.querySelector('button').disabled = on;
    form.classList.toggle('busy', on);
  };

  /** Запасной путь: кнопочный сценарий, если клиенту так удобнее или чат недоступен. */
  async function startGuided() {
    choices.innerHTML = '';
    hideForm();
    chatMode = false;
    $('.sub').textContent = cfg?.salon?.tagline || t('sub');
    await botSay({ k: 'guidedStart' });
    askService();
  }

  async function sendChat(text) {
    if (step !== 'chat') return;
    choices.innerHTML = '';
    say(text, 'me');
    lockInput(true);
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(typing);
    scroll();
    try {
      const res = await api('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId, lang }),
      });
      conversationId = res.conversationId;
      typing.remove();
      if (res.text) say(res.text);
      if (res.booking) successCard({
        service: res.booking.service, master: res.booking.master,
        dateLabel: res.booking.date_label, time: res.booking.time, address: res.booking.address,
        inCalendar: Boolean(res.booking.html_link),
      });
      if (res.handoff) {
        setChoices([{ label: { k: 'writeWa' }, onClick: () => window.open(cfg.salon.whatsapp, '_blank') }]);
      }
      scroll();
    } catch (e) {
      typing.remove();
      say(e.message, 'err');
      setChoices([
        { label: { k: 'fromList' }, onClick: startGuided },
        { label: { k: 'writeWa' }, kind: 'ghost', onClick: () => window.open(cfg.salon.whatsapp, '_blank') },
      ]);
    }
    lockInput(false);
    input.focus();
  }

  function askService() {
    setChoices(
      cfg.services.map((s) => ({
        label: { k: 'serviceItem', v: { title: s.title, n: s.duration } },
        onClick: () => { draft.service = s; say(s.title, 'me'); askMaster(); },
      })),
      { k: 'pickService' },
    );
  }

  async function askMaster() {
    const list = cfg.masters.filter((m) => m.services.includes(draft.service.id));
    if (!list.length) {
      await botSay({ k: 'noMasters' }, 'err');
      return;
    }
    await botSay({
      k: 'whichMaster',
      v: () => ({
        title: draft.service.title,
        price: draft.service.price || t('minutes', { n: draft.service.duration }),
      }),
    });
    setChoices(
      list.map((m) => ({
        label: `${m.name} — ${m.role}`,
        onClick: () => { draft.master = m; say(m.name, 'me'); askDay(); },
      })),
      { k: 'pickMaster' },
    );
  }

  async function askDay() {
    let days;
    try {
      ({ days } = await api(`/api/days?masterId=${draft.master.id}&lang=${lang}`));
    } catch (e) { return say(e.message, 'err'); }
    if (!days.length) return botSay({ k: 'noDays' }, 'err');

    await botSay({ k: 'whichDay' });
    setChoices(
      days.map((d) => ({
        label: d.label,
        onClick: () => {
          draft.date = d.date; draft.dateLabel = d.label; draft.dateLang = lang;
          const echo = say(d.label, 'me');
          echo.__dateEcho = true;   // подпись дня зависит от языка — обновляем вместе с ним
          askSlot();
        },
      })),
      { k: 'nearestDates' },
    );
  }

  async function askSlot() {
    let slots;
    try {
      ({ slots } = await api(
        `/api/slots?masterId=${draft.master.id}&serviceId=${draft.service.id}&date=${draft.date}`,
      ));
    } catch (e) { return say(e.message, 'err'); }

    if (!slots.length) {
      await botSay({ k: 'noSlots' });
      return setChoices([{ label: { k: 'otherDate' }, kind: 'ghost', onClick: askDay }]);
    }
    await botSay({ k: 'freeAt', v: () => ({ master: draft.master.name }) });
    setChoices(
      [
        ...slots.map((s) => ({
          label: s.time,
          kind: 'slot',
          onClick: () => { draft.time = s.time; say(s.time, 'me'); askName(); },
        })),
        { label: { k: 'otherDate' }, kind: 'ghost', onClick: askDay },
      ],
      { k: 'slotHint', v: () => ({ date: draft.dateLabel, n: draft.service.duration }) },
    );
  }

  async function askName() {
    await botSay({ k: 'askName' });
    askText('namePh', 'name');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    adoptLang(value);

    // Свободный диалог: сообщение рисует sendChat. Сюда же уходит всё, что клиент
    // написал вне известного шага, — иначе текст просто повис бы в чате без ответа.
    if (step === 'chat' || (cfg?.aiEnabled && step === 'idle')) {
      input.value = '';
      step = 'chat';
      await sendChat(value);
      return;
    }

    say(value, 'me');
    input.value = '';

    if (step === 'name') {
      draft.name = value;
      hideForm();
      await botSay({ k: 'askPhone' });
      askText('phonePh', 'phone');
      return;
    }
    if (step === 'phone') {
      if (value.replace(/\D/g, '').length < 7) return botSay({ k: 'badPhone' }, 'err');
      draft.phone = value;
      hideForm();
      await botSay({ k: 'askComment' });
      form.classList.add('on');
      phKey = 'commentPh';
      input.placeholder = t('commentPh');
      step = 'comment';
      setChoices([{ label: { k: 'skip' }, kind: 'ghost', onClick: () => { draft.comment = ''; hideForm(); askConsent(); } }]);
      return;
    }
    if (step === 'comment') {
      draft.comment = value;
      hideForm();
      askConsent();
    }
  });

  /** Напоминания уходят только с явного согласия — без него канал не используется. */
  async function askConsent() {
    await botSay({ k: 'askConsent' });
    setChoices([
      { label: { k: 'yesNotify' }, onClick: () => { draft.notifyConsent = true; confirm(); } },
      { label: { k: 'noNotify' }, kind: 'ghost', onClick: () => { draft.notifyConsent = false; confirm(); } },
    ]);
  }

  async function confirm() {
    await relabelDate();
    await botSay({ fn: summaryText });
    setChoices([
      { label: { k: 'confirmBtn' }, kind: 'pending', pending: true, onClick: submit },
      { label: { k: 'restart' }, kind: 'ghost', onClick: start },
    ]);
  }

  /** Полный текст сводки и карточки успеха — собираются заново при смене языка. */
  function summaryText() {
    return t('summary', {
      service: draft.service.title, duration: t('minutes', { n: draft.service.duration }),
      master: draft.master.name, date: draft.dateLabel, time: draft.time,
      name: draft.name, phone: draft.phone,
    })
      + (draft.comment ? t('summaryComment', { comment: draft.comment }) : '')
      + t('summaryNotify', { value: draft.notifyConsent ? t('notifyOn') : t('notifyOff') });
  }

  // Про календарь пишем только когда событие туда действительно попало: в демо-режиме
  // backend возвращает htmlLink пустым, и обещать запись в календаре мастера нельзя.
  const successText = (s) =>
    `${s.service} · ${s.master}\n${s.dateLabel}, ${s.time}\n${s.address}\n\n`
    + t(s.inCalendar ? 'bookedNote' : 'bookedNoteLocal');

  /** Если язык сменился после выбора даты, берём подпись дня заново — уже на новом языке. */
  async function relabelDate() {
    if (!draft.date || draft.dateLang === lang) return;
    try {
      const { days } = await api(`/api/days?masterId=${draft.master.id}&lang=${lang}`);
      const found = days.find((d) => d.date === draft.date);
      if (found) { draft.dateLabel = found.label; draft.dateLang = lang; }
    } catch { /* подпись не критична — оставляем прежнюю */ }
  }

  /** Успех показываем только после ответа сервера — до этого время остаётся «в процессе». */
  function successCard(s) {
    const el = document.createElement('div');
    el.className = 'card-ok';
    el.innerHTML = `
      <svg viewBox="0 0 52 52" fill="none" stroke="#D97855" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="26" cy="26" r="23"/><path d="M15 27.5 22.5 35 37 18"/>
      </svg>
      <b></b><span></span>`;
    el.__i18n = { summary: s };
    el.querySelector('b').textContent = t('booked');
    el.querySelector('span').textContent = successText(s);
    log.appendChild(el);
    scroll();
  }

  async function submit() {
    const pend = document.createElement('div');
    pend.className = 'pending';
    pend.innerHTML = '<i></i><span></span>';
    pend.querySelector('span').textContent = t('sending');
    pend.__sending = true;
    log.appendChild(pend);
    scroll();
    try {
      const res = await api('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterId: draft.master.id,
          serviceId: draft.service.id,
          date: draft.date,
          time: draft.time,
          name: draft.name,
          phone: draft.phone,
          comment: draft.comment,
          notifyConsent: Boolean(draft.notifyConsent),
          lang,
        }),
      });
      pend.remove();
      successCard({ ...res.summary, inCalendar: Boolean(res.htmlLink) });
      setChoices([{ label: { k: 'bookAgain' }, kind: 'ghost', onClick: start }]);
    } catch (e) {
      pend.remove();
      say(e.message, 'err');
      setChoices([
        { label: { k: 'otherTime' }, onClick: askSlot },
        { label: { k: 'restart' }, kind: 'ghost', onClick: start },
      ]);
    }
  }

  // ---- подсказка у закрытой кнопки ---------------------------------------
  let tipTimer = null, tipSeen = false;

  function showTip() {
    if (tipSeen || panel.classList.contains('open') || reduced()) return;
    bubble.textContent = t('tip');
    bubble.classList.add('on');
    setTimeout(() => bubble.classList.remove('on'), 4000);
  }
  const hideTip = () => { bubble.classList.remove('on'); };

  // Первый показ через 1.5 с после загрузки, дальше не чаще раза в 18 с.
  if (!reduced()) {
    setTimeout(() => { showTip(); tipTimer = setInterval(showTip, 18000); }, 1500);
  }

  // ---- открытие/закрытие -------------------------------------------------
  let opener = null;   // элемент страницы, с которого открыли окно, — ему вернём фокус

  async function open() {
    // После первого открытия подсказка не возвращается.
    tipSeen = true;
    hideTip();
    if (tipTimer) { clearInterval(tipTimer); tipTimer = null; }
    panel.classList.add('open');
    dock.classList.add('hidden');   // на полноэкранном мобильном кнопка не должна лежать поверх диалога
    fab.setAttribute('aria-expanded', 'true');
    panel.focus({ preventScroll: true });
    if (!log.children.length) {
      await wait(180); // сначала показывается шапка, затем первое сообщение
      start();
    }
  }

  function close() {
    panel.classList.remove('open');
    dock.classList.remove('hidden');
    fab.setAttribute('aria-expanded', 'false');
    // Фокус возвращается тому, кто открыл окно: кнопке на странице, если она была.
    const back = opener && opener.isConnected ? opener : fab;
    opener = null;
    back.focus({ preventScroll: true });
  }

  fab.addEventListener('click', () => (panel.classList.contains('open') ? close() : open()));
  $('.close').addEventListener('click', close);
  bubble.addEventListener('click', open);
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('open')) { e.stopPropagation(); close(); }
  });

  // ---- запуск с самой страницы -------------------------------------------
  // Любой элемент с `data-area-mosa-open` открывает окно записи. Делегирование на
  // документе, а не обработчик на каждом узле: строгий CSP сайта запрещает inline-onclick,
  // а кнопка может появиться и после загрузки виджета.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest?.('[data-area-mosa-open]');
    if (!trigger) return;
    e.preventDefault();
    opener = trigger;
    if (!panel.classList.contains('open')) open();
  });

  window.AreaMosa = {
    open: () => { if (!panel.classList.contains('open')) open(); },
    close,
  };
})();
