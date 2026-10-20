var lead =
  "Nhân ngày 20/10, chúc tất cả phụ nữ Việt Nam luôn xinh đẹp, rạng rỡ và ngập tràn hạnh phúc.";
var wishes = [
  "Chúc phái đẹp luôn giữ được nụ cười tươi tắn trên môi và tinh thần yêu đời mỗi ngày.",
  "Chúc cho mọi phụ nữ luôn được yêu thương, trân trọng và gặp nhiều may mắn trong cuộc sống.",
  "Chúc chị em luôn thành công trên con đường mình chọn và đạt được mọi điều mong ước.",
  "Chúc phái nữ luôn là những bông hoa ngát hương, tự tin tỏa sáng theo cách riêng của mình.",
  "Chúc cho mọi phụ nữ luôn có thật nhiều sức khỏe, bình an và tâm hồn luôn thanh thản.",
  "Chúc chị em luôn nhận được thật nhiều sự chăm sóc, chia sẻ và ngọt ngào từ những người xung quanh.",
  "Chúc cho mỗi ngày trôi qua của phái đẹp đều trọn vẹn niềm vui và rực rỡ sắc màu.",
  "Chúc phụ nữ luôn đủ mạnh mẽ để vượt qua thử thách và đủ dịu dàng để đón nhận yêu thương.",
  "Chúc tất cả những người phụ nữ tuyệt vời luôn cảm thấy mình được ưu ái và trân quý mỗi ngày.",
];
var list = document.getElementById("list");
function build(el, text, o) {
  el.classList.add("go");
  el.style.setProperty("--o", o + "s");
  el.textContent = "";
  var idx = 0;
  text
    .normalize("NFC")
    .split(" ")
    .forEach(function (word, wi, arr) {
      var ws = document.createElement("span");
      ws.className = "w";
      Array.from(word).forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "c";
        s.textContent = ch;
        s.style.setProperty("--d", idx++ * 0.03 + "s");
        ws.appendChild(s);
      });
      el.appendChild(ws);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
}
var leadEl = document.getElementById("lead");
build(leadEl, lead, 0.1);
wishes.forEach(function (w, i) {
  var li = document.createElement("li");
  li.style.animationDelay = i * -0.7 + "s";
  build(li, w, 1.2 + i * 0.6);
  list.appendChild(li);
});
var items = [leadEl].concat(Array.from(list.children)),
  cur = 0;
setInterval(function () {
  var el = items[cur++ % items.length];
  el.style.setProperty("--o", "0s");
  el.classList.remove("go");
  void el.offsetWidth;
  el.classList.add("go");
}, 3200);

function draw() {
  var cs = getComputedStyle(document.documentElement);
  var red = cs.getPropertyValue("--red").trim(),
    bg = cs.getPropertyValue("--bg").trim();
  try {
    var PAGE = window.location.href.split("#")[0];
    var q = qrcode(7, "H");
    q.addData(PAGE);
    q.make();
    var green = "#14532d",
      tint = "rgba(34,160,80,.16)",
      paper = "#fffaf8";
    var n = q.getModuleCount(),
      quiet = 4,
      cell = Math.max(6, Math.floor(900 / (n + quiet * 2)));
    var size = (n + quiet * 2) * cell,
      c = document.getElementById("qr");
    c.width = size;
    c.height = size;
    var g = c.getContext("2d");
    g.fillStyle = paper;
    g.fillRect(0, 0, size, size);
    // four-leaf clover: 4 heart-shaped leaves pointing to the centre
    function inClover(x, y) {
      var S = 0.52,
        T = 0.58,
        dirs = [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ];
      for (var i = 0; i < 4; i++) {
        var dx = dirs[i][0] / Math.SQRT2,
          dy = dirs[i][1] / Math.SQRT2;
        var px = x - dx * T,
          py = y - dy * T;
        var hu = (px * dx + py * dy) / S,
          hv = (-px * dy + py * dx) / S;
        var a = hv * hv + hu * hu - 1;
        if (a * a * a - hv * hv * hu * hu * hu <= 0) return true;
      }
      // stem
      return x > -0.05 && x < 0.05 && y > 0.1 && y < 0.95 && false;
    }
    function finder(r, k) {
      return (r < 8 && k < 8) || (r < 8 && k >= n - 8) || (r >= n - 8 && k < 8);
    }
    for (var r = 0; r < n; r++)
      for (var k = 0; k < n; k++) {
        var x = ((k + 0.5) / n) * 2 - 1,
          y = ((r + 0.5) / n) * 2 - 1,
          inside = inClover(x, y) || finder(r, k);
        var px0 = (k + quiet) * cell,
          py0 = (r + quiet) * cell,
          d = q.isDark(r, k);
        if (inside) {
          if (d) {
            g.fillStyle = green;
            g.fillRect(px0, py0, cell, cell);
          } else {
            g.fillStyle = tint;
            g.fillRect(px0, py0, cell, cell);
          }
        } else if (d) {
          var m = cell * 0.22;
          g.fillStyle = green;
          g.fillRect(px0 + m, py0 + m, cell - 2 * m, cell - 2 * m);
        }
      }
  } catch (e) {
    document.querySelector(".hint").textContent = "Không tạo được mã QR.";
  }
}
draw();
if (window.matchMedia)
  window
    .matchMedia("(prefers-color-scheme:dark)")
    .addEventListener("change", draw);

