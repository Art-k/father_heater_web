<template>
  <div id="BoardChart">
    <!--{{ chartData }}-->
    <GChart
            type="LineChart"
            :data="chartData"
            :options="chartOptions"
    >

    </GChart>
  </div>
</template>

<script>
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import { ButtonGroupPlugin } from 'bootstrap-vue'

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    import Vue from 'vue'
    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);
    import VueGoogleCharts from 'vue-google-charts'
    import { GChart } from 'vue-google-charts'
    Vue.config.productionTip = false;
    Vue.use(VueGoogleCharts);



export default {
  name: 'BoardChart',
  components: {
      GChart
  },
  props: {
      board: String
  },
    data () {
      return {
          values: [],
          etalonchartData: [["Time", "Value"]],
          chartData:[],
          chartOptions: {
              chart: {
                  title: 'Company Performance',
                  subtitle: 'Sales, Expenses, and Profit: 2014-2017',
              }
          }
      }
    },
    mounted () {

//        axios
//              .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensors_data?mac='+this.board)
//              .then(response => (this.values = response.data));

        axios
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/chart?mac='+this.board)
            .then(response => {
                console.log(response.data.entity);
                let array = [];
                  for (let i=0; i < response.data.entity.length; i++){
                      response.data.entity[i]['CreatedAt'] = this.ISO_to_datetime(response.data.entity[i]['CreatedAt']);
//                      console.log(response.data.entity[i]);
                      array.push([response.data.entity[i]['CreatedAt'], response.data.entity[i]['Value']])
                  }
                  this.chartData = this.etalonchartData.concat(array);
                }
            );
    },
    methods:{
//        timestamp_to_datetime: function (timestamp){
//            let DateObj = new Date(timestamp*1000);
//            let result;
//            result = ( DateObj.getDate().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate() ) +'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()+':'+DateObj.getSeconds();
//            return result
//        },
        ISO_to_datetime: function (timestamp){
            let DateObj = new Date(timestamp);
            let Day = DateObj.getDate().toString().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate();
            let Month = DateObj.getMonth().toString().length === 2 ? DateObj.getMonth() : '0'+DateObj.getMonth();
            let Year = DateObj.getFullYear();
            let Hours = DateObj.getHours().toString().length === 2 ? DateObj.getHours() : '0'+DateObj.getHours();
            let Minutes = DateObj.getMinutes().toString().length === 2 ? DateObj.getMinutes() : '0'+DateObj.getMinutes();
            let Seconds = DateObj.getSeconds().toString().length === 2 ? DateObj.getSeconds() : '0'+DateObj.getSeconds();
            return Day+'.'+Month+'.'+Year+' '+Hours+':'+Minutes+':'+Seconds;

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
