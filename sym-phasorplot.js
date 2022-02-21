(function (PV) {
    'use strict';

    function phasorplot() { }
    PV.deriveVisualizationFromBase(phasorplot);

    phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;
        this.onResize = draw;
        this.onDataUpdate(scope);
    };

    var phasorData = {
        scalePositions: [],
        scaleLabels: [],
        time: "",
        startIndicatorPosition: undefined,
        indicatorPosition: undefined,
        currentValue: '...',
        center: { x: 100, y: 100 },
        radius: 50,
        faceAngle: 360,
        showScaleLabels: 'all',
        ShowValue: true,
        drawHandler: function () { }
    }

    function dataUpdate(data) {
        phasorData.currentValue = data.Value;
        phasorData.time = data.Time;

        gaugeData.scalePositions = data.ValueScalePositions || [];
        gaugeData.scaleLabels = data.ValueScaleLabels || [];
        
        setLayout();
    }

    function setLayout() {
        var charHeight = PV.RadialGauge.fontMetrics.charHeight;
        var charHeight_2 = charHeight / 2;
        var scalePadding = PV.RadialGauge.scaleTextPadding;

        var centerX = scope.position.width / 2;
        var availableHeight = scope.position.height;
        var offsetY = 0;
        var lineHeight = charHeight * 1.8;

        // phasorData.drawHandler = PV.RadialGauge.pointers[scope.config.IndicatorType] ? drawPointer : drawArc;
        phasorData.drawHandler = drawArc;
        scope.valueInside = scope.config.IndicatorType === 'triangle' || scope.config.IndicatorType === 'arc';

        if (scope.config.ShowLabel) {
            scope.symbolLabel.x = centerX;
            if (scope.config.LabelLocation === 'top') {
                offsetY += lineHeight;
                scope.symbolLabel.y = charHeight * 1.2;
            } else {
                scope.symbolLabel.y = availableHeight - charHeight_2;
            }
            availableHeight -= lineHeight;
        }

        var height_2 = availableHeight / 2;
        var radians = percentToRadians(100);
        var bottomHeight = height_2 * Math.sin(radians);
        var faceHeight_2 = (availableHeight - (height_2 + bottomHeight)) / 2;

        gaugeData.radius = Math.min(height_2 + faceHeight_2, centerX - scalePadding * 2);
        offsetY += faceHeight_2;


    }

    function drawArc() {
        var innerEnd, outerEnd, startPercent, endPercent, largeSweep;

        // Scale inner radius based on indicator weight and size of symbol
        var innerRadius = (gaugeData.radius * (99.5 - 10 * (+scope.config.IndicatorWeight || 2) - 1) / 100) - (scope.config.BorderWidth / 2);
        var radians = percentToRadians(0);
        var innerStart = xyFromVector(innerRadius, radians);

        var outerRadius = gaugeData.radius - scope.config.BorderWidth / 2;
        var outerStart = xyFromVector(outerRadius, radians);

        if (!updateIndicatorOnly) {
            // Draw the bounding ring and scale
            radians = percentToRadians(100);
            innerEnd = xyFromVector(innerRadius, radians);
            outerEnd = xyFromVector(outerRadius, radians);
            scope.gaugeFace = 'M' + outerStart.x + ' ' + outerStart.y
                + ' A' + outerRadius + ' ' + outerRadius + ' 0 1 1 ' + outerEnd.x + ' ' + outerEnd.y
                + ' L' + innerEnd.x + ' ' + innerEnd.y
                + ' A' + innerRadius + ' ' + innerRadius + ' 0 1 0 ' + innerStart.x + ' ' + innerStart.y
                + ' z';

            updateScale(gaugeData.radius, gaugeData.radius);
        }
    }

    function percentToRadians(percent) {
        var degrees = gaugeData.faceAngle * percent / 100;
        degrees -= (gaugeData.faceAngle / 2) + 90;
        return degrees / 360 * 2 * Math.PI;
    }
    function xyFromVector(length, radians) {
        return {
            x: (gaugeData.center.x + length * Math.cos(radians)),
            y: (gaugeData.center.y + length * Math.sin(radians))
        };
    }
    function updateScale(innerRadius, outerRadius) {
        var charMidHeight = PV.RadialGauge.fontMetrics.charMidHeight;
        var tickRadius = outerRadius + PV.RadialGauge.scaleTextPadding;

        scope.tickMarks = '';
        scope.scaleLabels = [];

        if (gaugeData.showScaleLabels !== 'none') {
            gaugeData.scalePositions.forEach(function (percent, index) {
                if (gaugeData.showScaleLabels === 'all' || (gaugeData.showScaleLabels === 'ends' && (index === 0 || index === gaugeData.scalePositions.length - 1))) {
                    // Add tick mark pointing from center to position on the scale
                    var radians = percentToRadians(percent);

                    // Draw the label, adjust for horizontal and vertical position based on angle
                    var location = xyFromVector(tickRadius, radians);
                    scope.scaleLabels.push({
                        x: location.x,
                        y: location.y,
                        radians: radians,
                        dy: charMidHeight + Math.sin(radians) * charMidHeight,
                        align: percent < 47 ? 'end' : (percent > 53 ? 'start' : 'middle'),
                        text: gaugeData.scaleLabels[index]
                    });
                }
            });

            preventRadialScaleOverlap(scope.scaleLabels);

            scope.scaleLabels.forEach(function (label) {
                var start = xyFromVector(innerRadius, label.radians);
                var end = xyFromVector(tickRadius - 3, label.radians);
                scope.tickMarks += 'M' + start.x + ' ' + start.y + ' L' + end.x + ' ' + end.y;
            });
        }
    }
    function preventRadialScaleOverlap(scale) {
        if (scale.length <= 4) {
            return;
        }

        var charHeight = PV.RadialGauge.fontMetrics.charHeight;
        var checkLabel, topWidth_2, removedLabelY;

        // Prevent overlap at top if there is a label near the top of the circle
        var topIndex = Math.floor(scale.length / 2);
        var keepLabel = scale[topIndex];
        if (keepLabel.align === 'middle') {
            topWidth_2 = PV.RadialGauge.textWidth(keepLabel.text) / 2;
            checkLabel = scale[topIndex + 1];

            // Check to the right, save Y if removed
            if (keepLabel.y + charHeight >= checkLabel.y && keepLabel.x + topWidth_2 > checkLabel.x) {
                removedLabelY = scale.splice(topIndex + 1, 1).y;
            }

            // Check to the left, keep symmetric
            checkLabel = scale[topIndex - 1];
            if (removedLabelY === checkLabel.y || (keepLabel.y + charHeight >= checkLabel.y && checkLabel.x >= keepLabel.x - topWidth_2)) {
                scale.splice(topIndex - 1, 1);
            }
        }

        // Prevent overlap at end, save Y if removed
        keepLabel = scale[scale.length - 1];
        checkLabel = scale[scale.length - 2];
        removedLabelY = undefined;
        if (checkLabel.y + charHeight > keepLabel.y) {
            removedLabelY = scale.splice(scale.length - 2, 1).y;
        }

        // and at the start, keep symmetric
        keepLabel = scale[0];
        checkLabel = scale[1];
        if (removedLabelY === checkLabel.y || checkLabel.y + charHeight > keepLabel.y) {
            scale.splice(1, 1);
        }
    }

    var definition = {
        typeName: 'phasorplot',
        displayName: 'Phasor Plot',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        Fill : '#ffffff',
        Border : '#000000',
        BorderThickness : 1,
        iconURL: 'icons/sym-phasor.png',
        visObjectType: phasorplot,
        getDefaultConfig: function () {
            return {
                DataShape: 'Phasor',
                Height: 300,
                Width: 300,
                ShowLabels: true,
                ShowValues: true,
                ShowUOM: true,
                FaceAngle: 300,
                IndicatorType: 'pointer',
                IndicatorWeight: 2,
                BorderWidth: 3,
                valueInside: false,
            }
        }
    };
    PV.symbolCatalog.add(definition);

    
    PV.symbolCatalog.addCategorie('Phasor Plot', definition);

})(window.PIVisualization);