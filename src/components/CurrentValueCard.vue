<template>
  <div id="CurrentValueCard">

    <b-card
            v-if="SensorType == 'Relay'"
            :bg-variant="Variant"
            :title="SensorType"
            align="center"
            text-variant="black"
    >
      <b-card-text>
        <!--<h2 v-if="SensorType == 'Relay' && Value.Value==1">TURN ON</h2>-->
        <!--<h2 v-if="SensorType == 'Relay' && Value.Value==0">TURN OFF</h2>-->

        <toggle-button :value="Value.Value"
                       color="#ffcc00"
                       :sync="false"
                       :labels="true"
                       height="44"
                       width="120"
                       font-size="25"
                       @change="switchRelay"
        >
        </toggle-button>

      </b-card-text>

      <b-card-footer> {{ this.ISO_to_datetime( Value.CreatedAt ) }}<br>{{ board }}</b-card-footer>

    </b-card>

    <b-card
            v-if="SensorType == 'Temperature'"
            :title="SensorType"
            align="center"
    >
      <b-card-text>

        <h2 ><MdThermometerIcon></MdThermometerIcon>{{ Value.Value }} &#8451;</h2>
      </b-card-text>

      <b-card-footer> {{ this.ISO_to_datetime( Value.CreatedAt ) }} </b-card-footer>

    </b-card>


  </div>
</template>

<script>
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import { ButtonGroupPlugin } from 'bootstrap-vue'

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import MdThermometerIcon from 'vue-ionicons/dist/md-thermometer.vue'

    import Vue from 'vue'
    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);
    Vue.config.productionTip = false;
    import { ToggleButton } from 'vue-js-toggle-button'
    Vue.component('ToggleButton', ToggleButton);

export default {
  name: 'CurrentValueCard',
    components:{
        MdThermometerIcon
    },
  props: {
      board: String,
      sensorType: String
  },
    data () {
      return {
          Value: {},
          SensorType: this.sensorType.charAt(0).toUpperCase() + this.sensorType.slice(1),
          RefreshCount: 0,
//          Variant: "success"
      }
    },
    created() {
        this.timer = setInterval(this.fetchDataFromServer, 1000)
    },
    mounted () {
      this.fetchDataFromServer()
    },
    methods:{
        switchRelay: function() {
            let url = 'http://' + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/todo';
            let data = {
                mac : this.board,
                command : "RELAY",
                subcommand : "switch",
                commandhash : "",
                commanddone : false,
                commandstatus : ""
            };
            axios.post(url, data);

//            this.Value['Value'] = !this.Value['Value']

//            if (this.Variant === "dark"){
//                this.Variant = "success"
//            }else{
//                this.Variant = "dark"
//            }

        },
        fetchDataFromServer: function () {
            axios
                .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensors_data?mac='+this.board+'&type='+this.sensorType+'&last=1')
                .then(response => (this.Value = response.data.entity[0]));

//            if(this.Value['Value'] == 1) {
//                this.Variant = "success"
//            }else{
//                this.Variant = "dark"
//            }

//            this.RefreshCount ++
        },
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

</style>
