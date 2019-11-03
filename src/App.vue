<template>
  <div id="app">
    <b-container fluid>

      <b-table
              striped
              hover
              :items="boards.Entity"
              :fields="fields"
      >

        <template v-slot:cell(added)="row">
          {{ timestamp_to_datetime(row.item.added) }}
        </template>

        <template v-slot:cell(actions)="row">
          <b-button block variant="success" @click="row.toggleDetails">
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </b-button>
        </template>

        <template v-slot:row-details="row">
          <b-card>
            <SensorBoard :board="row.item.board"/>
          </b-card>
        </template>

      </b-table>

    </b-container>
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

export default {
  name: 'app',
  components: {
      SensorBoard
  },
    data () {
        return {
            fields : [
                { key: 'id', label: '#', sortable: true, sortDirection: 'desc' },
                { key: 'board', label: 'MAC', sortable: true },
                { key: 'name', label: 'Name', sortable: true },
                { key: 'description', label: 'Description', sortable: true },
                { key: 'added', label: 'Added At', sortable: true },
                { key: 'actions', label: 'Actions' }
            ],
            boards: {"Entity" : [{"board":"1 sgwrvwrv", "name":"1 wvsetbsrtb", "description":"1 sdfbvdryndtrny"}, {"board":"2 sgwrvwrv", "name":"2 wvsetbsrtb", "description":"2 sdfbvdryndtrny"}]},
        }
    },
    mounted () {
        axios
            .get('http://ahome.tech/get_board')
            .then(response => (this.boards = response.data))
    },
    methods:{
      timestamp_to_datetime: function (timestamp){
          let DateObj = new Date(timestamp*1000);
          let result = "";
          result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()
          return result
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
