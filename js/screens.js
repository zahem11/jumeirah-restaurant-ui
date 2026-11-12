/* ═══════════════════════════════════════════════════════════════
   JUMEIRÀH — منطق الشاشات الإضافية
   صفحة التخصيص / صفحة الحجز / لوحة التحكم
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = (n) => n.toLocaleString('en-US');
const rnd4 = () => String(Math.floor(1000 + Math.random() * 9000));

/* ─── توست مشترك ────────────────────────────────────────────── */
let toastTimer;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

/* ═════════════════════════════════════════════════════════════
   1) صفحة تخصيص الطلب + الدفع
   ═════════════════════════════════════════════════════════════ */
function initCustomize() {
  const state = { bread: 160, extras: new Set(), qty: 1 };
  const BREAD_NAMES = { souri: 'عيش سوري', baguette: 'عيش باجيت' };
  const EXTRA_NAMES = { toum: 'إضافة تومية', fries: 'باكت بطاطس' };

  const total = () =>
    [...state.extras].reduce((s, p) => s + p, state.bread) * state.qty;

  function render() {
    const t = total();
    $('#liveTotal').textContent = fmt(t);
    $('#sumQty').textContent = state.qty;
    $('#sumItems').textContent = fmt(t) + ' ج.م';
    $('#sumGrand').textContent = fmt(t) + ' ج.م';
    $('#qtyVal').textContent = state.qty;
  }

  $$('input[name="bread"]').forEach((r) =>
    r.addEventListener('change', () => { state.bread = +r.dataset.price; render(); }));

  $$('input[name="extra"]').forEach((c) =>
    c.addEventListener('change', () => {
      c.checked ? state.extras.add(+c.dataset.price) : state.extras.delete(+c.dataset.price);
      render();
    }));

  $('#qtyPlus').addEventListener('click', () => { if (state.qty < 20) { state.qty++; render(); } });
  $('#qtyMinus').addEventListener('click', () => { if (state.qty > 1) { state.qty--; render(); } });

  /* التحقق من بيانات العميل */
  function validate() {
    let ok = true;
    const name = $('#custName');
    const phone = $('#custPhone');
    [name, phone].forEach((i) => i.classList.remove('input-error'));

    if (name.value.trim().length < 3) {
      name.classList.add('input-error');
      toast('اكتب اسمك بالكامل عشان ننادي عليه 🙂');
      ok = false;
    } else if (!/^01[0-9]{9}$/.test(phone.value.replace(/\s/g, ''))) {
      phone.classList.add('input-error');
      toast('رقم الموبايل غير صحيح — لازم 11 رقم يبدأ بـ 01 📱');
      ok = false;
    }
    if (!ok) { (name.value.trim().length < 3 ? name : phone).focus(); }
    return ok ? { name: name.value.trim(), phone: phone.value.replace(/\s/g, ''), addr: $('#custAddr').value.trim() } : null;
  }

  $('#confirmOrder').addEventListener('click', () => {
    const cust = validate();
    if (!cust) return;

    const t = total();
    const breadEl = $('input[name="bread"]:checked');
    const extras = $$('input[name="extra"]:checked').map((c) => EXTRA_NAMES[c.value]);

    $('#orderCode').textContent = 'JUM-' + rnd4();
    $('#sPhone').textContent = cust.phone;
    $('#successDetails').innerHTML = `
      <div class="srow"><span>الصنف</span><span>ساندوتش جُميرا ميكس × ${state.qty}</span></div>
      <div class="srow"><span>العيش</span><span>${BREAD_NAMES[breadEl.value]}</span></div>
      <div class="srow"><span>الإضافات</span><span>${extras.length ? extras.join(' + ') : 'من غير إضافات'}</span></div>
      <div class="srow"><span>العميل</span><span>${cust.name}</span></div>
      <div class="srow"><span>العنوان</span><span>${cust.addr}</span></div>
      <div class="srow"><span>طريقة الاستلام</span><span>🛵 توصيل — مجاني (عرض الثلاثاء)</span></div>
      <div class="srow"><span>الإجمالي</span><span style="color:var(--gold-deep);">${fmt(t)} ج.م</span></div>`;

    $('#successOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  render();
}

/* ═════════════════════════════════════════════════════════════
   2) صفحة حجز الطاولة
   ═════════════════════════════════════════════════════════════ */
function initReservation() {
  const state = { guests: 4, time: '6:00 م', upsells: new Map() };
  const UPSELL_NAMES = { balloon: 'صينية البالون دور', torta: 'تورتة شاورما' };

  /* شيبس الضيوف 2 → 15 */
  $('#guestChips').innerHTML = Array.from({ length: 14 }, (_, i) => i + 2)
    .map((n) => `<button class="g-chip ${n === state.guests ? 'is-active' : ''}" data-guests="${n}" type="button">${n}</button>`)
    .join('');

  $('#guestChips').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-guests]');
    if (!chip) return;
    state.guests = +chip.dataset.guests;
    $$('#guestChips .g-chip').forEach((c) => c.classList.toggle('is-active', c === chip));
  });

  $('#timeChips').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-time]');
    if (!chip) return;
    state.time = chip.dataset.time;
    $$('#timeChips .g-chip').forEach((c) => c.classList.toggle('is-active', c === chip));
  });

  /* تاريخ افتراضي = النهاردة */
  const dateEl = $('#resDate');
  const today = new Date();
  dateEl.value = today.toISOString().slice(0, 10);
  dateEl.min = dateEl.value;

  /* الأب-سيل */
  $$('.upsell-card').forEach((card) => {
    const id = card.dataset.upsell;
    const price = +card.dataset.price;
    const btn = $('.upsell-add', card);
    btn.addEventListener('click', () => {
      if (state.upsells.has(id)) {
        state.upsells.delete(id);
        card.classList.remove('is-added');
        btn.textContent = 'أضفها للطاولة';
        toast(`تم إزالة «${UPSELL_NAMES[id]}» من الحجز`);
      } else {
        state.upsells.set(id, price);
        card.classList.add('is-added');
        btn.textContent = 'تمت الإضافة ✓';
        toast(`تمت إضافة «${UPSELL_NAMES[id]}» — ${fmt(price)} ج.م ✨`);
      }
      renderTotal();
    });
  });

  const upsellSum = () => [...state.upsells.values()].reduce((s, p) => s + p, 0);
  function renderTotal() { $('#resTotal').textContent = fmt(upsellSum()); }

  /* تلميح المناسبة الخاصة */
  $$('input[name="occasion"]').forEach((r) =>
    r.addEventListener('change', () => {
      if (r.value === 'party') toast('اختيار جميل! هنجهزلك الديكور والبالونات ببلاش 🎈🎂');
      if (r.value === 'family' && state.guests < 6) toast('نصيحة: العزومة العائلية أكلها بصواني — ممكن تزود عدد الأفراد 👨‍👩‍👧‍👦');
    }));

  /* تأكيد الحجز */
  $('#confirmRes').addEventListener('click', () => {
    const occ = $('input[name="occasion"]:checked');
    const OCC_NAMES = { normal: 'قعدة عادية', family: 'عزومة عائلية', party: 'عيد ميلاد / مناسبة خاصة (تجهيز ديكور)' };
    const dateTxt = new Date(dateEl.value + 'T12:00:00').toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });

    const upsellRows = [...state.upsells.keys()].map((id) =>
      `<div class="srow"><span>${UPSELL_NAMES[id]}</span><span>${fmt(state.upsells.get(id))} ج.م</span></div>`).join('');

    $('#resCode').textContent = 'TBL-' + rnd4();
    $('#resDetails').innerHTML = `
      <div class="srow"><span>عدد الأفراد</span><span>${state.guests} ${state.guests <= 2 ? 'فرد' : 'أفراد'}</span></div>
      <div class="srow"><span>الموعد</span><span>${dateTxt} — ${state.time}</span></div>
      <div class="srow"><span>نوع المناسبة</span><span>${OCC_NAMES[occ.value]}</span></div>
      ${upsellRows}
      <div class="srow"><span>إجمالي التجهيزات</span><span style="color:var(--gold-deep);">${fmt(upsellSum())} ج.م</span></div>
      <div class="srow"><span>الحجز</span><span class="free-tag">مجاني 🎁</span></div>`;

    $('#successOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  renderTotal();
}

