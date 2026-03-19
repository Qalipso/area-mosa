/* AREA MOSA — app.js v3 */

/* ============================================================
   i18n — TRANSLATIONS
   ============================================================ */
var T = {
  ru: {
    "meta.title": "AREA MOSA \u2014 \u041f\u0430\u0440\u0438\u043a\u043c\u0430\u0445\u0435\u0440\u0441\u043a\u0430\u044f, \u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e",
    "meta.desc": "AREA MOSA \u2014 \u0430\u0432\u0442\u043e\u0440\u0441\u043a\u0430\u044f \u043f\u0430\u0440\u0438\u043a\u043c\u0430\u0445\u0435\u0440\u0441\u043a\u0430\u044f \u0432 \u041a\u043e\u0440\u0434\u043e\u043d\u0435, \u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e. \u0421\u0442\u0440\u0438\u0436\u043a\u0430, \u043e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435, \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430.",
    "nav.services": "\u0423\u0441\u043b\u0443\u0433\u0438",
    "nav.works": "\u0420\u0430\u0431\u043e\u0442\u044b",
    "nav.about": "\u041e \u043d\u0430\u0441",
    "nav.cta": "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f",
    "hero.location": "\u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e, \u041a\u043e\u0440\u0434\u043e\u043d",
    "hero.cta": "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f",
    "hero.scroll": "\u041f\u0440\u043e\u043a\u0440\u0443\u0442\u0438\u0442\u0435",
    "hero.badge": "\u041c\u0410\u0421\u0422\u0415\u0420 \u0410\u0420\u0422\u0401\u041c \u00b7 \u041c\u041e\u041d\u0422\u0415\u0412\u0418\u0414\u0415\u041e \u00b7",
    "about.label": "\u041e \u043d\u0430\u0441",
    "about.title": "\u041c\u0430\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043e<br/><em>\u0432 \u043a\u0430\u0436\u0434\u043e\u043c\u00a0\u0448\u0442\u0440\u0438\u0445\u0435</em>",
    "about.desc": "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0430\u044f \u043f\u0430\u0440\u0438\u043a\u043c\u0430\u0445\u0435\u0440\u0441\u043a\u0430\u044f \u0432 \u0441\u0435\u0440\u0434\u0446\u0435 \u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e, \u0433\u0434\u0435 \u043a\u0430\u0436\u0434\u0430\u044f \u0441\u0442\u0440\u0438\u0436\u043a\u0430 \u2014 \u044d\u0442\u043e \u0440\u0430\u0431\u043e\u0442\u0430 \u0445\u0443\u0434\u043e\u0436\u043d\u0438\u043a\u0430. \u041c\u0430\u0441\u0442\u0435\u0440 \u0410\u0440\u0442\u0451\u043c \u0441\u043e\u0437\u0434\u0430\u0451\u0442 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e, \u0432 \u043a\u043e\u0442\u043e\u0440\u043e\u043c \u0445\u043e\u0447\u0435\u0442\u0441\u044f \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0442\u044c\u0441\u044f \u0441\u043d\u043e\u0432\u0430.",
    "about.photoLabel": "\u041a\u043e\u0440\u0434\u043e\u043d, \u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e",
    "about.stat1": "\u0432 Google",
    "about.stat2": "\u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432",
    "about.stat3": "\u0431\u0440\u0435\u043d\u0434\u0430 \u0443\u0445\u043e\u0434\u0430",
    "about.link": "\u041f\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0443\u0441\u043b\u0443\u0433\u0438",
    "about.phInterior": "\u0418\u043d\u0442\u0435\u0440\u044c\u0435\u0440",
    "about.phMural": "\u041c\u0443\u0440\u0430\u043b",
    "about.phDetails": "\u0414\u0435\u0442\u0430\u043b\u0438",
    "services.label": "\u0423\u0441\u043b\u0443\u0433\u0438",
    "services.title": "\u0427\u0442\u043e \u043c\u044b \u0434\u0435\u043b\u0430\u0435\u043c",
    "services.popular": "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e\u0435",
    "services.s1.title": "\u0421\u0442\u0440\u0438\u0436\u043a\u0430",
    "services.s1.desc": "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0430\u044f \u0441\u0442\u0440\u0438\u0436\u043a\u0430 \u0441 \u0443\u0447\u0451\u0442\u043e\u043c \u0442\u0438\u043f\u0430 \u0432\u043e\u043b\u043e\u0441, \u0444\u043e\u0440\u043c\u044b \u043b\u0438\u0446\u0430 \u0438 \u043e\u0431\u0440\u0430\u0437\u0430 \u0436\u0438\u0437\u043d\u0438. \u041a\u0430\u0436\u0434\u044b\u0439 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0443\u043d\u0438\u043a\u0430\u043b\u0435\u043d.",
    "services.s2.title": "\u041e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435",
    "services.s2.desc": "\u041d\u0430\u0442\u0443\u0440\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u044b, \u044f\u0440\u043a\u0438\u0435 \u0430\u043a\u0446\u0435\u043d\u0442\u044b \u0438\u043b\u0438 \u043f\u043e\u043b\u043d\u043e\u0435 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u2014 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u043c \u0441 \u043b\u044e\u0431\u043e\u0439 \u0442\u0435\u0445\u043d\u0438\u043a\u043e\u0439 \u0446\u0432\u0435\u0442\u0430.",
    "services.s3.title": "\u0423\u0445\u043e\u0434 \u0437\u0430 \u0432\u043e\u043b\u043e\u0441\u0430\u043c\u0438",
    "services.s3.desc": "\u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0446\u0435\u0434\u0443\u0440\u044b \u0441 \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0439 \u043a\u043e\u0441\u043c\u0435\u0442\u0438\u043a\u043e\u0439 \u0434\u043b\u044f \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f \u0438 \u0431\u043b\u0435\u0441\u043a\u0430 \u0432\u0430\u0448\u0438\u0445 \u0432\u043e\u043b\u043e\u0441.",
    "services.s4.title": "\u041a\u043e\u043c\u0431\u043e",
    "services.s4.desc": "\u0421\u0442\u0440\u0438\u0436\u043a\u0430 \u043f\u043b\u044e\u0441 \u043e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435 \u0438\u043b\u0438 \u0443\u0445\u043e\u0434 \u2014 \u043f\u043e\u043b\u043d\u043e\u0435 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0432 \u043e\u0434\u043d\u043e\u043c \u0432\u0438\u0437\u0438\u0442\u0435 \u043f\u043e \u0432\u044b\u0433\u043e\u0434\u043d\u043e\u0439 \u0446\u0435\u043d\u0435.",
    "services.cta": "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f",
    "works.label": "\u0420\u0430\u0431\u043e\u0442\u044b",
    "works.title": "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0433\u043e\u0432\u043e\u0440\u044f\u0442 \u0441\u0430\u043c\u0438",
    "works.phColor": "\u041e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435",
    "works.phCut": "\u0421\u0442\u0440\u0438\u0436\u043a\u0430",
    "works.phCare": "\u0423\u0445\u043e\u0434",
    "works.phDetails": "\u0414\u0435\u0442\u0430\u043b\u0438",
    "works.phMural": "\u041c\u0443\u0440\u0430\u043b",
    "works.phResult": "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442",
    "works.tagColor": "\u0426\u0432\u0435\u0442",
    "works.tagCut": "\u0421\u0442\u0440\u0438\u0436\u043a\u0430",
    "works.tagCare": "\u0423\u0445\u043e\u0434",
    "works.tagDetails": "\u0414\u0435\u0442\u0430\u043b\u0438",
    "works.tagSpace": "\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e",
    "works.tagBA": "\u0414\u043e/\u043f\u043e\u0441\u043b\u0435",
    "atmos.label": "\u0410\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430",
    "atmos.phMural": "\u041c\u0443\u0440\u0430\u043b \u2014 \u0432\u0438\u0437\u0438\u0442\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0430 AREA MOSA",
    "atmos.title": "\u0411\u043e\u043b\u044c\u0448\u0435, \u0447\u0435\u043c<br/><em>\u043f\u0430\u0440\u0438\u043a\u043c\u0430\u0445\u0435\u0440\u0441\u043a\u0430\u044f</em>",
    "atmos.p1": "\u041c\u044b \u0441\u043e\u0437\u0434\u0430\u043b\u0438 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e, \u0433\u0434\u0435 \u0438\u0441\u043a\u0443\u0441\u0441\u0442\u0432\u043e \u0432\u0441\u0442\u0440\u0435\u0447\u0430\u0435\u0442\u0441\u044f \u0441 \u043c\u0430\u0441\u0442\u0435\u0440\u0441\u0442\u0432\u043e\u043c. \u042f\u0440\u043a\u0438\u0439 \u043c\u0443\u0440\u0430\u043b \u043d\u0430 \u0441\u0442\u0435\u043d\u0435 \u2014 \u043d\u0435 \u043f\u0440\u043e\u0441\u0442\u043e \u0434\u0435\u043a\u043e\u0440, \u0430 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440 \u043c\u0435\u0441\u0442\u0430.",
    "atmos.p2": "\u0417\u0434\u0435\u0441\u044c \u043f\u044c\u044e\u0442 \u043a\u043e\u0444\u0435, \u0441\u043b\u0443\u0448\u0430\u044e\u0442 \u043c\u0443\u0437\u044b\u043a\u0443 \u0438 \u0443\u0445\u043e\u0434\u044f\u0442 \u0434\u0440\u0443\u0433\u0438\u043c \u0447\u0435\u043b\u043e\u0432\u0435\u043a\u043e\u043c. \u041a\u0430\u0436\u0434\u0430\u044f \u0434\u0435\u0442\u0430\u043b\u044c \u043f\u0440\u043e\u0434\u0443\u043c\u0430\u043d\u0430 \u2014 \u043e\u0442 \u0432\u044b\u0431\u043e\u0440\u0430 \u043a\u0440\u0430\u0441\u0438\u0442\u0435\u043b\u0435\u0439 \u0434\u043e \u043e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u044f \u043a\u0440\u0435\u0441\u043b\u0430.",
    "atmos.quote": "\u00ab\u041c\u044b \u043d\u0435 \u043f\u0440\u043e\u0441\u0442\u043e \u0441\u0442\u0440\u0438\u0436\u0451\u043c \u0432\u043e\u043b\u043e\u0441\u044b \u2014 \u043c\u044b \u0441\u043e\u0437\u0434\u0430\u0451\u043c \u043e\u0431\u0440\u0430\u0437\u00bb",
    "atmos.cite": "\u2014 \u041c\u0430\u0441\u0442\u0435\u0440 \u0410\u0440\u0442\u0451\u043c",
    "atmos.h.desc": "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0438\u0435 \u0441\u0442\u0440\u0438\u0436\u043a\u0438 \u0441 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u0435\u043c \u043a \u043a\u0430\u0436\u0434\u043e\u0439 \u0434\u0435\u0442\u0430\u043b\u0438",
    "atmos.c.desc": "\u041f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u043e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435 \u043b\u044e\u0431\u043e\u0439 \u0441\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u0438",
    "atmos.a.desc": "\u041f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e, \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u043e\u0435 \u0434\u043b\u044f \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u0430 \u0438 \u0432\u0434\u043e\u0445\u043d\u043e\u0432\u0435\u043d\u0438\u044f",
    "booking.label": "\u0417\u0430\u043f\u0438\u0441\u044c",
    "booking.title": "\u0413\u043e\u0442\u043e\u0432\u044b \u043a<br/><em>\u043f\u0435\u0440\u0435\u043c\u0435\u043d\u0430\u043c?</em>",
    "booking.desc": "\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0441\u044c \u043b\u044e\u0431\u044b\u043c \u0443\u0434\u043e\u0431\u043d\u044b\u043c \u0441\u043f\u043e\u0441\u043e\u0431\u043e\u043c \u2014 \u043e\u0442\u0432\u0435\u0442\u0438\u043c \u0431\u044b\u0441\u0442\u0440\u043e. \u0414\u043b\u044f \u043d\u0430\u0441 \u0432\u0430\u0436\u0435\u043d \u043a\u0430\u0436\u0434\u044b\u0439 \u043a\u043b\u0438\u0435\u043d\u0442.",
    "booking.monFri": "\u041f\u043d \u2014 \u041f\u0442",
    "booking.sat": "\u0421\u0443\u0431\u0431\u043e\u0442\u0430",
    "booking.sun": "\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435",
    "booking.byAppt": "\u043f\u043e \u0437\u0430\u043f\u0438\u0441\u0438",
    "booking.closed": "\u0432\u044b\u0445\u043e\u0434\u043d\u043e\u0439",
    "booking.address": "\u041a\u043e\u0440\u0434\u043e\u043d, \u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e, \u0423\u0440\u0443\u0433\u0432\u0430\u0439",
    "booking.waLabel": "WhatsApp",
    "booking.waSub": "\u041e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u043a\u0430\u043d\u0430\u043b \u0437\u0430\u043f\u0438\u0441\u0438",
    "booking.igLabel": "Instagram",
    "footer.booking": "\u0417\u0430\u043f\u0438\u0441\u044c",
    "footer.location": "\u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e, \u0423\u0440\u0443\u0433\u0432\u0430\u0439",
    "marquee.salon": "\u0410\u0432\u0442\u043e\u0440\u0441\u043a\u0430\u044f \u043f\u0430\u0440\u0438\u043a\u043c\u0430\u0445\u0435\u0440\u0441\u043a\u0430\u044f \u2003",
    "marquee.master": "\u041c\u0430\u0441\u0442\u0435\u0440 \u0410\u0440\u0442\u0451\u043c \u2003",
    "marquee.location": "\u041c\u043e\u043d\u0442\u0435\u0432\u0438\u0434\u0435\u043e, \u041a\u043e\u0440\u0434\u043e\u043d \u2003",
    "divider.cut": "\u0421\u0442\u0440\u0438\u0436\u043a\u0430 \u2003\u2726\u2003",
    "divider.color": "\u041e\u043a\u0440\u0430\u0448\u0438\u0432\u0430\u043d\u0438\u0435 \u2003\u2726\u2003",
    "divider.care": "\u0423\u0445\u043e\u0434 \u2003\u2726\u2003",
    "divider.combo": "\u041a\u043e\u043c\u0431\u043e \u2003\u2726\u2003"
  },
  es: {
    "meta.title": "AREA MOSA \u2014 Peluquer\u00eda, Montevideo",
    "meta.desc": "AREA MOSA \u2014 peluquer\u00eda de autor en Cord\u00f3n, Montevideo. Corte, coloraci\u00f3n, ambiente.",
    "nav.services": "Servicios",
    "nav.works": "Trabajos",
    "nav.about": "Nosotros",
    "nav.cta": "Reservar",
    "hero.location": "Montevideo, Cord\u00f3n",
    "hero.cta": "Reservar",
    "hero.scroll": "Desplazar",
    "hero.badge": "MAESTRO ARTEM \u00b7 MONTEVIDEO \u00b7",
    "about.label": "Nosotros",
    "about.title": "Maestr\u00eda<br/><em>en cada\u00a0trazo</em>",
    "about.desc": "Peluquer\u00eda de autor en el coraz\u00f3n de Montevideo, donde cada corte es obra de un artista. Maestro Artem crea un espacio al que quieres volver.",
    "about.photoLabel": "Cord\u00f3n, Montevideo",
    "about.stat1": "en Google",
    "about.stat2": "clientes",
    "about.stat3": "marcas de cuidado",
    "about.link": "Ver servicios",
    "about.phInterior": "Interior",
    "about.phMural": "Mural",
    "about.phDetails": "Detalles",
    "services.label": "Servicios",
    "services.title": "Lo que hacemos",
    "services.popular": "Popular",
    "services.s1.title": "Corte",
    "services.s1.desc": "Corte de autor adaptado a tu tipo de cabello, forma de rostro y estilo de vida. Cada resultado es \u00fanico.",
    "services.s2.title": "Coloraci\u00f3n",
    "services.s2.desc": "Transiciones naturales, acentos brillantes o transformaci\u00f3n total \u2014 trabajamos con cualquier t\u00e9cnica de color.",
    "services.s3.title": "Cuidado capilar",
    "services.s3.desc": "Tratamientos restauradores con cosm\u00e9tica profesional para la salud y el brillo de tu cabello.",
    "services.s4.title": "Combo",
    "services.s4.desc": "Corte m\u00e1s coloraci\u00f3n o cuidado \u2014 transformaci\u00f3n completa en una sola visita a un precio ventajoso.",
    "services.cta": "Reservar",
    "works.label": "Trabajos",
    "works.title": "Los resultados hablan solos",
    "works.phColor": "Coloraci\u00f3n",
    "works.phCut": "Corte",
    "works.phCare": "Cuidado",
    "works.phDetails": "Detalles",
    "works.phMural": "Mural",
    "works.phResult": "Resultado",
    "works.tagColor": "Color",
    "works.tagCut": "Corte",
    "works.tagCare": "Cuidado",
    "works.tagDetails": "Detalles",
    "works.tagSpace": "Espacio",
    "works.tagBA": "Antes/despu\u00e9s",
    "atmos.label": "Ambiente",
    "atmos.phMural": "Mural \u2014 sello distintivo de AREA MOSA",
    "atmos.title": "M\u00e1s que<br/><em>una peluquer\u00eda</em>",
    "atmos.p1": "Creamos un espacio donde el arte se encuentra con la maestr\u00eda. El vibrante mural en la pared no es solo decoraci\u00f3n, es el car\u00e1cter del lugar.",
    "atmos.p2": "Aqu\u00ed se toma caf\u00e9, se escucha m\u00fasica y sales siendo otra persona. Cada detalle est\u00e1 pensado \u2014 desde la elecci\u00f3n de tintes hasta la iluminaci\u00f3n del sill\u00f3n.",
    "atmos.quote": "\u00abNo solo cortamos cabello \u2014 creamos imagen\u00bb",
    "atmos.cite": "\u2014 Maestro Artem",
    "atmos.h.desc": "Cortes de autor con atenci\u00f3n a cada detalle",
    "atmos.c.desc": "Coloraci\u00f3n profesional de cualquier complejidad",
    "atmos.a.desc": "Un espacio creado para el confort y la inspiraci\u00f3n",
    "booking.label": "Reserva",
    "booking.title": "\u00bfListo para<br/><em>un cambio?</em>",
    "booking.desc": "Reserva de la forma que prefieras \u2014 respondemos r\u00e1pido. Cada cliente es importante para nosotros.",
    "booking.monFri": "Lun \u2014 Vie",
    "booking.sat": "S\u00e1bado",
    "booking.sun": "Domingo",
    "booking.byAppt": "con cita",
    "booking.closed": "cerrado",
    "booking.address": "Cord\u00f3n, Montevideo, Uruguay",
    "booking.waLabel": "WhatsApp",
    "booking.waSub": "Canal principal de reservas",
    "booking.igLabel": "Instagram",
    "footer.booking": "Reserva",
    "footer.location": "Montevideo, Uruguay",
    "marquee.salon": "Peluquer\u00eda de autor \u2003",
    "marquee.master": "Maestro Artem \u2003",
    "marquee.location": "Montevideo, Cord\u00f3n \u2003",
    "divider.cut": "Corte \u2003\u2726\u2003",
    "divider.color": "Coloraci\u00f3n \u2003\u2726\u2003",
    "divider.care": "Cuidado \u2003\u2726\u2003",
    "divider.combo": "Combo \u2003\u2726\u2003"
  },
  en: {
    "meta.title": "AREA MOSA \u2014 Hair Salon, Montevideo",
    "meta.desc": "AREA MOSA \u2014 boutique hair salon in Cord\u00f3n, Montevideo. Haircut, coloring, atmosphere.",
    "nav.services": "Services",
    "nav.works": "Works",
    "nav.about": "About",
    "nav.cta": "Book Now",
    "hero.location": "Montevideo, Cord\u00f3n",
    "hero.cta": "Book Now",
    "hero.scroll": "Scroll",
    "hero.badge": "MASTER ARTEM \u00b7 MONTEVIDEO \u00b7",
    "about.label": "About Us",
    "about.title": "Mastery<br/><em>in every\u00a0stroke</em>",
    "about.desc": "A boutique hair salon in the heart of Montevideo, where every haircut is a work of art. Master Artem creates a space you will want to come back to.",
    "about.photoLabel": "Cord\u00f3n, Montevideo",
    "about.stat1": "on Google",
    "about.stat2": "clients",
    "about.stat3": "care brands",
    "about.link": "View services",
    "about.phInterior": "Interior",
    "about.phMural": "Mural",
    "about.phDetails": "Details",
    "services.label": "Services",
    "services.title": "What we do",
    "services.popular": "Popular",
    "services.s1.title": "Haircut",
    "services.s1.desc": "A signature haircut tailored to your hair type, face shape, and lifestyle. Every result is unique.",
    "services.s2.title": "Coloring",
    "services.s2.desc": "Natural transitions, bold accents, or a complete transformation \u2014 we work with any color technique.",
    "services.s3.title": "Hair Care",
    "services.s3.desc": "Restorative treatments with professional cosmetics for the health and shine of your hair.",
    "services.s4.title": "Combo",
    "services.s4.desc": "Haircut plus coloring or care \u2014 a complete transformation in one visit at a great price.",
    "services.cta": "Book Now",
    "works.label": "Works",
    "works.title": "Results speak for themselves",
    "works.phColor": "Coloring",
    "works.phCut": "Haircut",
    "works.phCare": "Care",
    "works.phDetails": "Details",
    "works.phMural": "Mural",
    "works.phResult": "Result",
    "works.tagColor": "Color",
    "works.tagCut": "Haircut",
    "works.tagCare": "Care",
    "works.tagDetails": "Details",
    "works.tagSpace": "Space",
    "works.tagBA": "Before/After",
    "atmos.label": "Atmosphere",
    "atmos.phMural": "Mural \u2014 the signature of AREA MOSA",
    "atmos.title": "More than<br/><em>a hair salon</em>",
    "atmos.p1": "We created a space where art meets mastery. The vibrant mural on the wall is not just decor \u2014 it is the character of the place.",
    "atmos.p2": "Here you drink coffee, listen to music, and leave a different person. Every detail is thought through \u2014 from the choice of dyes to the lighting of the chair.",
    "atmos.quote": "\"We don't just cut hair \u2014 we create an image\"",
    "atmos.cite": "\u2014 Master Artem",
    "atmos.h.desc": "Signature haircuts with attention to every detail",
    "atmos.c.desc": "Professional coloring of any complexity",
    "atmos.a.desc": "A space created for comfort and inspiration",
    "booking.label": "Booking",
    "booking.title": "Ready for<br/><em>a change?</em>",
    "booking.desc": "Book in any way you prefer \u2014 we respond quickly. Every client matters to us.",
    "booking.monFri": "Mon \u2014 Fri",
    "booking.sat": "Saturday",
    "booking.sun": "Sunday",
    "booking.byAppt": "by appointment",
    "booking.closed": "closed",
    "booking.address": "Cord\u00f3n, Montevideo, Uruguay",
    "booking.waLabel": "WhatsApp",
    "booking.waSub": "Main booking channel",
    "booking.igLabel": "Instagram",
    "footer.booking": "Booking",
    "footer.location": "Montevideo, Uruguay",
    "marquee.salon": "Boutique Hair Salon \u2003",
    "marquee.master": "Master Artem \u2003",
    "marquee.location": "Montevideo, Cord\u00f3n \u2003",
    "divider.cut": "Haircut \u2003\u2726\u2003",
    "divider.color": "Coloring \u2003\u2726\u2003",
    "divider.care": "Care \u2003\u2726\u2003",
    "divider.combo": "Combo \u2003\u2726\u2003"
  }
};

