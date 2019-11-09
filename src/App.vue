<template>
  <div id="app">


    <b-card no-body>
      <b-tabs pills card>

        <b-tab title="Current" active>

          <b-row v-for="item in boards.entity" :key="item.id">
            <CurrentValue :board="item.Mac"></CurrentValue>
          </b-row>

        </b-tab>

        <b-tab title="History">

          <b-container fluid>

            <b-table
              striped
              hover
              :items="boards.entity"
              :fields="fields"
            >

              <template v-slot:cell(CreatedAt)="row">
                {{ ISO_to_datetime(row.item.CreatedAt) }}
              </template>

              <template v-slot:cell(actions)="row">
                <b-button block size="sm" variant="success" @click="row.toggleDetails">
                  {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                </b-button>
              </template>

              <template v-slot:row-details="row">
                <b-card>
                  <BoardChart :board="row.item.Mac"/>
                  <SensorBoard :board="row.item.Mac"/>
                </b-card>
              </template>

            </b-table>

          </b-container>

        </b-tab>

      </b-tabs>
    </b-card>


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

    import SensorBoard from './components/SensorBoard.vue'
    import BoardChart from './components/BoardChart.vue'
    import CurrentValue from './components/CurrentValue.vue'

export default {
  name: 'app',
  components: {
      SensorBoard,
      BoardChart,
      CurrentValue
  },
    data () {
        return {
            fields : [
                { key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
                { key: 'Mac', label: 'MAC', sortable: true },
                { key: 'Name', label: 'Name', sortable: true },
                { key: 'Description', label: 'Description', sortable: true },
                { key: 'CreatedAt', label: 'Added At', sortable: true },
                { key: 'actions', label: 'Actions' }
            ],
            boards: {"Entity" : [{"board":"1 sgwrvwrv", "name":"1 wvsetbsrtb", "description":"1 sdfbvdryndtrny"}, {"board":"2 sgwrvwrv", "name":"2 wvsetbsrtb", "description":"2 sdfbvdryndtrny"}]},
//            dataType: 'temperature',
            dataTypeOptions: ['no']
        }
    },
    mounted () {
        axios
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/get_boards')
            .then(response => (this.boards = response.data));

        axios
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensor_types')
            .then(response => (this.dataTypeOptions = response.data.entity))
    },
    methods:{
      timestamp_to_datetime: function (timestamp){
          let DateObj = new Date(timestamp*1000);
          let result = "";
          result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes();
          return result
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
