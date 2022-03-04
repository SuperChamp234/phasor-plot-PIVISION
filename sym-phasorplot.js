(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

	phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            if(data) {
                //test data
                vectorMag=50;
                vectorAngle=60;
                //
                scope.h = 150;
                scope.w = 150;
                scope.cx= 150/2;
                scope.cy = 150/2;
                scope.circleR = vectorMag;
                l1ex2 = 150/2 + vectorMag * Math.cos(vectorAng);
                l1ey2 = 150/2 + vectorMag * Math.sin(vectorAng);
                // console.log(l1ex2);
                // console.log(l1ey2);
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