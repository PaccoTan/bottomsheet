data = [];
chart = null;
function drawChart(data,categories, destination){
  now = new Date();
  time = now.getHours();
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
      tickAmount: 4,
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
        mounted: function (chartContext, config){
          let width =config.globals.seriesXvalues[0][2] - config.globals.seriesXvalues[0][1];
          if(categories.indexOf(time) == 0){
            width = config.globals.seriesXvalues[0][categories.indexOf(time)] + width/2;
          }else{
            width = config.globals.seriesXvalues[0][categories.indexOf(time)] - width/2;
          }
          fillInfoBar(data[categories.indexOf(time)],time,width,config.globals.svgWidth);
        },
        updated: function (chartContext, config){
          let width =config.globals.seriesXvalues[0][2] - config.globals.seriesXvalues[0][1];
          if(categories.indexOf(time) == 0){
            width = config.globals.seriesXvalues[0][categories.indexOf(time)] + width/2;
          }else{
            width = config.globals.seriesXvalues[0][categories.indexOf(time)] - width/2;
          }
          val = config.globals.series[0][categories.indexOf(time)];
          console.log(config)
          fillInfoBar(val,time,width,config.globals.svgWidth);
        },
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
  if(chart == null){
    chart = new ApexCharts(document.querySelector(destination), options);
  }
  chart.render();
}

function infoBar(_, config){
  let index = config.dataPointIndex;
  let seriesIndex = config.seriesIndex;
  let series = config.w.config.series[seriesIndex];
  let data = series.data[index];
  let militaryTime = config.w.config.xaxis.categories[index];
  let width = config.w.globals.seriesXvalues[seriesIndex][2]-config.w.globals.seriesXvalues[seriesIndex][1]
  if(index == 0){
    width = config.w.globals.seriesXvalues[seriesIndex][index] + width/2;
  }else{
    width = config.w.globals.seriesXvalues[seriesIndex][index]-width/2;
  }
  maxWidth = config.w.globals.svgWidth;
  fillInfoBar(data,militaryTime,width,maxWidth);
}

function fillInfoBar(value,militaryTime,width,maxWidth){
  let time = "";
  if(militaryTime%12 == 0){
    time+= 12;
  }else{
    time += militaryTime%12;
  }
  time += (militaryTime/12 < 1 )? "AM" : "PM";

  let result = "";
  color = "";
  if(value <= 0.25){
    result += "Parking lot is mostly empty."
    color = "#7bb662"
  }else if(value <=0.5){
    result += "Parking spaces available."
    color = "#ffcd01"
  }else if(value <=0.75){
    result += "More cars than usual."
    color = "#ff980e"
  }else if(value <=1){
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
  if(width + box.right - box.left > maxWidth){
    width = maxWidth - box.right + box.left;
    width = width - maxWidth*0.03;
  }
  if(width < 0){
    width = maxWidth*0.03;
  }
  el.style.left = `${width}px`;
}

jQuery(function($){
  $('.tab div').on('click', function(){
    $('.tab .active').removeClass('active');
    $(this).addClass('active');
  });
});

function setDay(){
  now = new Date();
  day = now.getDay();
  hours = Array.apply(null, Array(24)).map(function (x, i) { return i; })
  drawChart(data[day],hours, "#parking-times");
  day = ["SUN","MON","TUE","WED","THU","FRI","SAT"][day];
  days = document.getElementsByClassName("center-parent");
  for(d of days){
    if(d.innerText == day){
      d.classList.add("active");
      break;
    }
  }
}


// drawChart([0.3,0.1,0.75,0.25,0.5,1,0,0.1,0.2,0.3,0.4,0.5,0,0.1,0.2,0.3,0.4,0.5,0,0.1,0.2,0.3,0.4],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],"#parking-times")

function getOccupancy(start,end,lotName){
  xhr = new XMLHttpRequest();
  xhr.open("GET", `http://localhost:3000/occupancy?start=${start}&end=${end}&lotName=${lotName}`, false)
  xhr.send(null);
  range = JSON.parse(xhr.responseText);
  return range;
}

function setData(lotName){
  now = new Date();
  end = Math.floor(now.getTime / 1000);
  start = Math.floor(now.setMonth((now.getMonth()-1))/1000);
  range = getOccupancy(start,end,lotName);
  console.log(range)
  let dayHour = Array(7).fill().map(() => Array(24).fill(0));
  let count = Array(7).fill().map(() => Array(24).fill(0));
  for(r of range){
    t = new Date(r.time*1000);
    dayHour[t.getDay()][t.getHours()] += r.info.num_parked/r.info.max_occup;
    count[t.getDay()][t.getHours()] += 1;
  }
  for(i =0; i<dayHour.length; i++){
    for(j=0; j<dayHour[i].length; j++){
      if(count[i][j] == 0){
        continue;
      }
      dayHour[i][j] = dayHour[i][j]/count[i][j];
    }
  }
  data = dayHour;
}

function changeDay(i){
  chart.updateSeries([{data: data[i]}])
}

setData("Touchdown Village Commuter Lot");
setDay();
