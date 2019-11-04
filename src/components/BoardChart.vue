<template>
  <div id="BoardChart">
    {{ chartData }}
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
          chartData: [
              ["Time", "Temperature", "Humidity", "Pressure", "Soil"]
          ],
          chartOptions: {
              chart: {
                  title: 'Company Performance',
                  subtitle: 'Sales, Expenses, and Profit: 2014-2017',
              }
          }
      }
    },
    mounted () {
        axios
            .get('http://'+process.env.VUE_APP_HOST+'/get_board_data?board='+this.board)
            .then(response => (this.values = response.data));
    },
    methods:{
        timestamp_to_datetime: function (timestamp){
            let DateObj = new Date(timestamp*1000);
            let result;
            result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()+':'+DateObj.getSeconds();
            return result
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