/* ---- LANG LABELS ------------------------------------------ */
var LANG_LABELS = { ru: 'RU', es: 'ES', en: 'EN' };

/* ---- SET LANGUAGE ----------------------------------------- */
function setLang(lang) {
  if (!T[lang]) return;

  var dict = T[lang];

  /* update <html lang> */
  document.documentElement.lang = lang;

  /* update <title> and <meta description> */
  document.title = dict['meta.title'];
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', dict['meta.desc']);

  /* text-only elements */
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (dict[key] != null) el.textContent = dict[key];
  });

  /* HTML elements (titles with <br/><em>) */
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  /* update switcher display */
  var currentEl = document.getElementById('langCurrent');
  if (currentEl) currentEl.textContent = LANG_LABELS[lang];

  /* update active state in menu */
  document.querySelectorAll('#langMenu button').forEach(function(btn) {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
  });

  /* persist */
  try { localStorage.setItem('area-mosa-lang', lang); } catch(e) {}
}

/* ---- DETECT INITIAL LANGUAGE ------------------------------ */
function detectLang() {
  /* 1. saved preference */
  try {
    var saved = localStorage.getItem('area-mosa-lang');
    if (saved && T[saved]) return saved;
  } catch(e) {}

  /* 2. browser language */
  var nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('en')) return 'en';

  /* 3. default */
  return 'ru';
}

