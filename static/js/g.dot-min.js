/*
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.dotchart = function (K, J, a, f, w, v, r, F) {
    function Q(b) {
        +b[0] && (b[0] = c.g.axis(K + q, J + q, a - 2 * q, B, n, F.axisxstep || Math.floor((a - 2 * q) / 20), 2, F.axisxlabels || null, F.axisxtype || "t"));
        +b[1] && (b[1] = c.g.axis(K + a - q, J + f - q, f - 2 * q, A, m, F.axisystep || Math.floor((f - 2 * q) / 20), 3, F.axisylabels || null, F.axisytype || "t"));
        +b[2] && (b[2] = c.g.axis(K + q, J + f - q + E, a - 2 * q, B, n, F.axisxstep || Math.floor((a - 2 * q) / 20), 0, F.axisxlabels || null, F.axisxtype || "t"));
        +b[3] && (b[3] = c.g.axis(K + q - E, J + f - q, f - 2 * q, A, m, F.axisystep || Math.floor((f - 2 * q) / 20), 1, F.axisylabels || null, F.axisytype || "t"));
    }

    F = F || {};
    var u = this.g.snapEnds(Math.min.apply(Math, w), Math.max.apply(Math, w), w.length - 1), B = u.from, n = u.to, q = F.gutter || 10, I = this.g.snapEnds(Math.min.apply(Math, v), Math.max.apply(Math, v), v.length - 1), A = I.from, m = I.to, z = Math.max(w.length, v.length, r.length), t = this.g.markers[F.symbol] || "disc", G = this.set(), s = this.set(), D = F.max || 100, p = Math.max.apply(Math, r), o = [], c = this, N = Math.sqrt(p / Math.PI) * 2 / D;
    for (var O = 0; O < z; O++) {
        o[O] = Math.min(Math.sqrt(r[O] / Math.PI) * 2 / N, D);
    }
    q = Math.max.apply(Math, o.concat(q));
    var C = this.set(), E = Math.max.apply(Math, o);
    if (F.axis) {
        var l = (F.axis + "").split(/[,\s]+/);
        Q(l);
        var P = [], S = [];
        for (var O = 0, H = l.length; O < H; O++) {
            var T = l[O].all ? l[O].all.getBBox()[["height", "width"][O % 2]] : 0;
            P[O] = T + q;
            S[O] = T;
        }
        q = Math.max.apply(Math, P.concat(q));
        for (var O = 0, H = l.length; O < H; O++) {
            if (l[O].all) {
                l[O].remove();
                l[O] = 1;
            }
        }
        Q(l);
        for (var O = 0, H = l.length; O < H; O++) {
            if (l[O].all) {
                C.push(l[O].all);
            }
        }
        G.axis = C;
    }
    var M = (a - q * 2) / ((n - B) || 1), L = (f - q * 2) / ((m - A) || 1);
    for (var O = 0, H = v.length; O < H; O++) {
        var e = this.raphael.is(t, "array") ? t[O] : t, j = K + q + (w[O] - B) * M, h = J + f - q - (v[O] - A) * L;
        e && o[O] && s.push(this.g[e](j, h, o[O]).attr({fill:F.heat ? this.g.colorValue(o[O], E) : Raphael.fn.g.colors[0], "fill-opacity":F.opacity ? o[O] / D : 1, stroke:"none"}));
    }
    var d = this.set();
    for (var O = 0, H = v.length; O < H; O++) {
        var j = K + q + (w[O] - B) * M, h = J + f - q - (v[O] - A) * L;
        d.push(this.circle(j, h, E).attr(this.g.shim));
        F.href && F.href[O] && d[O].attr({href:F.href[O]});
        d[O].r = +o[O].toFixed(3);
        d[O].x = +j.toFixed(3);
        d[O].y = +h.toFixed(3);
        d[O].X = w[O];
        d[O].Y = v[O];
        d[O].value = r[O] || 0;
        d[O].dot = s[O];
    }
    G.covers = d;
    G.series = s;
    G.push(s, C, d);
    G.hover = function (g, b) {
        d.mouseover(g).mouseout(b);
        return this;
    };
    G.click = function (b) {
        d.click(b);
        return this;
    };
    G.each = function (g) {
        if (!Raphael.is(g, "function")) {
            return this;
        }
        for (var b = d.length; b--;) {
            g.call(d[b]);
        }
        return this;
    };
    G.href = function (k) {
        var g;
        for (var b = d.length; b--;) {
            g = d[b];
            if (g.X == k.x && g.Y == k.y && g.value == k.value) {
                g.attr({href:k.href});
            }
        }
    };
    return G;
};