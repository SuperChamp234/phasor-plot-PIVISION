(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

	phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            var test_data = {
                vector1_mag: 50,
                vector1_angle: 60,
            }
            if(data) {
                scope.h = 150;
                scope.w = 150;
                scope.cx= 150/2;
                scope.cy = 150/2;
                scope.circleR = vector1_mag;
                [scope.l1ex2, scope.l1ey2] = drawLine(scope, test_data.vector1_mag, vector1_angle);
            }
        }
            function drawLine(scope, vectorMag, vectorAng){
                var x2 = scope.cx + vectorMag * Math.cos(vectorAng);
                var y2 = scope.cy + vectorMag * Math.sin(vectorAng);
                return [x2,y2];
            }
    };

    var definition = {
        typeName: 'phasorplot',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        visObjectType: phasorplot,
        getDefaultConfig: function() {
            return {
                DataShape: 'Gauge',
                Frame_Height: 150,
                Frame_Width: 150
            };
        },
        configTitle: 'Format Symbol',
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);