<template>
  <div id="CurrentValue">
        <div class="card-deck">
            <b-col v-for="item in sensorTypes" :key="item">
              <CurrentValueCard :board="board" :sensorType="item"></CurrentValueCard>
            </b-col>
        </div>

  </div>
</template>

<script>
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import { ButtonGroupPlugin } from 'bootstrap-vue'

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import CurrentValueCard from './CurrentValueCard.vue'

    import Vue from 'vue'
    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);
    Vue.config.productionTip = false;

export default {
  name: 'CurrentValue',
    components:{
        CurrentValueCard
    },
  props: {
      board: String
  },
    data () {
      return {
          sensorTypes: [],
      }
    },
    mounted () {

        axios
              .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensor_types?mac='+this.board)
              .then(response => (this.sensorTypes = response.data.entity));
    },
    methods:{
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
