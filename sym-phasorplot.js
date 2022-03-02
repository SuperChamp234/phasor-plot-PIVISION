(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

	phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            if(data) {
                scope.value = data.Value;
                scope.time = data.Time;
                if(data.Label) {
                    scope.label = data.Label;
                }
            }
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
        }
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);