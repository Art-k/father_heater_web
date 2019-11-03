<template>
  <div id="SensorBoard">
    <b-table
            striped
            hover
            sticky-header
            :items="values.Entity"
            :fields="fields"
    >

      <template v-slot:cell(timestamp)="row">
        {{ timestamp_to_datetime(row.item.timestamp) }}
      </template>

      <template v-slot:cell(temperature)="row">
        {{ row.item.temperature}} &#8451;
      </template>

      <template v-slot:cell(humidity)="row">
        {{ row.item.humidity }} %
      </template>


    </b-table>
  </div>
</template>

<script>
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import { ButtonGroupPlugin } from 'bootstrap-vue'
//    import { library } from '@fortawesome/fontawesome-svg-core'
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    import Vue from 'vue'
    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);

    Vue.component('font-awesome-icon', FontAwesomeIcon);

    Vue.config.productionTip = false;

export default {
  name: 'SensorBoard',
  props: {
      board: String
  },
    data () {
      return {
          fields : [
              { key: 'id', label: '#', sortable: true, sortDirection: 'desc' },
              { key: 'timestamp', label: 'Date Time', sortable: true},
              { key: 'temperature', label: 'Temperature', sortable: true},
              { key: 'humidity', label: 'Humidity', sortable: true},
              { key: 'pressure', label: 'Pressure', sortable: true},
              { key: 'soil', label: 'Soil', sortable: true},
          ],
          values: []
      }
    },
    mounted () {
        axios
            .get('http://ahome.tech/get_board_data?board='+this.board)
            .then(response => (this.values = response.data))
    },
    methods:{
        timestamp_to_datetime: function (timestamp){
            let DateObj = new Date(timestamp*1000);
            let result;
            result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes();
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
