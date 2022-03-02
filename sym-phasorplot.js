(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

	phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            if(data) {
                scope.value = 150;
                scope.value2 = 150;
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
        },
        configTitle: 'Format Symbol',
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);