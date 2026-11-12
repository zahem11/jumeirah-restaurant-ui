/* ═══════════════════════════════════════════════════════════════
   JUMEIRÀH Restaurant & Cafe — منطق التطبيق
   القائمة • التصنيفات • السلة • أزرار الخدمة
   ═══════════════════════════════════════════════════════════════ */
'use strict';

/* ─── البيانات ──────────────────────────────────────────────── */
const CATS = [
  { id: 'all',       name: 'الكل',          emoji: '✨' },
  { id: 'trays',     name: 'صواني جُميرا',  emoji: '🍽️' },
  { id: 'grill',     name: 'المشاوي',        emoji: '🍖' },
  { id: 'pizza',     name: 'بيتزا',          emoji: '🍕' },
  { id: 'shawarma',  name: 'شاورما',         emoji: '🌯' },
  { id: 'burger',    name: 'برجر',           emoji: '🍔' },
  { id: 'minipot',   name: 'ميني بوت',       emoji: '🍲' },
  { id: 'pasta',     name: 'الباستا',        emoji: '🍝' },
  { id: 'diet',      name: 'وجبات دايت',     emoji: '🥗' },
  { id: 'breakfast', name: 'الفطار',         emoji: '🍳', note: '10ص - 1ظ' },
];

const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const PRODUCTS = [
  /* صواني جُميرا */
  {
    id: 'tray-molok', cat: 'trays', emoji: '🍖',
    name: 'صينية ملوك جُميرا',
    desc: 'كباب وكفتة وريش غنم، فراخ بانية، مكرونة بشاميل وأرز بالكسادة — تكفي من 8 إلى 10 أشخاص.',
    price: 2299, rating: 4.9, serves: 'تكفي 8-10 أشخاص',
    badge: 'الأكثر طلباً',
    img: IMG('photo-1544025162-d76694265947'),
  },
  {
    id: 'tray-lux', cat: 'trays', emoji: '🍽️',
    name: 'صينية جُميرا الفاخرة',
    desc: 'مشاوي مشكلة مع فراخ مشوية وأرز صنوبر وسلطات شرقية — تكفي من 5 إلى 6 أشخاص.',
    price: 1499, rating: 4.8, serves: 'تكفي 5-6 أشخاص',
    img: IMG('photo-1414235077428-338989a2e8c0'),
  },

  /* المشاوي */
  {
    id: 'grill-mix', cat: 'grill', emoji: '🍗',
    name: 'مشاوي مشكلة على الفحم',
    desc: 'كباب، كفتة، طاجن، وبانيه فراخ مع أرز وسلطة وسنج ريان.',
    price: 495, rating: 4.8, serves: 'تكفي شخصين',
    img: IMG('photo-1555939594-58d7cb561ad1'),
  },
  {
    id: 'grill-lamb', cat: 'grill', emoji: '🥩',
    name: 'ريش غنم مشوية',
    desc: 'ريش غنم طرية متتبلة بأعشاب جُميرا السرية، مشوية على الفحم مع صوص النعناع.',
    price: 650, rating: 4.9,
    img: IMG('photo-1546833999-b9f581a1996d'),
  },

  /* بيتزا */
  {
    id: 'pizza-jum', cat: 'pizza', emoji: '🍕',
    name: 'بيتزا جُميرا سبيشيال',
    desc: 'عجينة إيطالية رفيعة، موزاريلا مدخنة، مشاوي مشكلة، وصوص باربكيو ذهبي.',
    price: 275, rating: 4.7, cal: '950 سعره',
    img: IMG('photo-1513104890138-7c749659a591'),
  },
  {
    id: 'pizza-pep', cat: 'pizza', emoji: '🍕',
    name: 'بيتزا بيبروني',
    desc: 'الكلاسيك اللي مبيخيبش — بيبروني حار وموزاريلا تمطط مع صوص الطماطم الأصلي.',
    price: 220, rating: 4.6, cal: '880 سعره',
    img: IMG('photo-1565299624946-b28f40a0ae38'),
  },

  /* شاورما */
  {
    id: 'shaw-chicken', cat: 'shawarma', emoji: '🌯',
    name: 'ساندويتش شاورما فراخ',
    desc: 'شاورما فراخ طرية بصوص الثوم، طحينة، وبطاطس مقرمشة في عيش صاج.',
    price: 95, rating: 4.7, cal: '520 سعره',
    badge: 'قيمة ممتازة',
    img: IMG('photo-1633504581786-316c8002b1b9'),
  },
  {
    id: 'shaw-mix', cat: 'shawarma', emoji: '🌯',
    name: 'ساندوتش جُميرا ميكس',
    desc: 'شاورما مشكلة (فراخ + غنم) بصوص التومية — خصّص العيش والإضافات على كيفك.',
    price: 160, rating: 4.8, cal: '640 سعره',
    badge: 'قابل للتخصيص', custom: true,
    img: IMG('photo-1565299585323-38d6b0865b47'),
  },
  {
    id: 'shaw-meat', cat: 'shawarma', emoji: '🥙',
    name: 'صحن شاورما غنم',
    desc: 'شاورما غنم بالسمن البلدي مع أرز بالشعيرية وسلطة طحينة ومخلل.',
    price: 165, rating: 4.8, cal: '710 سعره',
    img: IMG('photo-1600891963935-9e9544094b04'),
  },

  /* برجر */
  {
    id: 'burg-spec', cat: 'burger', emoji: '🍔',
    name: 'جُميرا برجر سبيشيال',
    desc: 'لحم أنجوس مشوي، شيدر مدخن، بصل كراميل، وصوص جُميرا السري — مع بطاطس.',
    price: 240, rating: 4.9, cal: '850 سعره',
    badge: 'الأكثر طلباً',
    img: IMG('photo-1568901346375-23c9450c58cd'),
  },
  {
    id: 'burg-crispy', cat: 'burger', emoji: '🍔',
    name: 'تشيكن كرسبي برجر',
    desc: 'صدر فراخ مقرمش بطبقة ذهبية، كول سلو منعش، وصوص رانش — مع بطاطس.',
    price: 195, rating: 4.6, cal: '790 سعره',
    img: IMG('photo-1550547660-d9450f859349'),
  },

  /* ميني بوت */
  {
    id: 'pot-sign', cat: 'minipot', emoji: '🍲',
    name: 'ميني بوت سيجنتشر',
    desc: 'بوت صغير على كيفك — اختار البروتين والصوص والإضافات وابني طبقك بنفسك.',
    price: 135, rating: 4.8, cal: '620 سعره',
    badge: 'جديد',
    img: IMG('photo-1547592166-23ac45744acd'),
  },
  {
    id: 'pot-shaw', cat: 'minipot', emoji: '🍜',
    name: 'ميني بوت شاورما',
    desc: 'شاورما فراخ مع نودلز صاج وخضار سوتيه وصوص الثوم الحار.',
    price: 120, rating: 4.5, cal: '580 سعره',
    img: IMG('photo-1585032226651-759b368d7246'),
  },

  /* الباستا */
  {
    id: 'pasta-madeira', cat: 'pasta', emoji: '🍝',
    name: 'تشيكن ماديرا باستا',
    desc: 'صدر فرخ بصوص الماديرا والفطر مع باستا بيني كريمية وبارميزان مبشور.',
    price: 290, rating: 4.8, cal: '780 سعره',
    badge: 'اختيار الشيف',
    img: IMG('photo-1621996346565-e3dbc646d9a9'),
  },
  {
    id: 'pasta-arrab', cat: 'pasta', emoji: '🍝',
    name: 'بيني أرابياتا',
    desc: 'باستا حارة بصوص الطماطم الطازج والثوم والريحان — نباتية 100%.',
    price: 210, rating: 4.5, cal: '610 سعره',
    img: IMG('photo-1563379926898-05f4575a45d8'),
  },

  /* وجبات دايت */
  {
    id: 'diet-quinoa', cat: 'diet', emoji: '🥗',
    name: 'سلطة الكينوا بالأفوكادو',
    desc: 'كينوا، أفوكادو طازج، جرجير، رمان، وصوص الليمون وزيت الزيتون.',
    price: 185, rating: 4.6, cal: '390 سعره',
    badge: 'دايت',
    img: IMG('photo-1512621776951-a57141f2eefd'),
  },
  {
    id: 'diet-chicken', cat: 'diet', emoji: '🥗',
    name: 'صدر فرخ مشوي بالخضار',
    desc: 'صدر فرخ مشوي بتتبلة الأعشاب مع خضار سوتيه وبطاطس حلوة.',
    price: 210, rating: 4.7, cal: '450 سعره',
    badge: 'دايت',
    img: IMG('photo-1546069901-ba9599a7e63c'),
  },

  /* الفطار */
  {
    id: 'bf-royal', cat: 'breakfast', emoji: '🍳',
    name: 'فطار جُميرا الملكي',
    desc: 'فول بالسمنة البلدية، بيض بالبسطرمة، طعمية، جبنة قريش، وعيش بلدي سخن.',
    price: 265, rating: 4.9, serves: 'يكفي شخصين',
    badge: 'الأكثر طلباً', timeBadge: 'من 10ص لـ 1ظ',
    img: IMG('photo-1533089860892-a7c6f0a88666'),
  },
  {
    id: 'bf-benedict', cat: 'breakfast', emoji: '🍳',
    name: 'بيض بنديكت',
    desc: 'مافن بالزبدة، بيض بوسكاليدا، وصوص هولندي مع بطاطس هاش براون.',
    price: 155, rating: 4.7, cal: '560 سعره',
    timeBadge: 'من 10ص لـ 1ظ',
    img: IMG('photo-1525351484163-7529414344d8'),
  },
];

