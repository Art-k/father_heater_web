<template>
  <div id="BoardChart">
    <!--{{ chartData }}-->
    <b-row>
      <b-col>
        <b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Type">
          <b-form-select
                  v-model="senseType"
                  id="senseTypeId"
                  size="sm"
                  :options="senseTypes"
          >
          </b-form-select>
        </b-form-group>
      </b-col>


      <b-col>
        <b-form-group label-cols="4" label-cols-lg="4" label-size="sm" label="Date From">
          <date-picker size="sm" v-model="sdate" :config="options"></date-picker>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label-cols="4" label-cols-lg="4" label-size="sm" label="Date To">
        <date-picker v-model="edate" :config="options"></date-picker>
        </b-form-group>
      </b-col>
      <b-col>
        <b-button block size="sm" variant="warning" @click="get_chart_data()">
          Refresh
        </b-button>
      </b-col>
    </b-row>

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
    import datePicker from 'vue-bootstrap-datetimepicker';
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

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
      GChart,
      datePicker
  },
  props: {
      board: String
  },
    data () {
      return {
          values: [],
          senseType:'',
          senseTypes:[],
          sdate:'',
          edate:'',
          options: {
            format: 'YYYY-MM-DD',
            useCurrent: false,
          },
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

      this.get_chart_data();
        this.get_sense_types();
    },
    methods:{
//        timestamp_to_datetime: function (timestamp){
//            let DateObj = new Date(timestamp*1000);
//            let result;
//            result = ( DateObj.getDate().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate() ) +'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()+':'+DateObj.getSeconds();
//            return result
//        },
        get_sense_types: function(){
          axios
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensor_types?mac='+this.board)
            .then(response => {this.senseTypes = response.data.entity})
        },
        get_chart_data: function(){
          console.log(this.sdate);
          console.log(this.edate);
          axios
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/chart?mac='+this.board+'&start='+this.sdate+'&end='+this.edate+"&type="+this.senseType)
            .then(response => {
              console.log(typeof response.data);
//              console.log(response);
              console.log(response.data);
              console.log(response.data.entity);
              let chartdata;
              if (typeof response.data === 'string') {
                console.log("response data is string");
                let chartdataTMP = JSON.parse(response.data);
                console.log(chartdataTMP);
                chartdata = chartdataTMP.entity;
              }else{
                chartdata = response.data.entity;
              }
              console.log("Chart Data incoming");
              console.log(chartdata);
              let array = [];
              for (let i=0; i < chartdata.length; i++){
                chartdata[i]['CreatedAt'] = this.ISO_to_datetime(chartdata[i]['CreatedAt']);
                //                      console.log(response.data.entity[i]);
                array.push([chartdata[i]['CreatedAt'], chartdata[i]['Value']])
              }
                this.chartData = this.etalonchartData.concat(array);
              }
            );
        },
	    ISO_to_datetime: function (timestamp){
		    let DateObj = new Date(timestamp);
		    let Day = DateObj.getDate().toString().length === 2 ? DateObj.getDate() : '0'+DateObj.getDate();
		    let Month = DateObj.getMonth().toString().length === 2 ? DateObj.getMonth()+1 : '0'+DateObj.getMonth()+1;
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

</style>
