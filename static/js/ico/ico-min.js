(function (a) {
    function d(a, b) {
        var c;
        a.currentStyle ? c = a.currentStyle[b] : window.getComputedStyle && (c = document.defaultView.getComputedStyle(a, null).getPropertyValue(b)), c && c.length === 0 && (c = null);
        return c
    }

    function c(a) {
        return a > 1 ? a - 1 : 1
    }

    var b = {VERSION:"0.3.0", round:function (a, b) {
        var c = Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
        return c
    }};
    Array.prototype.sum = function () {
        for (var a = 0, b = 0; a < this.length; b += this[a++]);
        return b
    }, typeof Array.prototype.max == "undefined" && (Array.prototype.max = function () {
        return Math.max.apply({}, this)
    }), typeof Array.prototype.min == "undefined" && (Array.prototype.min = function () {
        return Math.min.apply({}, this)
    }), Array.prototype.mean = function () {
        return this.sum() / this.length
    }, Array.prototype.variance = function () {
        var a = this.mean(), b = 0;
        for (var c = 0; c < this.length; c++)b += Math.pow(this[c] - a, 2);
        return b / (this.length - 1)
    }, Array.prototype.standard_deviation = function () {
        return Math.sqrt(this.variance())
    }, typeof Object.extend == "undefined" && (Object.extend = function (a, b) {
        for (var c in b)b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    }), b.Normaliser = function (a, b) {
        this.options = {start_value:null}, typeof b != "undefined" && (this.options = b), this.min = a.min(), this.max = a.max(), this.standard_deviation = a.standard_deviation(), this.range = 0, this.step = this.labelStep(this.max - this.min), this.start_value = this.calculateStart(), this.process()
    }, b.Normaliser.prototype = {calculateStart:function () {
        var a = typeof this.options.start_value != "undefined" && this.min >= 0 ? this.options.start_value : this.min, b = this.round(a, 1);
        if (this.min > 0 && b > this.min)return 0;
        return b
    }, round:function (a, b) {
        b = b || 1;
        var c = a;
        if (this.standard_deviation > .1) {
            var d = Math.pow(10, -b);
            c = Math.round(a * d) / d;
            if (c > this.min)return this.round(a - this.step)
        }
        return c
    }, process:function () {
        this.range = this.max - this.start_value, this.step = this.labelStep(this.range)
    }, labelStep:function (a) {
        return Math.pow(10, Math.round(Math.log(a) / Math.LN10) - 1)
    }}, b.Base = {normaliseData:function (a) {
        var b = [], c = 0;
        for (c = 0; c < a.length; c++)b.push(this.normalise(a[c]));
        return b
    }, flatten:function (a) {
        var b = [];
        if (typeof a.length == "undefined") {
            if (typeof a != "object")return[];
            for (var c in a)a.hasOwnProperty(c) && (b = b.concat(this.flatten(a[c])))
        }
        for (var d = 0; d < a.length; d++)typeof a[d].length == "number" ? b = b.concat(this.flatten(a[d])) : b.push(a[d]);
        return b
    }, makeRange:function (a, b) {
        var c = [], d;
        for (d = a; d < b; d++)c.push(d);
        return c
    }}, b.BaseGraph = function () {
        this.initialize.apply(this, arguments)
    }, Object.extend(b.BaseGraph.prototype, b.Base), Object.extend(b.BaseGraph.prototype, {initialize:function (a, c, e) {
        this.element = a, this.data_sets = this.buildDataSets(c, e), this.flat_data = this.flatten(c), this.data_size = this.longestDataSetLength();
        if (e && e.colour) {
            e.colours = {};
            for (var f in this.data_sets)this.data_sets.hasOwnProperty(f) && (e.colours[f] = e.colour)
        }
        this.options = {width:parseInt(d(a, "width"), 10), height:parseInt(d(a, "height"), 10), labels:this.makeRange(1, this.data_size + 1), plot_padding:10, font_size:10, show_horizontal_labels:!0, show_vertical_labels:!0, background_colour:d(a, "backgroundColor") || "#ffffff", label_colour:"#666", markers:!1, marker_size:5, meanline:!1, grid:!1, grid_colour:"#ccc", y_padding_top:20, draw:!0}, Object.extend(this.options, this.chartDefaults() || {}), Object.extend(this.options, e || {}), this.normaliser = new b.Normaliser(this.flat_data, this.normaliserOptions()), this.label_step = this.normaliser.step, this.range = this.normaliser.range, this.start_value = this.normaliser.start_value, this.x_padding_left = 10 + this.paddingLeftOffset(), this.x_padding_right = 20, this.x_padding = this.x_padding_left + this.x_padding_right, this.y_padding_top = this.options.y_padding_top, this.y_padding_bottom = 20 + this.paddingBottomOffset(), this.y_padding = this.y_padding_top + this.y_padding_bottom, this.graph_width = this.options.width - this.x_padding, this.graph_height = this.options.height - this.y_padding, this.step = this.calculateStep(), this.y_label_count = Math.ceil(this.range / this.label_step), this.normaliser.min + this.y_label_count * this.normaliser.step < this.normaliser.max && (this.y_label_count += 1), this.value_labels = this.makeValueLabels(this.y_label_count), this.top_value = this.value_labels[this.value_labels.length - 1], this.grid_start_offset = -1, this.options.draw && (typeof this.options.colours == "undefined" && (this.options.colours = this.makeRandomColours()), this.paper = Raphael(this.element, this.options.width, this.options.height), this.background = this.paper.rect(0, 0, this.options.width, this.options.height), this.background.attr({fill:this.options.background_colour, stroke:"none"}), this.options.meanline === !0 && (this.options.meanline = {"stroke-width":"2px", stroke:"#BBBBBB"}), this.setChartSpecificOptions(), this.lastPoint = {x:0, y:0}, this.draw())
    }, buildDataSets:function (a, b) {
        return typeof a.length != "undefined" ? {one:a} : a
    }, normaliserOptions:function () {
        return{}
    }, chartDefaults:function () {
        return{}
    }, drawPlot:function (a, b, c, d, e) {
    }, calculateStep:function () {
    }, makeRandomColours:function () {
        var a = {};
        for (var b in this.data_sets)a.hasOwnProperty(b) || (a[b] = Raphael.hsb2rgb(Math.random(), 1, .75).hex);
        return a
    }, longestDataSetLength:function () {
        var a = 0;
        for (var b in this.data_sets)this.data_sets.hasOwnProperty(b) && (a = this.data_sets[b].length > a ? this.data_sets[b].length : a);
        return a
    }, roundValue:function (a, b) {
        var c = Math.pow(10, b);
        a *= c, a = Math.round(a) / c;
        return a
    }, roundValues:function (a, b) {
        var c = [];
        for (var d = 0; d < a.length; d++)c.push(this.roundValue(a[d], b));
        return c
    }, longestLabel:function (a) {
        var b = Array.prototype.slice.call(a || this.options.labels, 0);
        return b.sort(function (a, b) {
            return a.toString().length < b.toString().length
        })[0].toString().length
    }, paddingLeftOffset:function () {
        var a = this.roundValues(this.flat_data, 2), b = 0;
        b = a.sort(function (a, b) {
            return a.toString().length < b.toString().length
        })[0].toString().length, b = b > 2 ? b - 1 : b;
        return 10 + b * this.options.font_size
    }, paddingBottomOffset:function () {
        return this.options.font_size
    }, normalise:function (a) {
        var b = this.start_value === 0 ? this.top_value : this.range;
        return a / b * this.graph_height
    }, draw:function () {
        this.options.grid && this.drawGrid(), this.options.meanline && this.drawMeanLine(this.normaliseData(this.flat_data)), this.drawAxis(), this.options.show_vertical_labels && this.drawVerticalLabels(), this.options.show_horizontal_labels && this.drawHorizontalLabels();
        for (var a in this.data_sets)if (this.data_sets.hasOwnProperty(a)) {
            var b = this.data_sets[a];
            this.drawLines(a, this.options.colours[a], this.normaliseData(b))
        }
        this.start_value !== 0 && this.drawFocusHint()
    }, drawGrid:function () {
        var a = "", b;
        if (this.options.show_vertical_labels) {
            var c = this.graph_height + this.y_padding_top;
            for (b = 0; b < this.y_label_count; b++)c = c - this.graph_height / this.y_label_count, a += "M" + this.x_padding_left + "," + c, a += "L" + (this.x_padding_left + this.graph_width) + "," + c
        }
        if (this.options.show_horizontal_labels) {
            var d = this.x_padding_left + this.options.plot_padding + this.grid_start_offset, e = this.options.labels.length;
            for (b = 0; b < e; b++)a += "M" + d + "," + this.y_padding_top, a += "L" + d + "," + (this.y_padding_top + this.graph_height), d = d + this.step;
            d = d - this.options.plot_padding - 1, a += "M" + d + "," + this.y_padding_top, a += "L" + d + "," + (this.y_padding_top + this.graph_height)
        }
        this.paper.path(a).attr({stroke:this.options.grid_colour, "stroke-width":"1px"})
    }, drawLines:function (a, b, c) {
        var d = this.calculateCoords(c), e = "";
        for (var f = 0; f < d.length; f++) {
            var g = d[f][0] || 0, h = d[f][1] || 0;
            e = this.drawPlot(f, e, g, h, b)
        }
        this.paper.path(e).attr({stroke:b, "stroke-width":"3px"})
    }, calculateCoords:function (a) {
        var b = this.x_padding_left + this.options.plot_padding - this.step, c = this.graph_height + this.y_padding_top + this.normalise(this.start_value), d = 0, e = [];
        for (var f = 0; f < a.length; f++)d = c - a[f], b = b + this.step, e.push([b, d]);
        return e
    }, drawFocusHint:function () {
        var a = 5, b = this.x_padding_left + a / 2 - 1, c = this.options.height - this.y_padding_bottom, d = "";
        d += "M" + b + "," + c, d += "L" + (b - a) + "," + (c - a), d += "M" + b + "," + (c - a), d += "L" + (b - a) + "," + (c - a * 2), this.paper.path(d).attr({stroke:this.options.label_colour, "stroke-width":2})
    }, drawMeanLine:function (a) {
        var b = a.sum() / a.length, c = "";
        c += "M" + (this.x_padding_left - 1) + "," + (this.options.height - this.y_padding_bottom - b), c += "L" + (this.graph_width + this.x_padding_left) + "," + (this.options.height - this.y_padding_bottom - b), this.paper.path(c).attr(this.options.meanline)
    }, drawAxis:function () {
        var a = "";
        a += "M" + (this.x_padding_left - 1) + "," + (this.options.height - this.y_padding_bottom), a += "L" + (this.graph_width + this.x_padding_left) + "," + (this.options.height - this.y_padding_bottom), a += "M" + (this.x_padding_left - 1) + "," + (this.options.height - this.y_padding_bottom), a += "L" + (this.x_padding_left - 1) + "," + this.y_padding_top, this.paper.path(a).attr({stroke:this.options.label_colour})
    }, makeValueLabels:function (a) {
        var b = this.label_step, c = this.start_value, d = [];
        for (var e = 0; e < a; e++)c = this.roundValue(c + b, 2), d.push(c);
        return d
    }, drawMarkers:function (a, b, c, d, e, f) {
        function h(a) {
            return a * b[1]
        }

        function g(a) {
            return a * b[0]
        }

        var i = this.x_padding_left - 1 + g(d), j = this.options.height - this.y_padding_bottom + h(d), k = "", l = {font:this.options.font_size + 'px "Arial"', stroke:"none", fill:"#000"};
        Object.extend(l, f || {});
        for (var m = 0; m < a.length; m++)k += "M" + i + "," + j, typeof a[m] != "undefined" && (a[m] + "").length > 0 && (k += "L" + (i + h(5)) + "," + (j + g(5)), this.paper.text(i + e[0], j - e[1], a[m]).attr(l).toFront()), i = i + g(c), j = j + h(c);
        this.paper.path(k).attr({stroke:this.options.label_colour})
    }, drawVerticalLabels:function () {
        var a = this.graph_height / this.y_label_count;
        this.drawMarkers(this.value_labels, [0, -1], a, a, [-8, -2], {"text-anchor":"end"})
    }, drawHorizontalLabels:function () {
        this.drawMarkers(this.options.labels, [1, 0], this.step, this.options.plot_padding, [0, (this.options.font_size + 7) * -1])
    }}), b.BarGraph = function () {
        this.initialize.apply(this, arguments)
    }, Object.extend(b.BarGraph.prototype, b.BaseGraph.prototype), Object.extend(b.BarGraph.prototype, {chartDefaults:function () {
        return{plot_padding:0}
    }, normaliserOptions:function () {
        return{start_value:0}
    }, setChartSpecificOptions:function () {
        this.bar_padding = 5, this.bar_width = this.calculateBarWidth(), this.options.plot_padding = this.bar_width / 2, this.step = this.calculateStep(), this.grid_start_offset = this.bar_padding - 1, this.start_y = this.options.height - this.y_padding_bottom
    }, calculateBarWidth:function () {
        return this.graph_width / this.data_size - this.bar_padding
    }, calculateStep:function () {
        return(this.graph_width - this.options.plot_padding * 2 - this.bar_padding * 2) / c(this.data_size)
    }, drawPlot:function (a, b, c, d, e) {
        c = c + this.bar_padding, b += "M" + c + "," + this.start_y, b += "L" + c + "," + d, this.paper.path(b).attr({stroke:e, "stroke-width":this.bar_width + "px"}), b = "", c = c + this.step, b += "M" + c + "," + this.start_y;
        return b
    }, drawHorizontalLabels:function () {
        var a = this.bar_padding + this.options.plot_padding;
        this.drawMarkers(this.options.labels, [1, 0], this.step, a, [0, (this.options.font_size + 7) * -1])
    }}), b.HorizontalBarGraph = function () {
        this.initialize.apply(this, arguments)
    }, Object.extend(b.HorizontalBarGraph.prototype, b.BaseGraph.prototype), Object.extend(b.HorizontalBarGraph.prototype, {setChartSpecificOptions:function () {
        this.y_padding_top = 0, this.x_padding_left = 20 + this.longestLabel() * (this.options.font_size / 2), this.bar_padding = 5, this.bar_width = this.calculateBarHeight(), this.options.plot_padding = 0, this.step = this.calculateStep()
    }, normalise:function (a) {
        var b = this.x_padding_left;
        return a / this.range * (this.graph_width - b)
    }, calculateBarHeight:function () {
        return this.graph_height / this.data_size - this.bar_padding
    }, calculateStep:function () {
        return(this.options.height - this.y_padding_bottom) / c(this.data_size)
    }, drawLines:function (a, b, c) {
        var d = this.x_padding_left + this.options.plot_padding * 2, e = this.options.height - this.y_padding_bottom - this.step / 2, f = "M" + d + "," + e, g;
        for (g = 0; g < c.length; g++)f += "L" + (d + c[g] - this.normalise(this.start_value)) + "," + e, e = e - this.step, f += "M" + d + "," + e;
        this.paper.path(f).attr({stroke:b, "stroke-width":this.bar_width + "px"})
    }, drawFocusHint:function () {
        var a = 5, b = this.x_padding_left + this.step * 2, c = this.options.height - this.y_padding_bottom, d = "";
        d += "M" + b + "," + c, d += "L" + (b - a) + "," + (c + a), d += "M" + (b - a) + "," + c, d += "L" + (b - a * 2) + "," + (c + a), this.paper.path(d).attr({stroke:this.options.label_colour, "stroke-width":2})
    }, drawVerticalLabels:function () {
        var a = this.step / 2 - this.options.plot_padding * 2;
        this.drawMarkers(this.options.labels, [0, -1], this.step, a, [-8, this.options.font_size / 8], {"text-anchor":"end"})
    }, drawHorizontalLabels:function () {
        var a = this.graph_width / this.y_label_count, b = this.makeValueLabels(this.y_label_count);
        this.drawMarkers(b, [1, 0], a, a, [0, (this.options.font_size + 7) * -1])
    }}), b.LineGraph = function () {
        this.initialize.apply(this, arguments)
    }, Object.extend(b.LineGraph.prototype, b.BaseGraph.prototype), Object.extend(b.LineGraph.prototype, {normalise:function (a) {
        var b = this.start_value === 0 ? this.top_value : this.top_value - this.start_value;
        return a / b * this.graph_height
    }, chartDefaults:function () {
        return{plot_padding:10}
    }, setChartSpecificOptions:function () {
        this.x_padding_left = 30 + this.longestLabel(this.value_labels) * (this.options.font_size / 2), typeof this.options.curve_amount == "undefined" && (this.options.curve_amount = 10)
    }, normaliserOptions:function () {
        return{start_value:this.options.start_value}
    }, calculateStep:function () {
        return(this.graph_width - this.options.plot_padding * 2) / c(this.data_size)
    }, startPlot:function (a, b, c, d) {
        this.lastPoint = {x:b, y:c};
        return a + "M" + b + "," + c
    }, drawPlot:function (a, b, c, d, e) {
        var f = this.options.curve_amount;
        if (this.options.markers === "circle") {
            var g = this.paper.circle(c, d, this.options.marker_size);
            g.attr({"stroke-width":"1px", stroke:this.options.background_colour, fill:e})
        }
        if (a === 0)return this.startPlot(b, c, d, e);
        f ? b += ["C", this.lastPoint.x + f, this.lastPoint.y, c - f, d, c, d] : b += "L" + c + "," + d, this.lastPoint = {x:c, y:d};
        return b
    }}), b.SparkLine = function () {
        this.initialize.apply(this, arguments)
    }, b.SparkLine.prototype = {initialize:function (a, b, c) {
        this.element = a, this.data = b, this.options = {width:parseInt(d(a, "width"), 10), height:parseInt(d(a, "height"), 10), highlight:!1, background_colour:d(a, "backgroundColor") || "#ffffff", colour:"#036"}, Object.extend(this.options, c || {}), this.step = this.calculateStep(), this.paper = Raphael(this.element, this.options.width, this.options.height), this.options.acceptable_range ? this.background = this.paper.rect(0, this.options.height - this.normalise(this.options.acceptable_range[1]), this.options.width, this.options.height - this.normalise(this.options.acceptable_range[0])) : this.background = this.paper.rect(0, 0, this.options.width, this.options.height), this.background.attr({fill:this.options.background_colour, stroke:"none"}), this.draw()
    }, calculateStep:function () {
        return this.options.width / c(this.data.length)
    }, normalise:function (a) {
        return this.options.height / this.data.max() * a
    }, draw:function () {
        var a = this.normaliseData(this.data);
        this.drawLines("", this.options.colour, a), this.options.highlight && this.showHighlight(a)
    }, drawLines:function (a, c, d) {
        var e = "", f = 0, g = d.slice(1), h = 0;
        e = "M0," + (this.options.height - d[0]);
        for (h = 1; h < d.length; h++)f = f + this.step, e += "L" + f + "," + b.round(this.options.height - d[h], 2);
        this.paper.path(e).attr({stroke:c}), this.lastPoint = {x:0, y:this.options.height - d[0]}
    }, showHighlight:function (a) {
        var b = 2, c = this.options.width - b, d = this.options.highlight.index || a.length - 1, e = a[d] + Math.round(b / 2);
        typeof this.options.highlight.index != "undefined" && (c = this.step * this.options.highlight.index);
        var f = this.paper.circle(c, this.options.height - e, b);
        f.attr({stroke:!1, fill:this.options.highlight.colour})
    }}, Object.extend(b.SparkLine.prototype, b.Base), b.SparkBar = function () {
        this.initialize.apply(this, arguments)
    }, Object.extend(b.SparkBar.prototype, b.SparkLine.prototype), Object.extend(b.SparkBar.prototype, {calculateStep:function () {
        return this.options.width / c(this.data.length)
    }, drawLines:function (a, b, c) {
        var d = this.step > 2 ? this.step - 1 : this.step, e = d, f = "", g = 0;
        for (g = 0; g < c.length; g++)f += "M" + e + "," + (this.options.height - c[g]), f += "L" + e + "," + this.options.height, e = e + this.step;
        this.paper.path(f).attr({stroke:b, "stroke-width":d})
    }}), a.Ico = b
})(typeof window == "undefined" ? this : window)