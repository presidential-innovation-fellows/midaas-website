'use strict';

function addAccessor(obj, name, value) {
    obj[name] = function (_) {
        if (typeof _ === 'undefined') return obj.properties[name] || value;
        obj.properties[name] = _;
        return obj;
    };
}
// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
"use strict";

var colorbrewer = { Midaas: {
    11: ["#FFFFFF", "#E5F0F8", "#CCE2F1", "#B2D4EA", "#99C6E4", "#7FB8DD", "#66A9D6", "#4C9BD0", "#338DC9", "#197FC2", "#0071BC"]
  } };
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Geomap = (function () {
    function Geomap() {
        _classCallCheck(this, Geomap);

        // Set default properties optimized for naturalEarth projection.
        this.properties = {
            geofile: null,
            height: null,
            postUpdate: null,
            projection: d3.geo.naturalEarth,
            rotate: [0, 0, 0],
            scale: null,
            translate: null,
            unitId: 'iso3',
            unitPrefix: 'unit-',
            units: 'units',
            unitTitle: function unitTitle(d) {
                return d.properties.name;
            },
            width: null,
            zoomFactor: 4
        };

        // Setup methods to access properties.
        for (var key in this.properties) {
            addAccessor(this, key, this.properties[key]);
        } // Store internal properties.
        this._ = {};
    }

    _createClass(Geomap, [{
        key: 'clicked',
        value: function clicked(d) {
            var _this = this;

            var k = 1,
                x0 = this.properties.width / 2,
                y0 = this.properties.height / 2,
                x = x0,
                y = y0;

            if (d && d.hasOwnProperty('geometry') && this._.centered !== d) {
                var centroid = this.path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = this.properties.zoomFactor;
                this._.centered = d;
            } else this._.centered = null;

            this.svg.selectAll('path.unit').classed('active', this._.centered && function (_) {
                return _ === _this._.centered;
            });

            this.svg.selectAll('g.zoom').transition().duration(750).attr('transform', 'translate(' + x0 + ', ' + y0 + ')scale(' + k + ')translate(-' + x + ', -' + y + ')');
        }
    }, {
        key: 'draw',

        /**
         * Load geo data once here and draw map. Call update at the end.
         *
         * By default map dimensions are calculated based on the width of the
         * selection container element so they are responsive. Properties set before
         * will be kept.
         */
        value: function draw(selection, self) {
            if (!self.properties.width) self.properties.width = selection.node().getBoundingClientRect().width;

            if (!self.properties.height) self.properties.height = self.properties.width / 1.92;

            if (!self.properties.scale) self.properties.scale = self.properties.width / 5.8;

            if (!self.properties.translate) self.properties.translate = [self.properties.width / 2, self.properties.height / 2];

            self.svg = selection.append('svg').attr('width', self.properties.width).attr('height', self.properties.height);

            self.svg.append('rect').attr('class', 'background').attr('width', self.properties.width).attr('height', self.properties.height).on('click', self.clicked.bind(self));

            // Set map projection and path.
            var proj = self.properties.projection().scale(self.properties.scale).translate(self.properties.translate).precision(0.1);

            // Not every projection supports rotation, e. g. albersUsa does not.
            if (proj.hasOwnProperty('rotate') && self.properties.rotate) proj.rotate(self.properties.rotate);

            self.path = d3.geo.path().projection(proj);

            // Load and render geo data.
            d3.json(self.properties.geofile, function (error, geo) {
                self.geo = geo;
                self.svg.append('g').attr('class', 'units zoom').selectAll('path').data(topojson.feature(geo, geo.objects[self.properties.units]).features).enter().append('path').attr('class', function (d) {
                    return 'unit ' + self.properties.unitPrefix + '' + d.id;
                }).attr('d', self.path).on('click', self.clicked.bind(self)).append('title').text(self.properties.unitTitle);
                self.update();
            });
        }
    }, {
        key: 'update',
        value: function update() {
            if (this.properties.postUpdate) this.properties.postUpdate();
        }
    }]);

    return Geomap;
})();

