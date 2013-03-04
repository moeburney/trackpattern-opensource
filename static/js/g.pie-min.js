Raphael.fn.g.piechart = function (e, d, o, b, l) {
    l = l || {};
    var k = this, m = [], g = this.set(), n = this.set(), j = this.set(), u = [], w = b.length, x = 0, A = 0, z = 0, c = 9, y = true;
    n.covers = g;
    if (w == 1) {
        j.push(this.circle(e, d, o).attr({fill:this.g.colors[0], stroke:l.stroke || "#fff", "stroke-width":l.strokewidth == null ? 1 : l.strokewidth}));
        g.push(this.circle(e, d, o).attr(this.g.shim));
        A = b[0];
        b[0] = {value:b[0], order:0, valueOf:function () {
            return this.value;
        }};
        j[0].middle = {x:e, y:d};
        j[0].mangle = 180;
    } else {
        function t(F, E, i, H, D, M) {
            var J = Math.PI / 180, B = F + i * Math.cos(-H * J), p = F + i * Math.cos(-D * J), G = F + i / 2 * Math.cos(-(H + (D - H) / 2) * J), L = E + i * Math.sin(-H * J), K = E + i * Math.sin(-D * J), C = E + i / 2 * Math.sin(-(H + (D - H) / 2) * J), I = ["M", F, E, "L", B, L, "A", i, i, 0, +(Math.abs(D - H) > 180), 1, p, K, "z"];
            I.middle = {x:G, y:C};
            return I;
        }

        for (var v = 0; v < w; v++) {
            A += b[v];
            b[v] = {value:b[v], order:v, valueOf:function () {
                return this.value;
            }};
        }
        b.sort(function (p, i) {
            return i.value - p.value;
        });
        for (v = 0; v < w; v++) {
            if (y && b[v] * 360 / A <= 1.5) {
                c = v;
                y = false;
            }
            if (v > c) {
                y = false;
                b[c].value += b[v];
                b[c].others = true;
                z = b[c].value;
            }
        }
        w = Math.min(c + 1, b.length);
        z && b.splice(w) && (b[c].others = true);
        for (v = 0; v < w; v++) {
            var f = x - 360 * b[v] / A / 2;
            if (!v) {
                x = 90 - f;
                f = x - 360 * b[v] / A / 2;
            }
            if (l.init) {
                var h = t(e, d, 1, x, x - 360 * b[v] / A).join(",");
            }
            var s = t(e, d, o, x, x -= 360 * b[v] / A);
            var q = this.path(l.init ? h : s).attr({fill:l.colors && l.colors[v] || this.g.colors[v] || "#666", stroke:l.stroke || "#fff", "stroke-width":(l.strokewidth == null ? 1 : l.strokewidth), "stroke-linejoin":"round"});
            q.value = b[v];
            q.middle = s.middle;
            q.mangle = f;
            m.push(q);
            j.push(q);
            l.init && q.animate({path:s.join(",")}, (+l.init - 1) || 1000, ">");
        }
        for (v = 0; v < w; v++) {
            q = k.path(m[v].attr("path")).attr(this.g.shim);
            l.href && l.href[v] && q.attr({href:l.href[v]});
            q.attr = function () {
            };
            g.push(q);
            j.push(q);
        }
    }
    n.hover = function (C, r) {
        r = r || function () {
        };
        var B = this;
        for (var p = 0; p < w; p++) {
            (function (D, E, i) {
                var F = {sector:D, cover:E, cx:e, cy:d, mx:D.middle.x, my:D.middle.y, mangle:D.mangle, r:o, value:b[i], total:A, label:B.labels && B.labels[i]};
                E.mouseover(
                    function () {
                        C.call(F);
                    }).mouseout(function () {
                    r.call(F);
                });
            })(j[p], g[p], p);
        }
        return this;
    };
    n.each = function (B) {
        var r = this;
        for (var p = 0; p < w; p++) {
            (function (C, D, i) {
                var E = {sector:C, cover:D, cx:e, cy:d, x:C.middle.x, y:C.middle.y, mangle:C.mangle, r:o, value:b[i], total:A, label:r.labels && r.labels[i]};
                B.call(E);
            })(j[p], g[p], p);
        }
        return this;
    };
    n.click = function (B) {
        var r = this;
        for (var p = 0; p < w; p++) {
            (function (C, D, i) {
                var E = {sector:C, cover:D, cx:e, cy:d, mx:C.middle.x, my:C.middle.y, mangle:C.mangle, r:o, value:b[i], total:A, label:r.labels && r.labels[i]};
                D.click(function () {
                    B.call(E);
                });
            })(j[p], g[p], p);
        }
        return this;
    };
    n.inject = function (i) {
        i.insertBefore(g[0]);
    };
    var a = function (G, B, r, p) {
        var K = e + o + o / 5, J = d, F = J + 10;
        G = G || [];
        p = (p && p.toLowerCase && p.toLowerCase()) || "east";
        r = k.g.markers[r && r.toLowerCase()] || "disc";
        n.labels = k.set();
        for (var E = 0; E < w; E++) {
            var L = j[E].attr("fill"), C = b[E].order, D;
            b[E].others && (G[C] = B || "Others");
            G[C] = k.g.labelise(G[C], b[E], A);
            n.labels.push(k.set());
            n.labels[E].push(k.g[r](K + 5, F, 5).attr({fill:L, stroke:"none"}));
            n.labels[E].push(D = k.text(K + 20, F, G[C] || b[C]).attr(k.g.txtattr).attr({fill:l.legendcolor || "#000", "text-anchor":"start"}));
            g[E].label = n.labels[E];
            F += D.getBBox().height * 1.2;
        }
        var H = n.labels.getBBox(), I = {east:[0, -H.height / 2], west:[-H.width - 2 * o - 20, -H.height / 2], north:[-o - H.width / 2, -o - H.height - 10], south:[-o - H.width / 2, o + 10]}[p];
        n.labels.translate.apply(n.labels, I);
        n.push(n.labels);
    };
    if (l.legend) {
        a(l.legend, l.legendothers, l.legendmark, l.legendpos);
    }
    n.push(j, g);
    n.series = j;
    n.covers = g;
    return n;
};