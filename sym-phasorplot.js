(function (CS) {
    function phasorplot() { }
    CS.deriveVisualizationFromBase(phasorplot);

	phasorplot.prototype.init = function (scope) {
        let state = {
            h: 150,
            w: 150,
            cx: 150/2,
            cy: 150/2,
            circleR: 50,
            IAang: 0,
            IBang: 0,
            ICang: 0,
            IAmag: 50,
            IBmag: 50,
            ICmag: 50,
            showIA: false,
            showIB: false,
            showIC: false,
        }
        this.onDataUpdate = dataUpdate;

        function dataUpdate(data) {
            if(data) {
                handleTable(data.Rows,state);
                draw(state,scope);
                console.log(data.Rows);
            }
        }
        function draw(state,scope){
            scope.h = state.h;
            scope.w = state.w;
            scope.cx = state.cx;
            scope.cy = state.cy;
            scope.circleR = state.circleR;
            scope.showIA = state.showIA;
            scope.showIB = state.showIB;
            scope.showIC = state.showIC;
            if (state.showIA) {
                [scope.lAex2, scope.lAey2] = plotLine(state, state.IAmag, parseInt(state.IAang))
            }
            if (state.showIB) {
                [scope.lBex2, scope.lBey2] = plotLine(state, state.IBmag, parseInt(state.IBang))
            }
            if (state.showIC) {
                [scope.lCex2, scope.lCey2] = plotLine(state, state.ICmag, parseInt(state.ICang))
            }
        }
        function plotLine(state, vectorMag, vectorAng){
            vectorAng = -3.14*(vectorAng/180);
            var x2 = state.cx + vectorMag * Math.cos(vectorAng);
            var y2 = state.cy + vectorMag * Math.sin(vectorAng);
            return [x2,y2];
        }
        //loop though an array of objects and find the one with the matching label
        function handleTable(Arr,state) {
            for (var i = 0; i < Arr.length; i++) {
                handleInput(Arr[i].Label, Arr[i].Value, state);
            }
        }
        function handleInput(Label, Value,state){
            LabelSplit = Label.split("|");
            if(LabelSplit[1] == "IAangle"){
                state.IAang = Value;
                state.showIA = true;
            } else if(LabelSplit[1] == "IBangle"){
                scope.IBang = Value;
                state.showIB = true;
            }
            else if(LabelSplit[1] == "ICangle"){
                scope.ICang = Value;
                state.showIC = true;
            }
        }
    };

    var definition = {
        typeName: 'phasorplot',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: phasorplot,
        getDefaultConfig: function() {
            return {
                DataShape: "Table",
                Frame_Height: 150,
                Frame_Width: 150
            };
        },
        configTitle: 'Format Symbol',
    };

    CS.symbolCatalog.register(definition);
})(window.PIVisualization);