d3.geomap = function () {
    return new Geomap();
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Choropleth = (function (_Geomap) {
    function Choropleth() {
        _classCallCheck(this, Choropleth);

        _get(Object.getPrototypeOf(Choropleth.prototype), 'constructor', this).call(this);

        var properties = {
            colors: colorbrewer.Midaas[11],
            column: null,
            domain: null,
            duration: null,
            format: d3.format(',.02f'),
            legend: false,
            valueScale: d3.scale.quantize
        };

        for (var key in properties) {
            this.properties[key] = properties[key];
            addAccessor(this, key, properties[key]);
        }
    }

    _inherits(Choropleth, _Geomap);

    _createClass(Choropleth, [{
        key: 'columnVal',
        value: function columnVal(d) {
            return +d[this.properties.column];
        }
    }, {
        key: 'draw',
        value: function draw(selection, self) {
            self.data = selection.datum();
            _get(Object.getPrototypeOf(Choropleth.prototype), 'draw', this).call(this, selection, self);
        }
    }, {
        key: 'update',
        value: function update() {
            var self = this;
            self.extent = d3.extent(self.data, self.columnVal.bind(self));
            self.colorScale = self.properties.valueScale().domain(self.properties.domain || self.extent).range(self.properties.colors);

            // Remove fill styles that may have been set previously.
            self.svg.selectAll('path.unit').style('fill', null);

            // Add new fill styles based on data values.
            self.data.forEach(function (d) {
                var uid = d[self.properties.unitId],
                    val = d[self.properties.column],
                    fill = self.colorScale(val);

                // selectAll must be called and not just select, otherwise the data
                // attribute of the selected path object is overwritten with self.data.
                var unit = self.svg.selectAll('.' + self.properties.unitPrefix + '' + uid);

                // Data can contain values for non existing units.
                if (!unit.empty()) {
                    if (self.properties.duration) unit.transition().duration(self.properties.duration).style('fill', fill);else unit.style('fill', fill);

                    // New title with column and value.
                    var text = self.properties.unitTitle(unit.datum());
                    val = self.properties.format(val);
                    unit.select('title').text('' + text + '\n\n' + self.properties.column + ': ' + val);
                }
            });

            if (self.properties.legend) self.drawLegend(self.properties.legend);

            // Make sure postUpdate function is run if set.
            _get(Object.getPrototypeOf(Choropleth.prototype), 'update', this).call(this);
        }
    }, {
        key: 'drawLegend',

        /**
         * Draw legend including color scale and labels.
         *
         * If bounds is set to true, legend dimensions will be calculated based on
         * the map dimensions. Otherwise bounds must be an object with width and
         * height attributes.
         */
        value: function drawLegend() {
            var bounds = arguments[0] === undefined ? null : arguments[0];

            var self = this,
                steps = self.properties.colors.length,
                wBox = undefined,
                hBox = undefined;

            var wFactor = 10,
                hFactor = 3;

            if (bounds === true) {
                wBox = self.properties.width / wFactor;
                hBox = self.properties.height / hFactor;
            } else {
                wBox = bounds.width;
                hBox = bounds.height;
            }

            var wRect = wBox / (wFactor * 0.75),
                hLegend = hBox - hBox / (hFactor * 1.8),
                offsetText = wRect / 2,
                offsetY = self.properties.height - hBox,
                tr = 'translate(' + offsetText + ',' + offsetText * 3 + ')';

            // Remove possibly existing legend, before drawing.
            self.svg.select('g.legend').remove();

            // Reverse a copy to not alter colors array.
            var colors = self.properties.colors.slice().reverse(),
                hRect = hLegend / steps,
                offsetYFactor = hFactor / hRect;

            var legend = self.svg.append('g').attr('class', 'legend').attr('width', wBox).attr('height', hBox).attr('transform', 'translate(0,' + offsetY + ')');

            legend.append('rect').style('fill', '#fff').attr('class', 'legend-bg').attr('width', wBox).attr('height', hBox);

            // Draw a rectangle around the color scale to add a border.
            legend.append('rect').attr('class', 'legend-bar').attr('width', wRect).attr('height', hLegend).attr('transform', tr);

            var sg = legend.append('g').attr('transform', tr);

            // Draw color scale.
            sg.selectAll('rect').data(colors).enter().append('rect').attr('y', function (d, i) {
                return i * hRect;
            }).attr('fill', function (d, i) {
                return colors[i];
            }).attr('width', wRect).attr('height', hRect);

            // Determine display values for lower and upper thresholds. If the
            // minimum data value is lower than the first element in the domain
            // draw a less than sign. If the maximum data value is larger than the
            // second domain element, draw a greater than sign.
            var minDisplay = self.extent[0],
                maxDisplay = self.extent[1],
                addLower = false,
                addGreater = false;

            if (self.properties.domain) {
                if (self.properties.domain[1] < maxDisplay) addGreater = true;
                maxDisplay = self.properties.domain[1];

                if (self.properties.domain[0] > minDisplay) addLower = true;
                minDisplay = self.properties.domain[0];
            }

            // Draw color scale labels.
            sg.selectAll('text').data(colors).enter().append('text').text(function (d, i) {
                // The last element in the colors list corresponds to the lower threshold.
                if (i === steps - 1) {
                    var text = self.properties.format(minDisplay);
                    if (addLower) text = '< ' + text;
                    return text;
                }
                return self.properties.format(self.colorScale.invertExtent(d)[0]);
            }).attr('class', function (d, i) {
                return 'text-' + i;
            }).attr('x', wRect + offsetText).attr('y', function (d, i) {
                return i * hRect + (hRect + hRect * offsetYFactor);
            });

            // Draw label for end of extent.
            sg.append('text').text(function () {
                var text = self.properties.format(maxDisplay);
                if (addGreater) text = '> ' + text;
                return text;
            }).attr('x', wRect + offsetText).attr('y', offsetText * offsetYFactor * 2);
        }
    }]);

    return Choropleth;
})(Geomap);

d3.geomap.choropleth = function () {
    return new Choropleth();
};
