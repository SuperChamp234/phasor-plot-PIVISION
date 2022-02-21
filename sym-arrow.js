(function (PV) {
'use strict';

function symbolVis() {}
PV.deriveVisualizationFromBase(symbolVis);

var definition = {
    typeName: 'Arrow',
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-arrow.png',

    configOptions: function() {
        return [
            {
    title: 'Format Arrow',
    mode: 'formatArrow',
             }
            ]
},

    getDefaultConfig: function()
    { return{
        Height: 80,
        Width: 80,
        DataShape: 'Gauge',
        ValueScale: false,
        ValueScaleSettings: {
            MinType: 2,
            MinValue: 0,
            MaxType: 2,
            MaxValue: 360,
        },
        LabelColor: 'grey',
        ValueColor: 'white',
        ShowLabel: false,
        ShowValue: true,
        ShowTimestamp: false,
        
    }
},

visObjectType: symbolVis,
}
symbolVis.prototype.init = function (scope, elem) {

    scope.Value = '';
    scope.Timestamp = '';
    scope.Label = '';
    scope.Units = '';
    this.onDataUpdate = onDataUpdate;

    function onDataUpdate(newData){
        if(!newData){
            return;
        }
        var degrees = 360 * newData.Indicator/100;

        var svgArrow= elem.find('.svg-arrow')[0];
        svgArrow.setAttribute('transform', 'rotate(' + degrees + '-7.235 35)');

        scope.Value = newData.Value;
        scope.Timestamp = newData.Time;

        if (newData.Label !== undefined) {
            scope.Label = newData.Label;
            if (newData.Units !== undefined) {
                scope.Units = '';
            }
            else {
                scope.Units = '';
            }
        }
    }
}

PV.symbolCatalog.register(definition);

}) (window.PIVisualization);