/* ─── الحالة ────────────────────────────────────────────────── */
const fmt = (n) => n.toLocaleString('en-US');
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const state = {
  cat: 'all',
  mode: 'delivery',
  cart: new Map(),   // id → qty
  favs: new Set(),
};

/* استرجاع السلة والمفضلة من التخزين المحلي */
try {
  const savedCart  = JSON.parse(localStorage.getItem('jumirah-cart') || '[]');
  savedCart.forEach(([id, qty]) => state.cart.set(id, qty));
  const savedFavs = JSON.parse(localStorage.getItem('jumirah-favs') || '[]');
  savedFavs.forEach((id) => state.favs.add(id));
} catch { /* تجاهل */ }

const persist = () => {
  localStorage.setItem('jumirah-cart', JSON.stringify([...state.cart]));
  localStorage.setItem('jumirah-favs', JSON.stringify([...state.favs]));
};

/* ─── التصنيفات ─────────────────────────────────────────────── */
function renderCategories() {
  const track = $('#categoriesTrack');
  track.innerHTML = CATS.map((c) => `
    <button class="cat-chip ${c.id === state.cat ? 'is-active' : ''}" data-cat="${c.id}">
      <span aria-hidden="true">${c.emoji}</span> ${c.name}
      ${c.note ? `<span class="cat-note">${c.note}</span>` : ''}
    </button>
  `).join('');
}

