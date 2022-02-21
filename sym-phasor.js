(function(PV) {
    'use strict';
    function phasorVis() {}
    PV.deriveVisualizationFromBase(phasorVis);

    var definition = {
        typeName: 'Phasor',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-phasor.png',
    

        getDefaultConfig: function() {
     return {
         Height: 100,
         Width: 100,
         DataShape: 'Gauge',
        ValueScale: false,
        ValueScaleSettings: {
            MinType: 2,
            MinValue: 0,
            MaxType: 2,
            MaxValue: 360,
        },
     }
    },
    visObjectType: phasorVis
        }
        
   phasorVis.prototype.init = function(scope,elem) {
       //this.onDataUpdate = this.onDataUpdate;

       //function onDataUpdate(newData) {
           //if(!newData) {
               //return;}
           //if(newData<0) {
               //var degrees = 360 - newData.Indicator;
           //}
           //if(newData>0) {
              // var degrees = newData.Indicator;
           //}

          // var svgPhasor = elem.find('.svg-phasor')[0];
          // svgPhasor.setAttribute('transform', 'rotate(' + degrees +'35 35)');
      // }
   }     


   PV.symbolCatalog.register(definition);

}) (window.PIVisualization);