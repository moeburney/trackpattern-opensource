/*
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.barchart = function (C, A, a, d, O, u) {
    u = u || {};
    var P = {round:"round", sharp:"sharp", soft:"soft"}[u.type] || "square", n = parseFloat(u.gutter || "20%"), M = this.set(), v = this.set(), e = this.set(), r = this.set(), w = Math.max.apply(Math, O), N = [], c = this, B = 0, F = u.colors || this.g.colors, q = O.length;
    if (this.raphael.is(O[0], "array")) {
        w = [];
        B = q;
        q = 0;
        for (var K = O.length; K--;) {
            v.push(this.set());
            w.push(Math.max.apply(Math, O[K]));
            q = Math.max(q, O[K].length);
        }
        if (u.stacked) {
            for (var K = q; K--;) {
                var l = 0;
                for (var J = O.length; J--;) {
                    l += +O[J][K] || 0;
                }
                N.push(l);
            }
        }
        for (var K = O.length; K--;) {
            if (O[K].length < q) {
                for (var J = q; J--;) {
                    O[K].push(0);
                }
            }
        }
        w = Math.max.apply(Math, u.stacked ? N : w);
    }
    w = (u.to) || w;
    var D = a / (q * (100 + n) + n) * 100, b = D * n / 100, g = u.vgutter == null ? 20 : u.vgutter, t = [], k = C + b, f = (d - 2 * g) / w;
    if (!u.stretch) {
        b = Math.round(b);
        D = Math.floor(D);
    }
    !u.stacked && (D /= B || 1);
    for (var K = 0; K < q; K++) {
        t = [];
        for (var J = 0; J < (B || 1); J++) {
            var L = Math.round((B ? O[J][K] : O[K]) * f), m = A + d - g - L, H = this.g.finger(Math.round(k + D / 2), m + L, D, L, true, P).attr({stroke:"none", fill:F[B ? J : K]});
            if (B) {
                v[J].push(H);
            } else {
                v.push(H);
            }
            H.y = m;
            H.x = Math.round(k + D / 2);
            H.w = D;
            H.h = L;
            H.value = B ? O[J][K] : O[K];
            if (!u.stacked) {
                k += D;
            } else {
                t.push(H);
            }
        }
        if (u.stacked) {
            var I;
            r.push(I = this.rect(t[0].x - t[0].w / 2, A, D, d).attr(this.g.shim));
            I.bars = this.set();
            var o = 0;
            for (var E = t.length; E--;) {
                t[E].toFront();
            }
            for (var E = 0, p = t.length; E < p; E++) {
                var H = t[E], z, L = (o + H.value) * f, G = this.g.finger(H.x, A + d - g - !!o * 0.5, D, L, true, P, 1);
                I.bars.push(H);
                o && H.attr({path:G});
                H.h = L;
                H.y = A + d - g - !!o * 0.5 - L;
                e.push(z = this.rect(H.x - H.w / 2, H.y, D, H.value * f).attr(this.g.shim));
                z.bar = H;
                z.value = H.value;
                o += H.value;
            }
            k += D;
        }
        k += b;
    }
    r.toFront();
    k = C + b;
    if (!u.stacked) {
        for (var K = 0; K < q; K++) {
            for (var J = 0; J < (B || 1); J++) {
                var z;
                e.push(z = this.rect(Math.round(k), A + g, D, d - g).attr(this.g.shim));
                z.bar = B ? v[J][K] : v[K];
                z.value = z.bar.value;
                k += D;
            }
            k += b;
        }
    }
    M.label = function (y, S) {
        y = y || [];
        this.labels = c.set();
        var T, h = -Infinity;
        if (u.stacked) {
            for (var x = 0; x < q; x++) {
                var Q = 0;
                for (var s = 0; s < (B || 1); s++) {
                    Q += B ? O[s][x] : O[x];
                    if (s == B - 1) {
                        var U = c.g.labelise(y[x], Q, w);
                        T = c.g.text(v[x * (B || 1) + s].x, A + d - g / 2, U).insertBefore(e[x * (B || 1) + s]);
                        var R = T.getBBox();
                        if (R.x - 7 < h) {
                            T.remove();
                        } else {
                            this.labels.push(T);
                            h = R.x + R.width;
                        }
                    }
                }
            }
        } else {
            for (var x = 0; x < q; x++) {
                for (var s = 0; s < (B || 1); s++) {
                    var U = c.g.labelise(B ? y[s] && y[s][x] : y[x], B ? O[s][x] : O[x], w);
                    T = c.g.text(v[x * (B || 1) + s].x, S ? A + d - g / 2 : v[x * (B || 1) + s].y - 10, U).insertBefore(e[x * (B || 1) + s]);
                    var R = T.getBBox();
                    if (R.x - 7 < h) {
                        T.remove();
                    } else {
                        this.labels.push(T);
                        h = R.x + R.width;
                    }
                }
            }
        }
        return this;
    };
    M.hover = function (i, h) {
        r.hide();
        e.show();
        e.mouseover(i).mouseout(h);
        return this;
    };
    M.hoverColumn = function (i, h) {
        e.hide();
        r.show();
        h = h || function () {
        };
        r.mouseover(i).mouseout(h);
        return this;
    };
    M.click = function (h) {
        r.hide();
        e.show();
        e.click(h);
        return this;
    };
    M.each = function (j) {
        if (!Raphael.is(j, "function")) {
            return this;
        }
        for (var h = e.length; h--;) {
            j.call(e[h]);
        }
        return this;
    };
    M.eachColumn = function (j) {
        if (!Raphael.is(j, "function")) {
            return this;
        }
        for (var h = r.length; h--;) {
            j.call(r[h]);
        }
        return this;
    };
    M.clickColumn = function (h) {
        e.hide();
        r.show();
        r.click(h);
        return this;
    };
    M.push(v, e, r);
    M.bars = v;
    M.covers = e;
    return M;
};
Raphael.fn.g.hbarchart = function (n, l, B, w, c, r) {
    r = r || {};
    var e = {round:"round", sharp:"sharp", soft:"soft"}[r.type] || "square", f = parseFloat(r.gutter || "20%"), u = this.set(), A = this.set(), h = this.set(), E = this.set(), M = Math.max.apply(Math, c), a = [], o = this, C = 0, m = r.colors || this.g.colors, H = c.length;
    if (this.raphael.is(c[0], "array")) {
        M = [];
        C = H;
        H = 0;
        for (var G = c.length; G--;) {
            A.push(this.set());
            M.push(Math.max.apply(Math, c[G]));
            H = Math.max(H, c[G].length);
        }
        if (r.stacked) {
            for (var G = H; G--;) {
                var p = 0;
                for (var F = c.length; F--;) {
                    p += +c[F][G] || 0;
                }
                a.push(p);
            }
        }
        for (var G = c.length; G--;) {
            if (c[G].length < H) {
                for (var F = H; F--;) {
                    c[G].push(0);
                }
            }
        }
        M = Math.max.apply(Math, r.stacked ? a : M);
    }
    M = (r.to) || M;
    var J = Math.floor(w / (H * (100 + f) + f) * 100), k = Math.floor(J * f / 100), g = [], b = l + k, d = (B - 1) / M;
    !r.stacked && (J /= C || 1);
    for (var G = 0; G < H; G++) {
        g = [];
        for (var F = 0; F < (C || 1); F++) {
            var L = C ? c[F][G] : c[G], I = this.g.finger(n, b + J / 2, Math.round(L * d), J - 1, false, e).attr({stroke:"none", fill:m[C ? F : G]});
            if (C) {
                A[F].push(I);
            } else {
                A.push(I);
            }
            I.x = n + Math.round(L * d);
            I.y = b + J / 2;
            I.w = Math.round(L * d);
            I.h = J;
            I.value = +L;
            if (!r.stacked) {
                b += J;
            } else {
                g.push(I);
            }
        }
        if (r.stacked) {
            var q = this.rect(n, g[0].y - g[0].h / 2, B, J).attr(this.g.shim);
            E.push(q);
            q.bars = this.set();
            var v = 0;
            for (var t = g.length; t--;) {
                g[t].toFront();
            }
            for (var t = 0, D = g.length; t < D; t++) {
                var I = g[t], K, L = Math.round((v + I.value) * d), z = this.g.finger(n, I.y, L, J - 1, false, e, 1);
                q.bars.push(I);
                v && I.attr({path:z});
                I.w = L;
                I.x = n + L;
                h.push(K = this.rect(n + v * d, I.y - I.h / 2, I.value * d, J).attr(this.g.shim));
                K.bar = I;
                v += I.value;
            }
            b += J;
        }
        b += k;
    }
    E.toFront();
    b = l + k;
    if (!r.stacked) {
        for (var G = 0; G < H; G++) {
            for (var F = 0; F < (C || 1); F++) {
                var K = this.rect(n, b, B, J).attr(this.g.shim);
                h.push(K);
                K.bar = C ? A[F][G] : A[G];
                K.value = K.bar.value;
                b += J;
            }
            b += k;
        }
    }
    u.label = function (R, P) {
        R = R || [];
        this.labels = o.set();
        for (var O = 0; O < H; O++) {
            for (var N = 0; N < C; N++) {
                var y = o.g.labelise(C ? R[N] && R[N][O] : R[O], C ? c[N][O] : c[O], M);
                var Q = P ? A[O * (C || 1) + N].x - J / 2 + 3 : n + 5, x = P ? "end" : "start", s;
                this.labels.push(s = o.g.text(Q, A[O * (C || 1) + N].y, y).attr({"text-anchor":x}).insertBefore(h[0]));
                if (s.getBBox().x < n + 5) {
                    s.attr({x:n + 5, "text-anchor":"start"});
                } else {
                    A[O * (C || 1) + N].label = s;
                }
            }
        }
        return this;
    };
    u.hover = function (j, i) {
        E.hide();
        h.show();
        i = i || function () {
        };
        h.mouseover(j).mouseout(i);
        return this;
    };
    u.hoverColumn = function (j, i) {
        h.hide();
        E.show();
        i = i || function () {
        };
        E.mouseover(j).mouseout(i);
        return this;
    };
    u.each = function (s) {
        if (!Raphael.is(s, "function")) {
            return this;
        }
        for (var j = h.length; j--;) {
            s.call(h[j]);
        }
        return this;
    };
    u.eachColumn = function (s) {
        if (!Raphael.is(s, "function")) {
            return this;
        }
        for (var j = E.length; j--;) {
            s.call(E[j]);
        }
        return this;
    };
    u.click = function (i) {
        E.hide();
        h.show();
        h.click(i);
        return this;
    };
    u.clickColumn = function (i) {
        h.hide();
        E.show();
        E.click(i);
        return this;
    };
    u.push(A, h, E);
    u.bars = A;
    u.covers = h;
    return u;
};