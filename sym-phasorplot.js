import "acwf-canvas.js"
import "acwf-core.js"

(function (PV) {
    'use strict';

    function phasorplot() { }
    PV.deriveVisualizationFromBase(phasorplot);

    phasorplot.prototype.init = function (scope) {
        this.onDataUpdate = dataUpdate;
        this.onResize = dataUpdate;
        this.onDataUpdate(scope);
    };
    function dataUpdate(data) {
        var sampleData = {
            title: "Sample Data",
            lineFrequency: 60,
            samplesPerCycle: 32,
            data: [
                {
                    samples: [92.31,178.69,263.37,338.26,397.56,446.62,482.69,490.78,478.83,458.68,415.66,358.41,282.72,188.59,97.43,7.63,-88.44,-175.85,-260.3,-334.39,-393.01,-441.95,-478.94,-486.34,-474.73,-455.72,-412.93,-356.81,-279.08,-185.98,-94.92,-5.58],
                    label: "V1",
                    unit: "Voltage",
                    phase: "1"
                },
            ]
        };
        // generate a waveform set from the source data; this can contain multiple 
        // series of waveform data that contain multiple cycles of wavefom samples.
        var wfSet = ACWF.WaveformSet.create(sampleData);
        // analyze a cycle of data starting at the specified sample 
        wfSet.analyze(0);
        // initialize the phasor plot to display itself inside the element
        // with id="phasor"
        var phasor = new ACWF.PhasorDiagram("phasor");
        // plot the waveform data
        phasor.plotWaveformSet(wfSet, 0);
    }

    var definition = {
        typeName: 'phasorplot',
        displayName: 'Phasor Plot',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
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
    PV.symbolCatalog.register(definition);
})(window.PIVisualization);