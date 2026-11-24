// Token Radar's dashboard, model radar-3. It reads window.RADAR (written beside dashboard/ by
// main.ts) and renders the ranked board, a filterable table, a per-protocol detail drawer with the
// model's own inputs and the protocol's farm plan. No network: every byte it shows is in data.js.
//
// The farm plan a row shows is the one board.json carries for that row, read from data.js. The page
// does not recompute the plan, so the page and the board cannot drift apart; it does recompute the
// implied value, and says so when the two numbers disagree.
(function () {
  'use strict';

  var DATA = window.RADAR;
  if (!DATA) return;
  var app = document.getElementById('board');
  var state = { q: '', category: 'all', chain: 'all', tab: 'pre-token', sort: 'implied', dir: -1, selected: null };

  var usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  function fmtUsd(n) {
    if (n === null || n === undefined || !isFinite(n)) return 'n/a';
    if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (Math.abs(n) >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return usd.format(n);
  }
  function fmtPct(n) {
    if (n === null || n === undefined || !isFinite(n)) return 'n/a';
    return (n > 0 ? '+' : '') + n.toFixed(2) + '%';
  }
  function fmtAge(days) {
    if (days === null || days === undefined) return 'unknown';
    if (days >= 365) return (days / 365).toFixed(1) + 'y';
    return Math.max(0, Math.round(days)) + 'd';
  }
  // The model in one function: the page recomputes a row from the snapshot figures and checks the
  // number board.json carries, so the page's code and the board's data are visibly the same arithmetic.
  function impliedOf(row, model) {
    var growth = Math.min(model.growth_cap, Math.max(model.growth_floor, row.change_7d === null || row.change_7d === undefined ? 0 : row.change_7d));
    var growthMult = 1 + (growth / 100) * model.growth_weight;
    var age = row.age_days === null || row.age_days === undefined ? model.unknown_age_days : row.age_days;
    var maturity = model.maturity_floor + (Math.min(Math.max(age, 0), model.maturity_days) / model.maturity_days) * model.maturity_range;
    return Math.max(1, Math.round(row.tvl_usd * model.base_multiple * growthMult * maturity));
  }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined) continue;
      if (Array.isArray(child)) child.forEach(function (c) { if (c) node.appendChild(c); });
      else if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else node.appendChild(child);
    }
    return node;
  }

  function readHash() {
    var hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    var params = new URLSearchParams(hash);
    if (params.get('q')) state.q = params.get('q');
    if (params.get('p')) state.selected = params.get('p');
    if (params.get('category')) state.category = params.get('category');
    if (params.get('chain')) state.chain = params.get('chain');
  }
  function writeHash() {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.chain !== 'all') params.set('chain', state.chain);
    if (state.selected) params.set('p', state.selected);
    var next = params.toString();
    if (next) window.history.replaceState(null, '', '#' + next);
    else window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  function rows() {
    var q = state.q.trim().toLowerCase();
    return DATA.rows.filter(function (r) {
      if (state.category !== 'all' && r.category !== state.category) return false;
      if (state.chain !== 'all' && (r.chains || []).indexOf(state.chain) < 0) return false;
      if (!q) return true;
      var hay = [r.name, r.slug, r.category, (r.chains || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  }
  function sortedRows(list) {
    var key = state.sort;
    return list.slice().sort(function (a, b) {
      var av, bv;
      if (key === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
      else if (key === 'tvl') { av = a.tvl_usd; bv = b.tvl_usd; }
      else if (key === 'growth') { av = a.change_7d === null ? -Infinity : a.change_7d; bv = b.change_7d === null ? -Infinity : b.change_7d; }
      else if (key === 'age') { av = a.age_days === null ? Infinity : a.age_days; bv = b.age_days === null ? Infinity : b.age_days; }
      else { av = a.implied_value_usd; bv = b.implied_value_usd; }
      if (av < bv) return -state.dir;
      if (av > bv) return state.dir;
      return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;
    });
  }

  function header() {
    return el('header', { class: 'top' },
      el('div', { class: 'brand' }, el('span', { class: 'mark' }), el('span', { class: 'brand-name', text: 'Token Radar' })),
      el('div', { class: 'top-meta' },
        el('span', { text: 'Snapshot ' + DATA.as_of }),
        el('span', { text: 'DefiLlama protocol index' }),
        el('span', { text: DATA.model_version + ' model' })
      )
    );
  }

  function lede() {
    return el('section', { class: 'lede' },
      el('div', null,
        el('h1', { text: DATA.watchlist_size + ' watchlist protocols, ranked by implied value' }),
        el('p', { text: 'This board is not a largest-TVL ranking. It looks for the next batch of DeFi infrastructure that has already accumulated real capital, can keep operating, and has a basis for potential token value, among the protocols that record no token yet. A high TVL alone does not mean a high future token value.' }),
        el('p', { text: 'The watchlist is the floor: every protocol with at least $' + Math.round(DATA.floor_usd / 1e6) + 'M of TVL and no token on record. The early radar adds ' + DATA.early_size + ' pre-token protocols below that floor. Implied value is a model, not a promise and not a price.' })
      )
    );
  }

  function stats() {
    var max = DATA.rows.length ? DATA.rows[0].implied_value_usd : 0;
    return el('section', { class: 'stats', 'aria-label': 'Core figures' },
      el('div', { class: 'stat' }, el('span', { text: 'Protocols in the snapshot' }), el('b', { text: String(DATA.total_protocols) })),
      el('div', { class: 'stat' }, el('span', { text: 'Protocols recording no token' }), el('b', { text: String(DATA.pre_token_count) })),
      el('div', { class: 'stat' }, el('span', { text: 'Watchlist covered' }), el('b', { text: DATA.watchlist_size + ' / ' + DATA.watchlist_size })),
      el('div', { class: 'stat' }, el('span', { text: 'Highest implied value' }), el('b', { text: fmtUsd(max) }))
    );
  }

  function topFive() {
    var top = DATA.rows.slice(0, 5);
    if (top.length === 0) return null;
    var max = top[0].implied_value_usd || 1;
    return el('section', { class: 'panel top5' },
      el('h2', { text: 'Top 5 by implied value' }),
      el('ol', { class: 'top5-list' }, top.map(function (r) {
        return el('li', { 'class': r.rank === 1 ? 'top1' : null },
          el('span', { class: 'rank-badge', text: String(r.rank) }),
          el('div', { class: 'name' },
            el('b', { text: r.name }),
            el('span', { class: 'sub', text: (r.category || 'Other') + ' · ' + fmtUsd(r.tvl_usd) + ' TVL · ' + fmtPct(r.change_7d) + ' in 7 days' })
          ),
          el('div', { class: 'implied' },
            el('div', { class: 'bar', 'aria-hidden': 'true' }, el('i', { style: 'width:' + Math.max(3, Math.round((r.implied_value_usd / max) * 100)) + '%' })),
            el('span', { class: 'num', text: fmtUsd(r.implied_value_usd) })
          ),
          el('button', { class: 'button', type: 'button', text: 'Details', onclick: function () { openDetail(r.slug); } })
        );
      }))
    );
  }

  function controls() {
    var categories = Array.from(new Set(DATA.rows.map(function (r) { return r.category || 'Other'; }))).sort();
    var chains = Array.from(new Set(DATA.rows.reduce(function (acc, r) { return acc.concat(r.chains || []); }, []))).sort();
    var search = el('input', { type: 'search', id: 'q', placeholder: 'Search name, category or chain', value: state.q, 'aria-label': 'Search the board' });
    search.addEventListener('input', function () { state.q = search.value; writeHash(); render(); });
    var select = el('select', { id: 'category', 'aria-label': 'Filter by category' },
      el('option', { value: 'all', text: 'All categories' }),
      categories.map(function (c) { return el('option', { value: c, text: c, selected: c === state.category ? 'selected' : null }); })
    );
    select.addEventListener('change', function () { state.category = select.value; writeHash(); render(); });
    var chainSelect = el('select', { id: 'chain', 'aria-label': 'Filter by chain' },
      el('option', { value: 'all', text: 'All chains' }),
      chains.map(function (c) { return el('option', { value: c, text: c, selected: c === state.chain ? 'selected' : null }); })
    );
    chainSelect.addEventListener('change', function () { state.chain = chainSelect.value; writeHash(); render(); });
    var pre = el('button', { type: 'button', 'aria-pressed': state.tab === 'pre-token' ? 'true' : 'false', text: 'Pre-token', onclick: function () { state.tab = 'pre-token'; render(); } });
    var live = el('button', { type: 'button', 'aria-pressed': state.tab === 'live' ? 'true' : 'false', text: 'Live token', onclick: function () { state.tab = 'live'; render(); } });
    return el('div', { class: 'controls' },
      el('div', { class: 'field' }, el('label', { for: 'q', text: 'Search' }), search),
      el('div', { class: 'field' }, el('label', { for: 'category', text: 'Category' }), select),
      el('div', { class: 'field' }, el('label', { for: 'chain', text: 'Chain' }), chainSelect),
      el('div', { class: 'field' }, el('span', { class: 'sub', text: 'Token status' }), el('div', { class: 'tabs' }, pre, live)),
      el('span', { class: 'count', text: state.tab === 'pre-token' ? rows().length + ' rows shown' : DATA.live.length + ' live-token protocols' })
    );
  }

  function sortHeader(key, label) {
    return el('th', { scope: 'col' },
      el('button', { type: 'button', onclick: function () { if (state.sort === key) state.dir = -state.dir; else { state.sort = key; state.dir = -1; } render(); } },
        label,
        state.sort === key ? el('span', { 'aria-hidden': 'true', text: state.dir < 0 ? ' v' : ' ^' }) : null
      )
    );
  }

  function boardTable() {
    var list = sortedRows(rows());
    if (list.length === 0) {
      return el('div', { class: 'panel' }, el('div', { class: 'empty' },
        el('h2', { text: 'No protocol matches that filter' }),
        el('p', { text: 'Clear the search or pick another category to see the board again.' }),
        el('button', { class: 'button primary', type: 'button', text: 'Clear filters', onclick: function () { state.q = ''; state.category = 'all'; state.chain = 'all'; writeHash(); render(); } })
      ));
    }
    var max = list[0].implied_value_usd || 1;
    var tbody = el('tbody');
    list.forEach(function (r) {
      var growth = r.change_7d === null ? 'n/a' : fmtPct(r.change_7d);
      var growthClass = r.change_7d === null ? '' : r.change_7d >= 0 ? 'pos' : 'neg';
      var tr = el('tr', {
        'class': r.rank === 1 ? 'top1' : null,
        'data-selected': state.selected === r.slug ? 'true' : 'false',
        tabindex: '0',
        onclick: function () { openDetail(r.slug); },
        onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(r.slug); } }
      },
        el('td', { class: 'num' }, el('span', { class: 'rank-badge', text: String(r.rank) })),
        el('td', null, el('div', { class: 'name' },
          el('b', { text: r.name }),
          el('span', { class: 'sub', text: (r.category || 'Other') + ' on ' + (r.chains && r.chains.length ? r.chains.slice(0, 2).join(', ') : 'an unnamed chain') })
        )),
        el('td', { class: 'num', text: fmtUsd(r.tvl_usd) }),
        el('td', { class: 'num ' + growthClass, text: growth }),
        el('td', { class: 'num', text: fmtAge(r.age_days) }),
        el('td', null, el('div', { class: 'implied' },
          el('div', { class: 'bar', 'aria-hidden': 'true' }, el('i', { style: 'width:' + Math.max(3, Math.round((r.implied_value_usd / max) * 100)) + '%' })),
          el('span', { class: 'num', text: fmtUsd(r.implied_value_usd) })
        )),
        el('td', null, el('span', { class: 'status', text: 'no token' }))
      );
      tbody.appendChild(tr);
    });
    return el('div', { class: 'panel' },
      el('div', { class: 'table-wrap' },
        el('table', null,
          el('caption', { class: 'sub', text: 'Pre-token protocols, strongest implied value first. Select a row for its model and farm plan.' }),
          el('thead', null, el('tr', null,
            sortHeader('implied', 'Rank'),
            sortHeader('name', 'Protocol'),
            sortHeader('tvl', 'TVL'),
            sortHeader('growth', '7d'),
            sortHeader('age', 'Age'),
            sortHeader('implied', 'Implied value'),
            el('th', { scope: 'col', text: 'Token' })
          )),
          tbody
        )
      )
    );
  }

  function liveTable() {
    var tbody = el('tbody');
    DATA.live.forEach(function (r) {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'num', text: 'live' }),
        el('td', null, el('div', { class: 'name' }, el('b', { text: r.name }), el('span', { class: 'sub', text: (r.category || 'Other') + ' on ' + (r.chains && r.chains.length ? r.chains.slice(0, 2).join(', ') : 'an unnamed chain') }))),
        el('td', { class: 'num', text: fmtUsd(r.tvl_usd) }),
        el('td', { class: 'num ' + (r.change_7d !== null && r.change_7d >= 0 ? 'pos' : 'neg'), text: fmtPct(r.change_7d) }),
        el('td', { class: 'num', text: fmtUsd(r.mcap_usd) }),
        el('td', null, el('span', { class: 'status', text: 'already trades' }))
      ));
    });
    return el('div', { class: 'panel' },
      el('div', { class: 'table-wrap' },
        el('table', null,
          el('caption', { class: 'sub', text: 'Token live: these protocols already trade, so their market cap is a fact, not a model. They are set aside from the pre-token ranking.' }),
          el('thead', null, el('tr', null, el('th', { scope: 'col', text: 'Status' }), el('th', { scope: 'col', text: 'Protocol' }), el('th', { scope: 'col', text: 'TVL' }), el('th', { scope: 'col', text: '7d' }), el('th', { scope: 'col', text: 'Market cap' }), el('th', { scope: 'col', text: 'Token' }))),
          tbody
        )
      )
    );
  }

  function sectors() {
    var byCat = {};
    DATA.rows.forEach(function (r) {
      var c = r.category || 'Other';
      if (!byCat[c]) byCat[c] = { rows: 0, tvl: 0, implied: 0 };
      byCat[c].rows++;
      byCat[c].tvl += r.tvl_usd;
      byCat[c].implied += r.implied_value_usd;
    });
    var total = DATA.rows.reduce(function (s, r) { return s + r.implied_value_usd; }, 0) || 1;
    var list = Object.keys(byCat).map(function (c) {
      return { category: c, rows: byCat[c].rows, tvl: byCat[c].tvl, implied: byCat[c].implied, share: byCat[c].implied / total };
    }).sort(function (a, b) { return b.implied - a.implied; });
    var shown = list.slice(0, 10);
    var rest = list.slice(10);
    if (rest.length > 0) {
      shown.push({
        category: 'Other (' + rest.length + ' sectors)',
        rows: rest.reduce(function (s, x) { return s + x.rows; }, 0),
        tvl: rest.reduce(function (s, x) { return s + x.tvl; }, 0),
        implied: rest.reduce(function (s, x) { return s + x.implied; }, 0),
        share: rest.reduce(function (s, x) { return s + x.share; }, 0)
      });
    }
    return el('section', { class: 'panel sectors' },
      el('h2', { text: 'Where the implied value sits' }),
      el('p', { class: 'sub', text: 'Implied value by sector. Risk management vaults, capital allocators and real-world-asset infrastructure hold most of it: the board is finding the plumbing that already holds capital, not the loudest token.' }),
      el('div', { class: 'sector-list' }, shown.map(function (s) {
        return el('div', { class: 'sector' },
          el('div', { class: 'sector-head' },
            el('b', { text: s.category }),
            el('span', { class: 'sub', text: s.rows + ' protocols · ' + fmtUsd(s.tvl) + ' TVL' }),
            el('span', { class: 'num', text: (s.share * 100).toFixed(1) + '%' })
          ),
          el('div', { class: 'bar wide', 'aria-hidden': 'true' }, el('i', { style: 'width:' + Math.max(2, Math.round(s.share * 100)) + '%' }))
        );
      }))
    );
  }

  function controlGroup() {
    var median = DATA.control_median;
    var control = DATA.control || [];
    return el('section', { class: 'panel control' },
      el('h2', { text: 'The issued-token control group' }),
      el('p', { class: 'sub', text: 'The base multiple ' + DATA.model.base_multiple + ' is not a guess. It is the median market-cap-to-TVL ratio of the ' + control.length + ' protocols in this snapshot that already trade and hold at least $' + Math.round(DATA.floor_usd / 1e6) + 'M of TVL. Their median ratio is ' + median.toFixed(3) + '. A token is worth what the market already pays for one.' }),
      el('div', { class: 'table-wrap plain' },
        el('table', null,
          el('caption', { class: 'sub', text: 'Every protocol in the control group, strongest ratio first. The median row is the market\'s own multiple.' }),
          el('thead', null, el('tr', null,
            el('th', { scope: 'col', text: 'Protocol' }),
            el('th', { scope: 'col', text: 'Category' }),
            el('th', { scope: 'col', text: 'TVL' }),
            el('th', { scope: 'col', text: 'Market cap' }),
            el('th', { scope: 'col', text: 'Mcap / TVL' })
          )),
          el('tbody', null, control.map(function (c) {
            return el('tr', null,
              el('td', null, el('b', { text: c.name })),
              el('td', { text: c.category || 'Other' }),
              el('td', { class: 'num', text: fmtUsd(c.tvl_usd) }),
              el('td', { class: 'num', text: fmtUsd(c.mcap_usd) }),
              el('td', { class: 'num', text: c.ratio.toFixed(3) })
            );
          }))
        )
      )
    );
  }

  function modelPanel() {
    var m = DATA.model;
    return el('section', { class: 'panel model' },
      el('h2', { text: 'How implied value is computed' }),
      el('p', { class: 'sub', text: 'Every row is scored by one function of the snapshot figures: protocol maturity, capital scale and growth quality. No protocol name is special-cased, and no row is hand-picked. Category is used for relative ranking and display, never as a multiplier on one sector.' }),
      el('div', { class: 'formula' },
        'implied = round( tvl_usd x ' + m.base_multiple + ' x (1 + clamp(change_7d, ' + m.growth_floor + ', ' + m.growth_cap + ') / 100 x ' + m.growth_weight + ') x (' + m.maturity_floor + ' + min(age_days, ' + m.maturity_days + ') / ' + m.maturity_days + ' x ' + m.maturity_range + ') )'
      ),
      el('p', { class: 'sub', text: 'The base multiple ' + m.base_multiple + ' is the median market-cap-to-TVL ratio of the ' + (DATA.control || []).length + ' protocols in this snapshot that already trade and hold at least $50M of TVL (median ' + DATA.control_median.toFixed(3) + ', shown in the control group above). Growth is dampened on purpose: one week of TVL swing moves a valuation by at most 12%, so momentum matters without overwhelming size, and a short-term inflow is not mistaken for lasting value. Age is the time since the protocol was first listed, the best record of how long it has run with no token; it earns from ' + m.maturity_floor + ' up to 1.00 over ' + m.maturity_days + ' days, and an unlisted age uses ' + m.unknown_age_days + ' days. The early radar is every pre-token protocol below the watchlist floor, by TVL, and the live-token protocols are set aside with their market caps shown.' }),
      el('p', { class: 'warn', text: 'Implied value is a proxy model built from a historical sample. It is not a prediction of a token\'s actual fully diluted value, and it does not predict whether or when a protocol issues a token.' })
    );
  }

  var dialog = el('dialog', { class: 'detail', id: 'detail', 'aria-labelledby': 'detail-title' });
  dialog.addEventListener('close', function () { state.selected = null; writeHash(); });

  function openDetail(slug) {
    var row = DATA.rows.filter(function (r) { return r.slug === slug; })[0];
    if (!row) return;
    state.selected = slug;
    writeHash();
    dialog.textContent = '';
    var steps = row.farm_steps || [];
    var budget = row.budget || { min_cost_usd: 0, recommended_usd: 0, total_days: 0 };
    var growthClamped = Math.min(DATA.model.growth_cap, Math.max(DATA.model.growth_floor, row.change_7d === null || row.change_7d === undefined ? 0 : row.change_7d));
    dialog.appendChild(el('div', { class: 'detail-head' },
      el('div', null,
        el('span', { class: 'brand-name', text: 'Rank ' + row.rank + ' of ' + DATA.board_size }),
        el('h2', { id: 'detail-title', text: row.name }),
        el('p', { class: 'sub', text: (row.category || 'Other') + ' on ' + (row.chains && row.chains.length ? row.chains.join(', ') : 'an unnamed chain') })
      ),
      el('button', { class: 'close', type: 'button', 'aria-label': 'Close details', text: 'Close', onclick: function () { dialog.close(); } })
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Protocol' }),
      el('div', { class: 'equation' },
        el('div', null, el('span', { text: 'Category' }), el('b', { text: row.category || 'Other' })),
        el('div', null, el('span', { text: 'Chains' }), el('b', { text: (row.chains && row.chains.length ? row.chains.join(', ') : 'an unnamed chain') })),
        el('div', null, el('span', { text: 'First listed' }), el('b', { text: row.listed_at || 'unknown' })),
        el('div', null, el('span', { text: 'TVL' }), el('b', { class: 'num', text: fmtUsd(row.tvl_usd) })),
        el('div', null, el('span', { text: 'Age with no token' }), el('b', { class: 'num', text: fmtAge(row.age_days) })),
        el('div', null, el('span', { text: 'Token status' }), el('b', { text: 'records no token' }))
      )
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Implied value, taken apart' }),
      el('div', { class: 'equation' },
        el('div', null, el('span', { text: 'TVL' }), el('b', { class: 'num', text: fmtUsd(row.tvl_usd) })),
        el('div', null, el('span', { text: 'Base multiple' }), el('b', { class: 'num', text: String(DATA.model.base_multiple) })),
        el('div', null, el('span', { text: 'Base value (TVL x multiple)' }), el('b', { class: 'num', text: fmtUsd(row.tvl_usd * DATA.model.base_multiple) })),
        el('div', null, el('span', { text: 'Seven-day growth, clamped' }), el('b', { class: 'num', text: fmtPct(growthClamped) })),
        el('div', null, el('span', { text: 'Growth multiplier' }), el('b', { class: 'num', text: String(row.growth_multiplier) })),
        el('div', null, el('span', { text: 'Maturity multiplier' }), el('b', { class: 'num', text: String(row.maturity_multiplier) })),
        el('div', null, el('span', { text: 'Implied value' }), el('b', { class: 'num', text: fmtUsd(row.implied_value_usd) }))
      ),
      el('p', { class: 'sub', text: 'Model ' + DATA.model_version + ': the same function scores every protocol. The page recomputes this row as ' + fmtUsd(impliedOf(row, DATA.model)) + (impliedOf(row, DATA.model) === row.implied_value_usd ? ', the same number board.json carries.' : ', which differs from the board: the data would be stale.') + ' This is an estimate, not a price.' })
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Farm plan' }),
      el('ol', { class: 'steps' }, steps.map(function (s) {
        var at = s.indexOf(' Cost: ');
        var action = at >= 0 ? s.slice(0, at) : s;
        var tail = at >= 0 ? s.slice(at + 1) : '';
        return el('li', null, el('b', { text: action }), el('span', { class: 'cost', text: tail }));
      }))
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Budget for this plan' }),
      el('div', { class: 'equation' },
        el('div', null, el('span', { text: 'Minimum cost' }), el('b', { class: 'num', text: '$' + budget.min_cost_usd })),
        el('div', null, el('span', { text: 'Recommended budget' }), el('b', { class: 'num', text: '$' + budget.recommended_usd })),
        el('div', null, el('span', { text: 'Estimated total time' }), el('b', { class: 'num', text: budget.total_days + ' days' }))
      ),
      el('p', { class: 'sub', text: 'Estimates for the plan above: the minimum starts the position, the recommended amount runs the whole plan including the second action and weekly gas. Exit by unwinding the position and withdrawing; never pay anyone to claim a reward.' })
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Risk' }),
      el('p', { text: 'This protocol records no token in the snapshot. That is not proof it has none, and no token does not mean one will be issued. Interacting with a protocol does not guarantee an airdrop, and a points program, where one exists, is not a promise of a token.' })
    ));
    dialog.appendChild(el('section', { class: 'detail-section' },
      el('h3', { text: 'Data' }),
      el('div', { class: 'equation' },
        el('div', null, el('span', { text: 'Snapshot date' }), el('b', { text: DATA.as_of })),
        el('div', null, el('span', { text: 'Source' }), el('b', { text: 'DefiLlama protocol index' })),
        el('div', null, el('span', { text: 'Model version' }), el('b', { text: DATA.model_version }))
      )
    ));
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function render() {
    app.textContent = '';
    var shell = el('div', { class: 'shell' });
    shell.appendChild(header());
    shell.appendChild(lede());
    shell.appendChild(stats());
    shell.appendChild(topFive());
    shell.appendChild(controls());
    shell.appendChild(state.tab === 'pre-token' ? boardTable() : liveTable());
    if (state.tab === 'pre-token') {
      shell.appendChild(sectors());
      shell.appendChild(controlGroup());
      shell.appendChild(modelPanel());
    }
    app.appendChild(shell);
    app.setAttribute('aria-busy', 'false');
    if (!dialog.isConnected) app.appendChild(dialog);
    if (state.selected) openDetail(state.selected);
  }

  readHash();
  render();
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dialog.open) dialog.close();
  });
})();
