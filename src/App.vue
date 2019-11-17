<template>
  <div id="app">


    <b-card no-body>
      <b-tabs pills>

        <b-tab title="Monitor" active>

          <b-row v-for="item in boards.entity" :key="item.id">
            <CurrentValue :board="item.Mac"></CurrentValue>
          </b-row>

        </b-tab>

        <b-tab title="Details">

          <b-button v-b-modal.add_board variant="success">Add Board</b-button>

          <b-modal id="add_board" title="Add new BOARD" @ok="post_board">

            <b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="MAC" label-for="input-sm">
				<b-form-input id="new_mac" v-model="new_mac" placeholder="Enter Mac Adress"></b-form-input>
            </b-form-group>

            <b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Name" label-for="input-sm">
              <b-form-input id="new_name" v-model="new_name" placeholder="Enter Name"></b-form-input>
            </b-form-group>

            <b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Description" label-for="input-sm">
              <b-form-textarea
                      id="textarea"
                      v-model="new_description"
                      placeholder="Enter something..."
                      rows="3"
                      max-rows="6"
              ></b-form-textarea>
            </b-form-group>

          </b-modal>


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

        <b-tab title="Unknown Boards">
          <b-container fluid>

            <b-table
                    striped
                    hover
                    :items="unknownboards.entity"
                    :fields="unknownfields"
            >

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

        unknownfields : [
			{ key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
			{ key: 'Mac', label: 'MAC', sortable: true },
			{ key: 'CreatedAt', label: 'Added At', sortable: true },
			{ key: 'actions', label: 'Actions' }
		],
        unknownboards: {"Entity" : [{"board":"1 sgwrvwrv", "name":"1 wvsetbsrtb", "description":"1 sdfbvdryndtrny"}, {"board":"2 sgwrvwrv", "name":"2 wvsetbsrtb", "description":"2 sdfbvdryndtrny"}]},
		//            dataType: 'temperature',
		dataTypeOptions: ['no'],
		new_mac : '',
		new_name : '',
		new_description : '',
		}
	},
	mounted () {
		this.get_boards();
        this.get_unknown_boards();
		axios
			.get('http://'+process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_SENSOR_TYPES_END_POINT)
			.then(response => (this.dataTypeOptions = response.data.entity))
		},
	methods:{
		get_boards: function (){
			axios
				.get('http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+process.env.VUE_APP_BOARDS_END_POINT)
				.then(response => (this.boards = response.data));
		},
		get_unknown_boards: function (){
			axios
				.get('http://' + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/unknownboards')
				.then(response => (this.unknownboards = response.data));
		},
		timestamp_to_datetime: function (timestamp){
        let DateObj = new Date(timestamp*1000);
        let result = "";
        result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes();
        return result
        },
      post_board: function (){
		let url = process.env.VUE_APP_PROTOCOL+process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_BOARDS_END_POINT;
		let data = {
			mac : this.new_mac,
			name : this.new_name,
			description: this.new_description
		};
		axios.post(url, data);

		this.get_boards();
//
//
//      	console.log(this.Value);
//		const DATA = {
//			'Mac' : this.new_mac,
//			'Name' : this.new_name,
//			'Description': this.new_description
//		};
//
//        axios.post('http://'+process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_BOARDS_END_POINT,
//			{data: DATA});
//        const url = 'http://'+process.env.VUE_APP_HOST+process.env.VUE_APP_PORT1+process.env.VUE_APP_BOARDS_END_POINT;
//        const qs = require('qs');
//        const data = {
//          'mac' : this.new_mac,
//          'name' : this.new_name,
//          'description': this.new_description
//        };
//        const options = {
//          method: 'POST',
//          headers: { 'content-type': 'application/json' },
//          data: qs.stringify(data),
//          url
//        };
//        axios(options);
    //            .then(response => (this.boards = response.data));
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
