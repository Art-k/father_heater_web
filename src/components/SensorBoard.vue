<template>
  <div id="SensorBoard">



    <b-table
            striped
            hover
            small
            sticky-header
            :items="values.Entity"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :busy="isBusy"
    >

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>


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
    <b-row>
      <b-col sm="5" md="6" class="my-1">
        <b-form-group
                label="Per page"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="right"
                label-size="s"
                label-for="perPageSelect"
                class="mb-0"
        >
          <b-form-select
                  v-model="perPage"
                  id="perPageSelect"
                  size="sm"
                  :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
                v-model="currentPage"
                :total-rows="values.Total"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

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
          isBusy: false,
          fields : [
              { key: 'id', label: '#', sortable: true, sortDirection: 'desc' },
              { key: 'timestamp', label: 'Date Time', sortable: true},
              { key: 'temperature', label: 'Temperature', sortable: true},
              { key: 'humidity', label: 'Humidity', sortable: true},
              { key: 'pressure', label: 'Pressure', sortable: true},
              { key: 'soil', label: 'Soil', sortable: true},
          ],
          values: [],
          currentPage:1,
          perPage:30,
          pageOptions: [5, 10, 15]
      }
    },
    mounted () {
        this.isBusy = true;
        axios
            .get('http://'+process.env.VUE_APP_HOST+'/get_board_data?board='+this.board)
            .then(response => (this.values = response.data));
        this.isBusy = false;
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