/* ---- INIT LANG SWITCHER ----------------------------------- */
(function initLangSwitcher() {
  var switcher = document.getElementById('langSwitcher');
  var btn      = switcher ? switcher.querySelector('.lang-switcher__btn') : null;
  var menu     = document.getElementById('langMenu');

  if (!switcher || !btn || !menu) return;

  /* toggle dropdown */
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    switcher.classList.toggle('is-open');
  });

  /* language selection */
  menu.addEventListener('click', function(e) {
    var langBtn = e.target.closest('[data-lang]');
    if (!langBtn) return;
    var lang = langBtn.getAttribute('data-lang');
    setLang(lang);
    switcher.classList.remove('is-open');
  });

  /* close on outside click */
  document.addEventListener('click', function() {
    switcher.classList.remove('is-open');
  });

  /* close on Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') switcher.classList.remove('is-open');
  });

  /* set initial language */
  var initialLang = detectLang();
  setLang(initialLang);
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
var cursor    = document.getElementById('cursor');
var cursorDot = document.getElementById('cursorDot');

if (cursor && window.matchMedia('(hover: hover)').matches) {
  var mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function lerp() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(lerp);
  })();

  document.querySelectorAll('a, button, .service-card, .bento__item, .fab').forEach(function(el) {
    el.addEventListener('mouseenter', function() { cursor.classList.add('is-hovering'); });
    el.addEventListener('mouseleave', function() { cursor.classList.remove('is-hovering'); });
  });
  window.addEventListener('mousedown', function() { cursor.classList.add('is-clicking'); });
  window.addEventListener('mouseup',   function() { cursor.classList.remove('is-clicking'); });
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
var progressBar = document.getElementById('scrollProgress');
var navEl       = document.getElementById('nav');

function onScroll() {
  var max = document.body.scrollHeight - window.innerHeight;
  var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + '%';
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   HERO PARALLAX
   ============================================================ */
var heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', function() {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
    }
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
var revealEls = document.querySelectorAll('.reveal');
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(function(el) { revealObs.observe(el); });

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  var target    = parseFloat(el.dataset.count);
  var suffix    = el.dataset.suffix || '';
  var isDecimal = String(target).indexOf('.') !== -1;
  var duration  = 1400;
  var start     = performance.now();

  function step(now) {
    var elapsed  = now - start;
    var progress = Math.min(elapsed / duration, 1);
    var ease     = 1 - Math.pow(1 - progress, 3);
    var current  = target * ease;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

var counterObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(function(el) { counterObs.observe(el); });

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var offset = (navEl ? navEl.offsetHeight : 70) + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
