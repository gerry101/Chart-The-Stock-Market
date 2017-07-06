var seriesOptions = [];

var Markit = {};

Markit.InteractiveChartApi = function(symbol,duration){
    this.symbol = symbol.toUpperCase();
    this.duration = duration;
    this.PlotChart();
};

Markit.InteractiveChartApi.prototype.PlotChart = function(){
      $.ajax({
        context: this,
    type: 'GET',
    url: '/getStockData?symbol='+this.symbol,
    success: function(data) {
        this.render(data);
         $('#symbolsearch').val('');
    }
  });
};

Markit.InteractiveChartApi.prototype._fixDate = function(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};

Markit.InteractiveChartApi.prototype._getOHLC = function(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = this._fixDate( dates[i] );
            var pointData = [
                dat,
                elements[0].DataSeries['open'].values[i],
                elements[0].DataSeries['high'].values[i],
                elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
};

Markit.InteractiveChartApi.prototype.render = function(data) {
    
    var ohlc = this._getOHLC(data);
    var groupingUnits = [[
        'week',                         
        [1]                             
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]];
    seriesOptions.push({name: this.symbol,data: ohlc, color: getRandomColor()});
    $('#chartDemoContainer').highcharts('StockChart', {
        
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Stocks'
        },

        yAxis: [{
            title: {
                text: 'OHLC'
            }
        }],
        
        series: seriesOptions,
        credits: {
            enabled:false
        }
    });
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}