/* ─── كروت الأصناف ──────────────────────────────────────────── */
function dishCard(p, i) {
  const badges = [];
  if (p.badge)     badges.push(`<span class="badge">${p.badge}</span>`);
  if (p.timeBadge) badges.push(`<span class="badge badge-outline">🕒 ${p.timeBadge}</span>`);

  const meta = [`<span class="rating">★ ${p.rating}</span>`];
  if (p.cal)   meta.push(`<span>🔥 ${p.cal}</span>`);
  if (p.serves) meta.push(`<span>👥 ${p.serves}</span>`);

  const inCart = state.cart.get(p.id) || 0;

  return `
  <article class="dish-card" style="animation-delay:${Math.min(i, 8) * 55}ms">
    <div class="dish-media" data-emoji="${p.emoji}">
      ${badges.length ? `<div class="dish-badges">${badges.join('')}</div>` : ''}
      <button class="dish-fav ${state.favs.has(p.id) ? 'is-fav' : ''}" data-fav="${p.id}"
              aria-label="إضافة ${p.name} للمفضلة" title="المفضلة">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="${state.favs.has(p.id) ? 'currentColor' : 'none'}"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">
    </div>
    <div class="dish-body">
      <h3 class="dish-name">${p.name}</h3>
      <p class="dish-desc">${p.desc}</p>
      <div class="dish-meta">${meta.map((m) => `<span>${m}</span>`).join('')}</div>
      <div class="dish-foot">
        <span class="dish-price">${fmt(p.price)} <small>ج.م</small></span>
        <button class="add-btn ${inCart ? 'in-cart' : ''}" data-add="${p.id}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="add-label">${inCart ? `في السلة (${inCart})` : 'أضف للسلة'}</span>
        </button>
      </div>
    </div>
  </article>`;
}

