function drawChart(data,categories, destination){
  now = new Date();
  time = now.getHours();
  console.log(data[categories.indexOf(time)]);
  categories2 = [];
  let start = Math.floor((categories.length-1)%4/2);
  for(i=0; i<categories.length; i++){
    if(i%4 == start){
      let result = categories[i]%12;
      if(result == 0){
        result = 12;
      }
      result += (categories[i]/12 > 1 )? "p" : "a";
      categories2.push(result);
    }else{
      categories2.push("");
    }
  }
  var options = {
    series: [{
        name: 'sales',
        data: data,
    }],
    xaxis:{
      type: "category",
      categories: categories,
      overwriteCategories: categories2,
      labels: {
        show: true,
        offsetY: 5,
        style: {
          fontSize: "1.75rem",
        },
      },
      axisBorder: {
        height: 5,
      },
    },
    yaxis:{
      labels:{
        show: false,
      },
      max: 1,
    },
    chart: {
      type: 'bar',
      stacked: false,
      height: 500,
      width:"100%",
      // zoom: {
      //   enabled: true,
      //   autoScaleYaxis: true
      // },
      // pan: {
      //   enabled: true,
      // },
      toolbar: {
        show: false,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: []
        },
      },
      events:{
        dataPointSelection: function(event, chartContext, config) {
          infoBar(chartContext, config);
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '50%',
        rangeBarGroupRows: true
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: false,
      x: {
        show: true,
        formatter: function(value) {
          let result = value%12;
          if(result == 0){
            result = 12;
          }
          result += (value/12 < 1 )? ":00 am" : ":00 pm";
          return result;
        }
      },
      y:{
        show: true,
        formatter: function(value){
          result = "Projected Occupancy: " + value*100 + "%";
          return result;
        },
        title: {
          formatter: function(value){
            return "";
          }
        }
      },
      style: {
        fontSize: "1.5rem",
      }
    },
    states: {
      normal: {
          filter: {
              type: 'none',
              value: 0,
          }
      },
      hover: {
          filter: {
              type: 'lighten',
              value: 0.15,
          }
      },
      active: {
          allowMultipleDataPointsSelection: false,
          filter: {
              type: 'none',
              value: 0,
          }
      },
    }
  };

  var chart = new ApexCharts(document.querySelector(destination), options);
  chart.render();
}

function infoBar(_, config){
  let index = config.dataPointIndex;
  let seriesIndex = config.seriesIndex;
  let series = config.w.config.series[seriesIndex];
  let data = series.data[index];
  let militaryTime = config.w.config.xaxis.categories[index];

  let width = config.w.globals.seriesXvalues[seriesIndex][2]-config.w.globals.seriesXvalues[seriesIndex][1]
  width = config.w.globals.seriesXvalues[seriesIndex][index]-width/2;
  let time = "";
  if(militaryTime%12 == 0){
    time+= 12;
  }else{
    time += militaryTime%12;
  }
  time += (militaryTime/12 < 1 )? "AM" : "PM";

  let result = "";
  color = "";
  if(data <= 0.25){
    result += "Parking lot is mostly empty."
    color = "#7bb662"
  }else if(data <=0.5){
    result += "Parking spaces available."
    color = "#ffcd01"
  }else if(data <=0.75){
    result += "More cars than usual."
    color = "#ff980e"
  }else if(data <=1){
    result += "Parking spaces limited."
    color = "#d3212c"
  }else {
    result = "Error invalid %"
  }
  el = document.getElementById("info-bar");
  el.style.left = `${width}px`;
  el = document.getElementById("info");
  el.innerHTML = `<span class="time"><i class="fa-solid fa-user-group"></i>${time}</span>
                  <span class="text" style ="color: ${color}">${result}</span>`;
  box = el.getBoundingClientRect();
  width = width - (box.right-box.left)/2;
  if(width + box.right - box.left > config.w.globals.svgWidth){
    width = config.w.globals.svgWidth - box.right + box.left;
    width = width - config.w.globals.svgWidth*0.03;
  }
  if(width < 0){
    width = config.w.globals.svgWidth*0.03;
  }
  el.style.left = `${width}px`;
}

drawChart([0,0.1,0.75,0.25,0.5,1,0,0.1,0.2,0.3,0.4,0.5,0,0.1,0.2,0.3,0.4,0.5,0,0.1,0.2,0.3,0.4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],"#parking-times")
