<template>
  <div id="SensorBoard">

    <b-table
            striped
            hover
            small
            sticky-header
            :items="values.entity"
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


      <template v-slot:cell(CreatedAt)="row">
        {{ ISO_to_datetime(row.item.CreatedAt) }}
      </template>

      <template v-slot:cell(Type)="row">
        {{ row.item.Type}}
        <!--&#8451;-->
      </template>

      <template v-slot:cell(Value)="row">
        {{ row.item.Value }}
      </template>


    </b-table>


    <b-row >
      <b-col sm="3" md="3" class="my-1">
        <b-form-group
                label="Per page"
                label-cols-sm="6"
                label-cols-md="4"
                label-cols-lg="3"
                label-align-sm="right"
                label-size="sm"
                label-for="perPageSelect"
                class="mb-0"
        >
          <b-form-select
                  v-model="perPage"
                  id="perPageSelect"
                  size="sm"
                  :options="pageOptions"
          >
          </b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="3" md="2" class="my-1">
        <b-pagination
                v-model="currentPage"
                :total-rows="values.total"
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

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'


    import Vue from 'vue'
    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);

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
              { key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
              { key: 'CreatedAt', label: 'Added', sortable: true},
              { key: 'Type', label: 'Type', sortable: true},
              { key: 'Value', label: 'Value', sortable: true},
              { key: 'Unit', label: 'Unit', sortable: true}
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
            .get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+'/sensors_data?mac='+this.board)
            .then(response => (this.values = response.data));
        this.isBusy = false;
    },
    methods:{
        timestamp_to_datetime: function (timestamp){
            let DateObj = new Date(timestamp*1000);
            let result;
            result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()+':'+DateObj.getSeconds();
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