function renderMenu() {
  const list = state.cat === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.cat === state.cat);

  $('#menuGrid').innerHTML = list.map(dishCard).join('');
  $('#menuEmpty').hidden = list.length > 0;
}

/* ─── السلة ─────────────────────────────────────────────────── */
function cartCount()   { let n = 0; state.cart.forEach((q) => (n += q)); return n; }
function cartSubtotal() {
  let sum = 0;
  state.cart.forEach((q, id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) sum += p.price * q;
  });
  return sum;
}

function syncCartUI() {
  /* الشارة والشريط السفلي */
  const n = cartCount();
  const badge = $('#cartBadge');
  badge.hidden = n === 0;
  badge.textContent = n;

  const bar = $('#cartBar');
  bar.hidden = n === 0;
  $('#cartBarCount').textContent = `${n} ${n === 1 ? 'صنف' : 'أصناف'}`;
  $('#cartBarTotal').textContent = `${fmt(cartSubtotal())} ج.م`;

  /* الملخص */
  $('#sumSubtotal').textContent = `${fmt(cartSubtotal())} ج.م`;
  $('#sumTotal').textContent = `${fmt(cartSubtotal())} ج.م`;

  /* أزرار الكروت */
  $$('.add-btn[data-add]').forEach((btn) => {
    const q = state.cart.get(btn.dataset.add) || 0;
    btn.classList.toggle('in-cart', q > 0);
    $('.add-label', btn).textContent = q > 0 ? `في السلة (${q})` : 'أضف للسلة';
  });

  renderDrawerItems();
  persist();
}

function renderDrawerItems() {
  const box = $('#drawerItems');
  if (state.cart.size === 0) {
    box.innerHTML = `
      <div class="cart-empty">
        <span class="empty-ico" aria-hidden="true">🛒</span>
        <p><strong>سلتك فاضية لسه!</strong><br>زوّقها من قائمة جُميرا وأول طبق يناديك ✨</p>
      </div>`;
    return;
  }

  box.innerHTML = [...state.cart.entries()].map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return '';
    return `
    <div class="cart-item">
      <div class="cart-item-media" data-emoji="${p.emoji}">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${p.name}</p>
        <p class="cart-item-price">${fmt(p.price)} ج.م × ${qty} = <strong>${fmt(p.price * qty)} ج.م</strong></p>
      </div>
      <div class="cart-item-side">
        <div class="qty-stepper">
          <button data-inc="${id}" aria-label="زيادة الكمية">+</button>
          <span class="qty">${qty}</span>
          <button data-dec="${id}" aria-label="تقليل الكمية">−</button>
        </div>
        <button class="cart-item-remove" data-remove="${id}">حذف</button>
      </div>
    </div>`;
  }).join('');
}

function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  /* الأصناف القابلة للتخصيص تفتح صفحة التخصيص بدل الإضافة المباشرة */
  if (p.custom) {
    window.location.href = 'customize.html';
    return;
  }
  state.cart.set(id, (state.cart.get(id) || 0) + 1);
  syncCartUI();
  toast(`تمت إضافة «${p.name}» إلى السلة <span class="t-check">✓</span>`);
}

/* ─── التوست ────────────────────────────────────────────────── */
let toastTimer;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

