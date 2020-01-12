<template>
	<div id="SensorBoard">

		<b-card no-body>
			<b-tabs>
				<b-tab title="To Do" active>
					<b-table
						striped
						hover
						small
						sticky-header
						:items="todos.entity"
						:fields="todofields"
						:current-page="currentPagetodo"
						:per-page="perPagetodo"
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

						<template v-slot:cell(Command)="row">
							{{ row.item.Command}}
						<!--&#8451;-->
						</template>

						<template v-slot:cell(SubCommand)="row">
							{{ row.item.SubCommand }}
						</template>

					</b-table>

					<b-row>
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
										v-model="perPagetodo"
										id="perPageSelect"
										size="sm"
										:options="pageOptionstodo"
								>
								</b-form-select>
							</b-form-group>
						</b-col>

						<b-col sm="3" md="2" class="my-1">
							<b-pagination
									v-model="currentPagetodo"
									:total-rows="todos.total"
									:per-page="perPagetodo"
									align="fill"
									size="sm"
									class="my-0"
							>
							</b-pagination>
						</b-col>
					</b-row>



				</b-tab>
				<b-tab title="To Do Log">

					<b-table
						striped
						hover
						small
						sticky-header
						:items="todolog.entity"
						:fields="todofieldslog"
						:current-page="currentPagetodolog"
						:per-page="perPagetodolog"
						:busy="isBusytodolog"
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

						<template v-slot:cell(Command)="row">
						{{ row.item.Command}}
						<!--&#8451;-->
						</template>

						<template v-slot:cell(SubCommand)="row">
						{{ row.item.SubCommand }}
						</template>

						<template v-slot:cell(CommandDone)="row">
						{{ row.item.CommandDone }}
						</template>

						<template v-slot:cell(CommandStatus)="row">
						{{ row.item.CommandStatus }}
						</template>

					</b-table>


					<b-row>
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
									v-model="perPagetodolog"
									id="perPageSelect"
									size="sm"
									:options="pageOptionstodolog"
									>
								</b-form-select>
							</b-form-group>
						</b-col>

						<b-col sm="3" md="2" class="my-1">
							<b-pagination
								v-model="currentPagetodolog"
								:total-rows="todolog.total"
								:per-page="perPagetodolog"
								align="fill"
								size="sm"
								class="my-0"
							>
							</b-pagination>
						</b-col>

						<b-col>

						</b-col>
					</b-row>
				</b-tab>
				<b-tab title="Settings">

					<b-table
							striped
							hover
							small
							sticky-header
							:items="BoardSettings.entity"
							:fields="BoardSettingsFields"
							:current-page="BoardSettingscurrentPage"
							:per-page="BoardSettingsperPage"
							:busy="isBusyBoardSettings"
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

						<template v-slot:cell(SensorType)="row">
							{{ row.item.SensorType}}
							<!--&#8451;-->
						</template>

						<template v-slot:cell(Sense)="row">
							{{ row.item.Sense }}
						</template>

						<template v-slot:cell(Pin)="row">
							{{ row.item.Pin }}
						</template>

						<template v-slot:cell(Interval)="row">
							{{ row.item.Interval }}
						</template>

						<template v-slot:cell(actions)="row">
							<b-button v-b-modal.delete_setting_record_confirmation variant="outline-danger" size="sm" style="width: 33px">
								X
								<b-modal id="delete_setting_record_confirmation" title="WARNING !!!" @ok="settings_delete(row.item.ID)">

								</b-modal>
							</b-button>
						</template>

					</b-table>


					<b-row>
						<b-col sm="3" md="3">
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
										v-model="BoardSettingsperPage"
										id="perPageSelect"
										size="sm"
										:options="BoardSettingspageOptions"
								>
								</b-form-select>
							</b-form-group>
						</b-col>

						<b-col sm="3" md="3">
							<b-pagination
									v-model="BoardSettingscurrentPage"
									:total-rows="BoardSettings.total"
									:per-page="BoardSettingsperPage"
									align="fill"
									size="sm"
									class="my-0"
							>
							</b-pagination>
						</b-col>

						<b-col sm="3" md="3">
							<b-button v-b-modal.add_settings variant="success">Add Settings</b-button>

							<b-modal id="add_settings" title="Set Settings" @ok="post_settings">

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="MAC">
									<b-form-input id="new_mac" v-model="board" placeholder="Enter Mac Adress"></b-form-input>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Type">
									<b-form-select
											v-model="CurrentBoardSettingsType"
											id="BoardSettingsTypesId"
											size="sm"
											:options="BoardSettingsTypes"
									>
									</b-form-select>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Sense">
									<b-form-select
											v-model="CurrentBoardSettingsSense"
											id="SenseTypesId"
											size="sm"
											:options="CurrentBoardSettingsSenses"
									>
									</b-form-select>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Pin">
									<b-form-input id="PinId" v-model="CurrentBoardSettings['Pin']" placeholder="Enter Pin"></b-form-input>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Interval (ms)">
									<b-form-input id="IntervalId" v-model="CurrentBoardSettings['Interval']" placeholder="Enter Interval"></b-form-input>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Delta">
									<b-form-input id="DeltaId" v-model="CurrentBoardSettings['Delta']" placeholder="Enter Delta"></b-form-input>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Default Value">
									<b-form-select
											v-model="CurrentBoardSettingsDefault"
											id="DefaultStateId"
											size="sm"
											:options="CurrentBoardSettingsDefaults"
									>
									</b-form-select>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Default Value">
									<b-form-select
											v-model="CurrentBoardSettingsDoInverse"
											id="DoInverse"
											size="sm"
											:options="CurrentBoardSettingsDoInverseInverse"
									>
									</b-form-select>
								</b-form-group>

								<b-form-group label-cols="4" label-cols-lg="2" label-size="sm" label="Aditional JSON" label-for="input-sm">
									<b-form-textarea
											id="textarea"
											v-model="CurrentBoardSettings['AdditionalParameter']"
											placeholder="Enter something..."
											rows="3"
											max-rows="6"
									></b-form-textarea>
								</b-form-group>

							</b-modal>
						</b-col>
					</b-row>
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

				isBusytodo: false,
				todofields : [
						{ key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
						{ key: 'CreatedAt', label: 'Added', sortable: true},
						{ key: 'Command', label: 'Command', sortable: true},
						{ key: 'SubCommand', label: 'Sub Command', sortable: true},
						{ key: 'Unit', label: 'Unit', sortable: true}
					],
				todos: [],

				isBusytodolog: false,
				todofieldslog : [
						{ key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
						{ key: 'CreatedAt', label: 'Added', sortable: true},
						{ key: 'Command', label: 'Command', sortable: true},
						{ key: 'SubCommand', label: 'Sub Command', sortable: true},
						{ key: 'CommandDone', label: 'Command Done', sortable: true},
						{ key: 'CommandStatus', label: 'Command Status', sortable: true}
					],
				todolog: [],

				isBusyBoardSettings: false,
				BoardSettingsFields : [
						{ key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
						{ key: 'CreatedAt', label: 'Added', sortable: true},
						{ key: 'SensorType', label: 'SensorType', sortable: true},
						{ key: 'Sense', label: 'Sense', sortable: true},
						{ key: 'Pin', label: 'Pin', sortable: true},
						{ key: 'Interval', label: 'Interval', sortable: true},
						{ key: 'Delta', label: 'Delta', sortable: true},
						{ key: 'Default', label: 'Default', sortable: true},
						{ key: 'AdditionalParameters', label: 'AdditionalParameters', sortable: true},
						{ key: 'RelayInverse', label: 'RelayInverse', sortable: true},
						{ key: 'actions', label: 'Actions'}
					],
				BoardSettings: [],

				currentPage:1,
				perPage:30,
				pageOptions: [5, 10, 15, 30],

				currentPagetodo:1,
				perPagetodo:30,
				pageOptionstodo: [5, 10, 15, 30],

				currentPagetodolog:1,
				perPagetodolog:30,
				pageOptionstodolog: [5, 10, 15, 30],

				BoardSettingscurrentPage:1,
				BoardSettingsperPage:30,
				BoardSettingspageOptions: [5, 10, 15, 30],

				BoardSettingsTypes: ['DHT11', 'RELAY', 'SOIL', 'BME280'],
				BoardSettingsType: 'DHT11',

				CurrentBoardSettingsType:'',
				CurrentSenseTypes: [],
				CurrentBoardSettingsSense:'',
				CurrentBoardSettingsSenses: [],
				CurrentBoardSettingsDefault: '',
				CurrentBoardSettingsDoInverse: '',
				CurrentBoardSettingsDefaults: [],
				CurrentBoardSettingsDoInverseInverse: ['no', 'yes'],

				CurrentBoardSettings : {
					Pin : '',
					Interval : 0,
					Delta : 0,
					Default : '',
					AdditionalParameter : '',
					DoInverse : ''
				},
				SenseSettings: {
					'DHT11' : {
						SenseTypes : ['temperature', 'humidity'],
						DefaulState : '',
						SelectedSatte : 'temperature',
						PossibleValues : [],
						DoReverse : ['no', 'yes']
					},
					'BME280' : {
						SenseTypes : ['temperature', 'humidity', 'pressure'],
						DefaulState : '',
						SelectedSatte : 'temperature',
						PossibleValues : [],
						DoReverse : ['no', 'yes']
					},
					'RELAY' : {
						SenseTypes: ['relay'],
						DefaulState: 'on',
						SelectedSatte : 'relay',
						PossibleValues : ['on', 'off'],
						DoReverse : ['no', 'yes']
					},
					'SOIL' : {
						SenseTypes: ['soil'],
						DefaulState: '',
						SelectedSatte : 'soil',
						PossibleValues : [],
						DoReverse : ['no', 'yes']
					}
				}
			}
		},
		watch : {
			CurrentBoardSettingsType: function(){
				this.CurrentBoardSettingsSenses = this.SenseSettings[this.CurrentBoardSettingsType]['SenseTypes'];
				this.CurrentBoardSettingsDefaults = this.SenseSettings[this.CurrentBoardSettingsType]['PossibleValues'];
			}
		},
		mounted () {
			this.getBoardSettings();
			this.getSensoData();
			this.getCurrentToDo();
			this.getToDoLog();

		},
		methods:{
			settings_delete: function(id){

				axios
					.delete(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/board_settings' + '?id='+id);

				this.getBoardSettings()
			},
			getSensoData: function(){
				this.isBusy = true;
				axios
					.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_SENSOR_DATA_END_POINT + '?mac='+this.board)
					.then(response => (this.values = response.data));
				this.isBusy = false;
			},
			getCurrentToDo: function(){
				axios
					.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_TODO_END_POINT + '?mac=' + this.board)
					.then(response => (this.todos = response.data));
			},
			getToDoLog: function(){
				axios
					.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_TODO_END_POINT + '?mac=' + this.board+'&command_done=1')
					.then(response => (this.todolog = response.data));
			},
			getBoardSettings: function(){
//				console.log('Try to get board settings');
//				console.log(process.env.VUE_APP_BOARD_SETTINGS_END_POINT);
				let url = process.env.VUE_APP_PROTOCOL +
					process.env.VUE_APP_HOST +
					process.env.VUE_APP_PORT1 +
					'/board_settings' +
					'?mac=' + this.board;

//				console.log(url);

				axios
					.get(url)
					.then(response => (this.BoardSettings = response.data));

			},
			timestamp_to_datetime: function (timestamp){
				let DateObj = new Date(timestamp*1000);
				let result;
				result = DateObj.getDate()+'.'+DateObj.getMonth()+'.'+DateObj.getFullYear()+' '+DateObj.getHours()+':'+DateObj.getMinutes()+':'+DateObj.getSeconds();
			return result
			},
			PatchBoardOnSubmit: function (){
				console.log('Submit patch for board data')
			},
			PatchBoardOnReset: function (){
				console.log('Reset patch for board data')
			},

			post_settings: function (){
				console.log('Post board settings');
				let url = process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/board_settings';

//				let Pin;
//				const tmpPin = parseInt(this.CurrentBoardSettings['Pin'], 10);
//				if (isNaN(tmpPin)) { Pin = -1 }else{Pin = tmpPin}

				let Interval;
				const tmpInterval = parseInt(this.CurrentBoardSettings['Interval'], 10);
				if (isNaN(tmpInterval)) { Interval = -1 }else{Interval = tmpInterval}

				let Delta;
				const tmpDelta = parseInt(this.CurrentBoardSettings['Delta'], 10);
				if (isNaN(tmpDelta)) { Delta = -1 }else{Delta = tmpDelta}

				let data = {
					Mac: this.board,
					SensorType: this.CurrentBoardSettingsType,
					Sense : this.CurrentBoardSettingsSense,
					Pin : this.CurrentBoardSettings['Pin'],
					Interval: Interval,
					Delta: Delta,
					Default: this.CurrentBoardSettingsDefault,
					AdditionalParameters: this.CurrentBoardSettings['AdditionalParameter'],
					DoInverse: this.CurrentBoardSettingsDoInverse
				};
				console.log(url);
				console.log(data);
				axios.post(url, data);

				this.getBoardSettings();
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

<style scoped>

</style>