/* ═════════════════════════════════════════════════════════════
   3) لوحة تحكم المالك
   ═════════════════════════════════════════════════════════════ */
function initAdmin() {
  /* التاريخ في الهيدر */
  $('#adminDate').textContent = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* عدّاد الإحصائيات */
  $$('[data-count]').forEach((el) => {
    const target = +el.dataset.count;
    const t0 = performance.now();
    const dur = 900;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });

  /* ── الأوردرات المباشرة ── */
  const STATUS = [
    { label: 'طلب جديد', cls: 'st-new', next: 'ابدأ التحضير 👨‍🍳' },
    { label: 'جاري التحضير', cls: 'st-prep', next: 'تم التسليم ✓' },
    { label: 'تم التسليم', cls: 'st-done', next: null },
  ];

  let orders = [
    { id: 'JUM-2418', name: 'أحمد السيد', phone: '0101 234 5678', items: [{ n: 'صينية دبي', q: 1 }, { n: 'بيبسي', q: 2 }], total: 815, mode: 'دليفري', status: 0, time: 'منذ 3 دقايق' },
    { id: 'JUM-2417', name: 'منى عبد الله', phone: '0119 876 5432', items: [{ n: 'جُميرا برجر سبيشيال', q: 2 }, { n: 'ميني بوت سيجنتشر', q: 1 }], total: 615, mode: 'استلام من الفرع', status: 1, time: 'منذ 12 دقيقة' },
    { id: 'JUM-2416', name: 'كريم فؤاد', phone: '0125 554 4433', items: [{ n: 'تورتة شاورما', q: 1 }, { n: 'مشروبات غازية', q: 4 }], total: 1040, mode: 'حجز طاولة', status: 2, time: 'منذ 40 دقيقة' },
    { id: 'JUM-2415', name: 'سارة محمود', phone: '0106 337 2819', items: [{ n: 'بيتزا جُميرا سبيشيال', q: 1 }, { n: 'باكت بطاطس', q: 1 }], total: 325, mode: 'دليفري', status: 0, time: 'منذ 6 دقايق' },
  ];
  let nextOrderNum = 2419;
  let filter = 'all';

  const itemsText = (items) => items.map((i) => `${i.q > 1 ? i.q + ' ' : ''}${i.n}`).join(' + ');

  function badge(o) {
    const s = STATUS[o.status];
    return `<span class="status ${s.cls}">${o.status === 0 && o.mode === 'دليفري' ? 'طلب جديد - دليفري' : s.label}</span>`;
  }

  function renderOrders() {
    const list = orders.filter((o) => filter === 'all' || String(o.status) === filter);
    $('#ordersList').innerHTML = list.length ? list.map((o) => {
      const s = STATUS[o.status];
      const initials = o.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
      return `
      <article class="order-card ${o.status === 0 ? 'is-new' : ''}" style="animation-delay:${Math.min(list.indexOf(o), 6) * 50}ms">
        <div class="order-head">
          <span class="order-id">#${o.id}</span>
          <span class="order-time">🕒 ${o.time}</span>
          ${badge(o)}
        </div>
        <div class="order-cust">
          <span class="cust-ava" aria-hidden="true">${initials}</span>
          ${o.name}
          <span class="order-phone">${o.phone}</span>
        </div>
        <div class="order-items">🍴 ${itemsText(o.items)}</div>
        <div class="order-foot">
          <div style="display:flex; align-items:center; gap:.5rem;">
            <span class="order-total">${fmt(o.total)} ج.م</span>
            <span class="order-mode">${o.mode}</span>
          </div>
          ${s.next
            ? `<button class="btn btn-gold btn-sm" data-advance="${o.id}" type="button">${s.next}</button>`
            : `<button class="btn btn-outline btn-sm" disabled type="button" style="opacity:.55; cursor:default;">مكتمل ✓</button>`}
        </div>
      </article>`;
    }).join('') : '<p style="text-align:center; color:var(--muted); padding:1.5rem 0;">لا توجد أوردرات في هذا الفلتر 🍽️</p>';
  }

  $('#ordersList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-advance]');
    if (!btn) return;
    const o = orders.find((x) => x.id === btn.dataset.advance);
    if (!o || o.status >= 2) return;
    o.status++;
    renderOrders();
    toast(o.status === 1
      ? `بدأنا تحضير أوردر ${o.name} 👨‍🍳`
      : `تم تسليم أوردر ${o.name} بنجاح ✅`);
  });

  $('#orderFilters').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    filter = chip.dataset.filter;
    $$('#orderFilters .g-chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    renderOrders();
  });

  /* محاكاة طلب جديد */
  const SIM_POOL = [
    { name: 'محمود الشريف', phone: '0122 845 6690', items: [{ n: 'ساندوتش جُميرا ميكس', q: 2 }, { n: 'عصير مانجو', q: 1 }], total: 475, mode: 'دليفري' },
    { name: 'هالة يوسف', phone: '0100 129 5567', items: [{ n: 'صينية ملوك جُميرا', q: 1 }, { n: 'بيبسي 1 لتر', q: 2 }], total: 2419, mode: 'دليفري' },
    { name: 'عمر الطيب', phone: '0114 620 3348', items: [{ n: 'تشيكن ماديرا باستا', q: 1 }, { n: 'كول سلو', q: 1 }], total: 345, mode: 'استلام من الفرع' },
  ];
  let simIdx = 0;

  $('#simOrder').addEventListener('click', () => {
    const p = SIM_POOL[simIdx % SIM_POOL.length];
    simIdx++;
    orders.unshift({ ...p, id: 'JUM-' + (nextOrderNum++), status: 0, time: 'الآن • طلب جديد' });
    renderOrders();
    toast('🔔 طلب جديد وصل من ' + p.name + '!');
  });

  /* ── التحكم السريع في المنيو ── */
  const DEFAULT_MENU = [
    { name: 'صينية ملوك جُميرا', cat: 'صواني جُميرا', emoji: '🍖', price: 2299, avail: true },
    { name: 'ساندوتش جُميرا ميكس', cat: 'شاورما', emoji: '🌯', price: 160, avail: true },
    { name: 'جُميرا برجر سبيشيال', cat: 'برجر', emoji: '🍔', price: 240, avail: true },
    { name: 'ميني بوت سيجنتشر', cat: 'ميني بوت', emoji: '🍲', price: 135, avail: true },
    { name: 'ريش غنم مشوية', cat: 'المشاوي', emoji: '🥩', price: 650, avail: false },
    { name: 'فطار جُميرا الملكي', cat: 'الفطار', emoji: '🍳', price: 265, avail: true },
  ];

  let menu;
  try {
    menu = JSON.parse(localStorage.getItem('jumirah-admin-menu') || 'null');
    if (!Array.isArray(menu)) throw 0;
  } catch { menu = structuredClone(DEFAULT_MENU); }

  const persistMenu = () => localStorage.setItem('jumirah-admin-menu', JSON.stringify(menu));

  function renderMenu() {
    $('#menuCtrl').innerHTML = menu.map((m, i) => `
      <div class="menu-row ${m.avail ? '' : 'is-off'}" data-row="${i}">
        <span class="m-emoji" aria-hidden="true">${m.emoji}</span>
        <div class="m-info">
          <div class="m-name">${m.name}</div>
          <div class="m-cat">${m.cat}</div>
        </div>
        <div class="price-edit">
          <input type="number" min="1" step="1" value="${m.price}" data-price="${i}"
                 aria-label="سعر ${m.name} بالجنيه">
          <span class="unit">ج.م</span>
        </div>
        <div class="avail-cell">
          <label class="switch">
            <input type="checkbox" data-avail="${i}" ${m.avail ? 'checked' : ''}>
            <span class="track"></span>
          </label>
          <span class="avail-txt ${m.avail ? 'on' : 'off'}">${m.avail ? 'متاح' : 'غير متاح حالياً'}</span>
        </div>
      </div>`).join('');
  }

  $('#menuCtrl').addEventListener('change', (e) => {
    const priceInput = e.target.closest('[data-price]');
    const availToggle = e.target.closest('[data-avail]');
    const row = e.target.closest('.menu-row');
    if (!row) return;
    const i = +row.dataset.row;

    if (priceInput) {
      const v = Math.round(+priceInput.value);
      if (!v || v < 1) {
        toast('السعر لازم يكون رقم أكبر من صفر ⚠️');
        priceInput.value = menu[i].price;
        return;
      }
      const old = menu[i].price;
      menu[i].price = v;
      persistMenu();
      row.classList.add('flash');
      setTimeout(() => row.classList.remove('flash'), 900);
      toast(`تم تحديث سعر «${menu[i].name}»: ${fmt(old)} ← ${fmt(v)} ج.م ✅`);
    }

    if (availToggle) {
      menu[i].avail = availToggle.checked;
      persistMenu();
      renderMenu();
      toast(menu[i].avail
        ? `«${menu[i].name}» رجعت متاحة على الموقع ✅`
        : `«${menu[i].name}» اتقفلت مؤقتاً — مش هتظهر للعملاء 🚫`);
    }
  });

  renderOrders();
  renderMenu();
}

/* ─── الإقلاع حسب الصفحة ────────────────────────────────────── */
const page = document.body.dataset.page;
if (page === 'customize') initCustomize();
else if (page === 'reservation') initReservation();
else if (page === 'admin') initAdmin();
