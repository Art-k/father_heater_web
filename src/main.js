import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

Vue.filter('format_date', function (timestamp) {
  let DateObj = new Date(timestamp);
  let Day = DateObj.getDate().toString().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate();
  let Month = DateObj.getMonth()+1;
  if (Month<10) {
    Month = '0'+Month
  }
  let Year = DateObj.getFullYear();
  let Hours = DateObj.getHours().toString().length === 2 ? DateObj.getHours() : '0'+DateObj.getHours();
  let Minutes = DateObj.getMinutes().toString().length === 2 ? DateObj.getMinutes() : '0'+DateObj.getMinutes();
  let Seconds = DateObj.getSeconds().toString().length === 2 ? DateObj.getSeconds() : '0'+DateObj.getSeconds();
  return Day+'.'+Month+'.'+Year+' '+Hours+':'+Minutes+':'+Seconds;
});


Vue.filter('format_uts_date', function (timestamp) {
  let DateObj = new Date(timestamp * 1000);
  let Day = DateObj.getDate().toString().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate();
  let Month = DateObj.getMonth()+1;
  let MonthS = '';
  if (Month < 10) {
    MonthS = '0' + Month
  }else {
    MonthS = Month
  }
  let Year = DateObj.getFullYear();
  let Hours = DateObj.getHours().toString().length === 2 ? DateObj.getHours() : '0'+DateObj.getHours();
  let Minutes = DateObj.getMinutes().toString().length === 2 ? DateObj.getMinutes() : '0'+DateObj.getMinutes();
  let Seconds = DateObj.getSeconds().toString().length === 2 ? DateObj.getSeconds() : '0'+DateObj.getSeconds();
  return Day+'.'+MonthS+'.'+Year+' '+Hours+':'+Minutes+':'+Seconds;
});


Vue.filter('format_seconds', function (timestamp) {
  let Hours = timestamp / 3600;
  if (Hours<10){Hours = '0'+Hours}
  let Minutes = (timestamp % 3600) / 60;
  if (Minutes<10){Minutes = '0'+Minutes}
  let Seconds = 0;
  if (Seconds<10){Seconds = '0'+Seconds}
  return Hours+':'+Minutes+':'+Seconds;
});

new Vue({
  render: h => h(App),
}).$mount('#app');
