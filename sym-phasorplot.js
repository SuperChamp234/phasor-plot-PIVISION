(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

    phasorplot.prototype.init = function () {
    };

    var definition = {
        typeName: 'phasorplot',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Single,
        visObjectType: phasorplot,
        getDefaultConfig: function() {
            return {
                DataShape: 'Value',
                Frame_Height: 150,
                Frame_Width: 150
            };
        }
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);