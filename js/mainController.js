angular.module('ChartDash')
  .controller('mainController', function($scope){
    $scope.title = 'Charts';

    var data = {
      // A labels array that can contain any sort of values
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      // Our series array that contains series objects or in this case series data arrays
      series: [
        [5, 2, 4, 2, 0]
      ]
    };

    // Create a new line chart object where as first parameter we pass in a selector
    // that is resolving to our chart container element. The Second parameter
    // is the actual data object.
    new Chartist.Line('.ct-chart1', data);

    // // 2nd Graph
    // // Our labels and three data series
    // var data2 = {
    //   labels: ['Week1', 'Week2', 'Week3', 'Week4', 'Week5', 'Week6'],
    //   series: [
    //     [5, 4, 3, 7, 5, 10],
    //     [3, 2, 9, 5, 4, 6],
    //     [2, 1, -3, -4, -2, 0]
    //   ]
    // };
    //
    // // We are setting a few options for our chart and override the defaults
    // var options = {
    //   // Don't draw the line chart points
    //   showPoint: false,
    //   // Disable line smoothing
    //   lineSmooth: false,
    //   // X-Axis specific configuration
    //   axisX: {
    //     // We can disable the grid for this axis
    //     showGrid: false,
    //     // and also don't show the label
    //     showLabel: false
    //   },
    //   // Y-Axis specific configuration
    //   axisY: {
    //     // Lets offset the chart a bit from the labels
    //     offset: 60,
    //     // The label interpolation function enables you to modify the values
    //     // used for the labels on each axis. Here we are converting the
    //     // values into million pound.
    //     labelInterpolationFnc: function(value) {
    //       return '$' + value + 'm';
    //     }
    //   }
    // };
    //
    // // All you need to do is pass your configuration as third parameter to the chart function
    // new Chartist.Line('.ct-chart2', data2, options);


    // Animated circle graph
    var chart = new Chartist.Pie('.ct-chart', {
      series: [10, 20, 50, 20, 5, 50, 15],
      labels: [1, 2, 3, 4, 5, 6, 7]
    }, {
      donut: true,
      showLabel: false
    });

    chart.on('draw', function(data) {
      if(data.type === 'slice') {
        // Get the total path length in order to use for dash array animation
        var pathLength = data.element._node.getTotalLength();

        // Set a dasharray that matches the path length as prerequisite to animate dashoffset
        data.element.attr({
          'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
        });

        // Create animation definition while also assigning an ID to the animation for later sync usage
        var animationDefinition = {
          'stroke-dashoffset': {
            id: 'anim' + data.index,
            dur: 1000,
            from: -pathLength + 'px',
            to:  '0px',
            easing: Chartist.Svg.Easing.easeOutQuint,
            // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
            fill: 'freeze'
          }
        };

        // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
        if(data.index !== 0) {
          animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
        }

        // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
        data.element.attr({
          'stroke-dashoffset': -pathLength + 'px'
        });

        // We can't use guided mode as the animations need to rely on setting begin manually
        // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
        data.element.animate(animationDefinition, false);
      }
    });

    // For the sake of the example we update the chart every time it's created with a delay of 8 seconds
    chart.on('created', function() {
      if(window.__anim21278907124) {
        clearTimeout(window.__anim21278907124);
        window.__anim21278907124 = null;
      }
      window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
    });

    // Bar Graph
    var count = 50;
    var max = 100;

    // Creating a bar chart with no labels and a series array with one series. For the series we generate random data with `count` elements and random data ranging from 0 to `max`.
    var chartBar = new Chartist.Bar('.ct-chart3', {
      labels: Chartist.times(count),
      series: [
        Chartist.times(count).map(Math.random).map(Chartist.mapMultiply(max))
      ]
    }, {
      axisX: {
        showLabel: false
      },
      axisY: {
        onlyInteger: true
      }
    });

    // This is the bit we are actually interested in. By registering a callback for `draw` events, we can actually intercept the drawing process of each element on the chart.
    chartBar.on('draw', function(context) {
      // First we want to make sure that only do something when the draw event is for bars. Draw events do get fired for labels and grids too.
      if(context.type === 'bar') {
        // With the Chartist.Svg API we can easily set an attribute on our bar that just got drawn
        context.element.attr({
          // Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
          style: 'stroke: hsl(' + Math.floor(Chartist.getMultiValue(context.value) / max * 100) + ', 50%, 50%);'
        });
      }
    });

    //Chart #5
    new Chartist.Line('.ct-chart5', {
  labels: [1, 2, 3, 4, 5, 6, 7, 8],
  series: [
    [1, 2, 3, 1, -2, 0, 1, 0],
    [-2, -1, -2, -1, -2.5, -1, -2, -1],
    [0, 0, 0, 1, 2, 2.5, 2, 1],
    [2.5, 2, 1, 0.5, 1, 0.5, -1, -2.5]
  ]
}, {
  high: 3,
  low: -3,
  showArea: true,
  showLine: false,
  showPoint: false,
  fullWidth: true,
  axisX: {
    showLabel: false,
    showGrid: false
  }
});

//Chart #6
var chart6 = new Chartist.Line('.ct-chart6', {
labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
series: [
  [1, 5, 2, 5, 4, 3],
  [2, 3, 4, 8, 1, 2],
  [5, 4, 3, 2, 1, 0.5]
]
}, {
low: 0,
showArea: true,
showPoint: false,
fullWidth: true
});

chart.on('draw', function(data) {
if(data.type === 'line' || data.type === 'area') {
  data.element.animate({
    d: {
      begin: 2000 * data.index,
      dur: 2000,
      from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
      to: data.path.clone().stringify(),
      easing: Chartist.Svg.Easing.easeOutQuint
    }
  });
}
});

  });