/* ─── الدرج ─────────────────────────────────────────────────── */
function openDrawer() {
  $('#cartDrawer').classList.add('is-open');
  $('#drawerOverlay').hidden = false;
  requestAnimationFrame(() => $('#drawerOverlay').classList.add('is-open'));
  $('#cartDrawer').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  $('#cartDrawer').classList.remove('is-open');
  const ov = $('#drawerOverlay');
  ov.classList.remove('is-open');
  setTimeout(() => { ov.hidden = true; }, 260);
  $('#cartDrawer').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ─── أزرار الخدمة (التابات) ────────────────────────────────── */
const MODE_LABEL = {
  delivery:    '🛵 توصيل',
  pickup:      '🏬 استلام من الفرع',
  reservation: '🍽️ حجز طاولة',
};

function setMode(mode) {
  state.mode = mode;
  $$('.service-tab').forEach((t) => {
    const active = t.dataset.panel === mode;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
  $$('.service-body').forEach((p) => { p.hidden = p.id !== `panel-${mode}`; });
  $('#drawerMode').textContent = MODE_LABEL[mode];
}

/* ─── الأحداث ────────────────────────────────────────────────── */
document.addEventListener('click', (e) => {
  const t = e.target;

  /* التصنيفات */
  const chip = t.closest('.cat-chip');
  if (chip) {
    state.cat = chip.dataset.cat;
    $$('.cat-chip').forEach((c) => c.classList.toggle('is-active', c === chip));
    renderMenu();
    return;
  }

  /* إضافة للسلة */
  const addBtn = t.closest('[data-add]');
  if (addBtn) { addToCart(addBtn.dataset.add); return; }

  /* المفضلة */
  const favBtn = t.closest('[data-fav]');
  if (favBtn) {
    const id = favBtn.dataset.fav;
    if (state.favs.has(id)) state.favs.delete(id);
    else state.favs.add(id);
    favBtn.classList.toggle('is-fav', state.favs.has(id));
    const heart = $('svg', favBtn);
    heart.setAttribute('fill', state.favs.has(id) ? 'currentColor' : 'none');
    persist();
    return;
  }

  /* كمية/حذف في الدرج */
  const inc = t.closest('[data-inc]');
  if (inc) {
    const id = inc.dataset.inc;
    state.cart.set(id, state.cart.get(id) + 1);
    syncCartUI();
    return;
  }
  const dec = t.closest('[data-dec]');
  if (dec) {
    const id = dec.dataset.dec;
    const q = state.cart.get(id) - 1;
    q <= 0 ? state.cart.delete(id) : state.cart.set(id, q);
    syncCartUI();
    return;
  }
  const rem = t.closest('[data-remove]');
  if (rem) {
    state.cart.delete(rem.dataset.remove);
    syncCartUI();
    return;
  }

  /* التابات */
  const tab = t.closest('.service-tab');
  if (tab) { setMode(tab.dataset.panel); return; }

  /* الدرج */
  if (t.closest('#cartToggle') || t.closest('#cartBarBtn')) { openDrawer(); return; }
  if (t.closest('#cartClose') || t.closest('#drawerOverlay')) { closeDrawer(); return; }

  /* إتمام الطلب */
  if (t.closest('#checkoutBtn')) {
    if (state.cart.size === 0) { toast('سلتك فاضية — أضف صنف الأول 🙂'); return; }
    toast('شكراً لطلبك! 🎉 هنكلمك للتأكيد خلال دقايق');
    closeDrawer();
    return;
  }

  /* أزرار اللوحات */
  const panel = t.closest('.service-body');
  if (panel) {
    if (panel.id === 'panel-delivery') {
      const addr = $('#deliveryAddress').value.trim();
      if (!addr) { toast('اكتب عنوانك الأول عشان نجيلك 📍'); $('#deliveryAddress').focus(); return; }
      toast('عنوانك اتسجل! القائمة جاهزة — اطلب براحتك 👇');
    } else if (panel.id === 'panel-pickup') {
      toast(`تم! طلبك هيكون جاهز في ${$('#pickupBranch').value.split('—')[0].trim()} 🏬`);
    } else {
      /* شاشة الحجز الكاملة */
      window.location.href = 'reservation.html';
      return;
    }
    $('#menu').scrollIntoView({ behavior: 'smooth' });
  }
});

/* إغلاق الدرج بمفتاح Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

/* ─── الإقلاع ────────────────────────────────────────────────── */
renderCategories();
renderMenu();
setMode('delivery');
syncCartUI();