// Falling words and letters
(function () {
  var cv = document.getElementById("rain"),
    cx = cv.getContext("2d"),
    W = 0,
    H = 0,
    dpr = Math.min(window.devicePixelRatio || 1, 2),
    ps = [];
  var words = [
    "xinh đẹp",
    "rạng rỡ",
    "hạnh phúc",
    "20/10",
    "yêu thương",
    "may mắn",
    "thành công",
    "bình an",
    "tỏa sáng",
    "nụ cười",
    "sức khỏe",
    "ngọt ngào",
    "mạnh mẽ",
    "dịu dàng",
    "trân quý",
    "rực rỡ",
    "tự tin",
    "✿",
  ];
  var chars = Array.from(
    (lead + wishes.join("")).normalize("NFC").replace(/[\s,.\/0-9]/g, ""),
  );
  words = words.map(function (s) {
    return s.normalize("NFC");
  });
  function pal() {
    var d =
      window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    return d
      ? ["#ff6b66", "#ff9fb3", "#ffd36b", "#6ee08a", "#ffffff"]
      : ["#e0201c", "#ff5c8a", "#d99a00", "#15803d", "#b4233c"];
  }
  function mk(initial) {
    var d = 0.35 + Math.random() * 0.65,
      w = Math.random() < 0.55,
      p = pal();
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -40,
      t: w
        ? words[(Math.random() * words.length) | 0]
        : chars[(Math.random() * chars.length) | 0],
      s: (w ? 17 : 20) + d * (w ? 18 : 24),
      v: 0.35 + d * 1.3,
      a: 0.2 + d * 0.6,
      c: p[(Math.random() * p.length) | 0],
      ph: Math.random() * 6.28,
      sw: 8 + Math.random() * 22,
      r: (Math.random() - 0.5) * 0.5,
      k: 0.01 + Math.random() * 0.02,
    };
  }
  function init() {
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ps = [];
    var N = W < 600 ? 40 : 75;
    for (var i = 0; i < N; i++) ps.push(mk(true));
  }
  var still =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame() {
    cx.clearRect(0, 0, W, H);
    cx.textAlign = "center";
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (!still) {
        p.y += p.v;
        p.ph += p.k;
      }
      cx.save();
      cx.translate(p.x + Math.sin(p.ph) * p.sw, p.y);
      cx.rotate(p.r + Math.sin(p.ph) * 0.25);
      cx.globalAlpha = p.a;
      cx.fillStyle = p.c;
      cx.font = "700 " + p.s + "px 'Dancing Script',Lora,serif";
      cx.fillText(p.t, 0, 0);
      cx.restore();
      if (p.y > H + 40) ps[i] = mk(false);
    }
    if (!still) requestAnimationFrame(frame);
  }
  if (document.fonts && document.fonts.load) {
    document.fonts.load("700 20px 'Dancing Script'", "ấềễăơ");
  }
  init();
  frame();
  window.addEventListener("resize", function () {
    if (window.innerWidth !== W) {
      init();
      if (still) frame();
    }
  });
})();
