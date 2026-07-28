/* Interactive SIT ranking component.
 *
 * Reads its data from a <script type="application/json"> sibling emitted by the
 * sit-ranking shortcode, so the JSON is parsed by the browser's JSON parser
 * rather than being interpolated into executable source. Bundled by Hugo Pipes
 * (js.Build) and fingerprinted, so it is cached and loaded once per page.
 */
(function () {
  "use strict";

  var GRADE_VAR = { A: "good", B: "good", C: "warn", D: "crit", E: "crit", F: "crit" };
  var IMPACT = { high: "High impact", medium: "Medium", low: "Low" };
  var LEVER = {
    regex: "Regex", keywords: "Keywords", proximity: "Proximity",
    table: "Table trick", edm: "EDM", tiers: "Tiers", none: "OK"
  };
  var FILTERS = [
    ["all", "All"], ["crit", "Grade D–E"], ["warn", "Grade C"], ["good", "Grade A–B"],
    ["kf", "Keyword-free"], ["nock", "No checksum"], ["ck", "Checksum gap"]
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function init(root) {
    var node = root.querySelector('script[type="application/json"]');
    if (!node) return;
    var D;
    try { D = JSON.parse(node.textContent); } catch (e) { return; }

    var filter = "all";
    var mount = document.createElement("div");
    root.appendChild(mount);

    var order = ["A", "B", "C", "D", "E", "F"].filter(function (g) { return D.grades[g]; });

    mount.innerHTML =
      '<div class="sv-tiles">' +
        tile(D.stats.pureDigits, "/" + D.stats.total, "match only a run of bare digits") +
        tile(D.stats.noChecksum, "/" + D.stats.total, "have no checksum validation") +
        tile(D.stats.kwfree, "/" + D.stats.total, "match with no keyword at medium confidence or higher") +
        tile(D.stats.ckGaps, "", "carry a real check digit Purview ignores") +
      '</div>' +
      '<div class="sv-meter"><div class="sv-meter-bar">' +
        order.map(function (g) {
          return '<i style="flex:' + D.grades[g] + ';background:var(--sv-' + GRADE_VAR[g] + ')" title="Grade ' + g + ': ' + D.grades[g] + '"></i>';
        }).join("") +
      '</div><div class="sv-key">' +
        order.map(function (g) {
          return '<span><i style="background:var(--sv-' + GRADE_VAR[g] + ')"></i><b>' + g + "</b> " + D.grades[g] + "</span>";
        }).join("") +
      '</div></div>' +
      '<div class="sv-controls">' +
        '<input type="search" aria-label="Search country or identifier" placeholder="Search country or identifier…">' +
        '<select aria-label="Sort by">' +
          '<option value="fp">Sort — false-positive risk</option>' +
          '<option value="fn">Sort — false-negative risk</option>' +
          '<option value="ddi">Sort — overall difficulty</option>' +
          '<option value="sig">Sort — weakest pattern first</option>' +
          '<option value="country">Sort — country A–Z</option>' +
        "</select>" +
        '<div class="sv-chips">' +
          FILTERS.map(function (f) {
            var n = f[0] === "all" ? " " + D.stats.total : "";
            return '<button class="sv-chip" data-f="' + f[0] + '" aria-pressed="' + (f[0] === "all") + '">' + f[1] + n + "</button>";
          }).join("") +
        "</div>" +
      "</div>" +
      '<p class="sv-count"></p><div class="sv-rows"></div>';

    var q = mount.querySelector("input");
    var sort = mount.querySelector("select");
    var rowsEl = mount.querySelector(".sv-rows");
    var countEl = mount.querySelector(".sv-count");

    function tile(v, sm, label) {
      return '<div class="sv-tile"><b>' + v + "<small>" + sm + "</small></b><span>" + label + "</span></div>";
    }

    function match(r) {
      var s = q.value.trim().toLowerCase();
      if (s && (r.country + " " + r.name).toLowerCase().indexOf(s) === -1) return false;
      if (filter === "crit") return r.grade === "D" || r.grade === "E" || r.grade === "F";
      if (filter === "warn") return r.grade === "C";
      if (filter === "good") return r.grade === "A" || r.grade === "B";
      if (filter === "kf") return r.kwfree === 2;
      if (filter === "nock") return !r.checksum;
      if (filter === "ck") return r.ckReal === "yes";
      return true;
    }

    function detail(r) {
      var kf = r.kwfree === 2 ? "Yes — medium or higher" : r.kwfree === 1 ? "Yes — low only" : "No";
      var ck = r.ckReal === "yes"
        ? '<p class="sv-ck"><b>Unused checksum.</b> ' + esc(r.ckNote) + " <em>(" + esc(r.ckConf) + ")</em></p>"
        : "";
      var fixes = r.fixes.map(function (f) {
        return '<div class="sv-fix' + (f[0] === "none" ? " none" : "") + '">' +
          '<span class="sv-tag">' + esc(LEVER[f[0]] || f[0]) + "</span>" +
          '<span class="sv-imp">' + (IMPACT[f[3]] || f[3]) + "</span>" +
          '<b class="sv-ft">' + esc(f[1]) + "</b>" +
          "<p>" + esc(D.bodies[f[2]]) + "</p></div>";
      }).join("");
      var kv = [
        ["Class", esc(r.cls)],
        ["Format", esc(r.fmt)],
        ["Checksum", r.checksum ? "Yes" : "No"],
        ["Keyword-free tier", kf],
        ["Confidence tiers", esc(r.tiers || "—")],
        ["Proximity", r.prox || "—"],
        ["Keywords", r.kwGeneric + "/" + r.kwTotal + " generic"],
        ["Score inputs", "PES " + r.pes + " · KD " + r.kd + " · KQ " + r.kqr + " · PF " + r.pf]
      ].map(function (kvp) {
        return '<div class="sv-kv"><span>' + kvp[0] + "</span><b>" + kvp[1] + "</b></div>";
      }).join("");
      return '<div class="sv-det"><div class="sv-kvs">' + kv + "</div>" +
        '<div class="sv-h5">Why this score</div><p>' + esc(r.why) + "</p>" +
        '<div class="sv-h5">The challenge</div><p>' + esc(r.challenge) + "</p>" + ck +
        '<div class="sv-h5">How to improve</div>' + fixes +
        '<a class="sv-lk" href="' + esc(r.url) + '" target="_blank" rel="noopener">Microsoft Learn definition →</a>' +
        "</div>";
    }

    function render() {
      var key = sort.value;
      var list = D.rows.filter(match).sort(function (a, b) {
        if (key === "country") return a.country.localeCompare(b.country);
        if (key === "sig") return a.sig - b.sig;
        return b[key] - a[key];
      });
      countEl.textContent = list.length + " of " + D.rows.length + " shown";
      rowsEl.innerHTML = list.map(function (r, i) {
        return '<div class="sv-row"><button aria-expanded="false">' +
          '<span class="sv-rk">' + (i + 1) + "</span>" +
          '<span><span class="sv-cty">' + esc(r.country) + '</span><br><span class="sv-nm">' + esc(r.name) + "</span></span>" +
          '<span class="sv-grade sv-g-' + GRADE_VAR[r.grade] + '">' + r.grade + "</span>" +
          '<span class="sv-risk">' +
            '<span class="sv-met"><span>FP risk<b>' + r.fp + '</b></span><span class="sv-trk"><i style="width:' + r.fp + '%"></i></span></span>' +
            '<span class="sv-met"><span>FN risk<b>' + r.fn + '</b></span><span class="sv-trk"><i style="width:' + r.fn + '%"></i></span></span>' +
          "</span></button>" + detail(r) + "</div>";
      }).join("");
    }

    mount.querySelector(".sv-chips").addEventListener("click", function (e) {
      var b = e.target.closest(".sv-chip");
      if (!b) return;
      filter = b.dataset.f;
      mount.querySelectorAll(".sv-chip").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === b));
      });
      render();
    });
    rowsEl.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var open = b.parentElement.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
    q.addEventListener("input", render);
    sort.addEventListener("change", render);
    render();
  }

  function boot() {
    document.querySelectorAll("[data-sv-ranking]").forEach(init);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
