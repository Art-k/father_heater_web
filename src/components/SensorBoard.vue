<template>
	<div id="SensorBoard">

		<b-card no-body>
			<b-tabs>
				<b-tab title="Edit">
					<div>
						<b-card>
							<b-form @submit="PatchBoardOnSubmit" @reset="PatchBoardOnReset">
								<b-form-group
										id="input-group-1"
										label="MAC:"
										label-for="mac"
										description="mac address of the board."
								>
									<b-form-input
											id="mac"
											v-model="board"
											type="text"
											required
											placeholder="Enter Mac"
									></b-form-input>
								</b-form-group>

								<!--<b-form-group id="input-group-2" label="Your Name:" label-for="input-2">-->
									<!--<b-form-input-->
											<!--id="input-2"-->
											<!--v-model="form.name"-->
											<!--required-->
											<!--placeholder="Enter name"-->
									<!--&gt;</b-form-input>-->
								<!--</b-form-group>-->

								<!--<b-form-group id="input-group-3" label="Food:" label-for="input-3">-->
									<!--<b-form-select-->
											<!--id="input-3"-->
											<!--v-model="form.food"-->
											<!--:options="foods"-->
											<!--required-->
									<!--&gt;</b-form-select>-->
								<!--</b-form-group>-->

								<!--<b-form-group id="input-group-4">-->
									<!--<b-form-checkbox-group v-model="form.checked" id="checkboxes-4">-->
										<!--<b-form-checkbox value="me">Check me out</b-form-checkbox>-->
										<!--<b-form-checkbox value="that">Check that out</b-form-checkbox>-->
									<!--</b-form-checkbox-group>-->
								<!--</b-form-group>-->

								<!--<b-button type="submit" variant="primary">Submit</b-button>-->
								<!--<b-button type="reset" variant="danger">Reset</b-button>-->
							</b-form>
						</b-card>
						<!--<b-card class="mt-3" header="Form Data Result">-->
							<!--<pre class="m-0">{{ form }}</pre>-->
						<!--</b-card>-->
					</div>

				</b-tab>
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
				<b-tab title="Log">

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
				BoardSettingsField : [
						{ key: 'ID', label: '#', sortable: true, sortDirection: 'desc' },
						{ key: 'CreatedAt', label: 'Added', sortable: true},
						{ key: 'Command', label: 'Command', sortable: true},
						{ key: 'SubCommand', label: 'Sub Command', sortable: true},
						{ key: 'CommandDone', label: 'Command Done', sortable: true},
						{ key: 'CommandStatus', label: 'Command Status', sortable: true}
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

				currentPageBoardSettings:1,
				perPageBoardSettings:30,
				pageOptionsBoardSettings: [5, 10, 15, 30]
			}
		},
		mounted () {
//			this.isBusy = true;

			axios
				.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_SENSOR_DATA_END_POINT + '?mac='+this.board)
				.then(response => (this.values = response.data));

			axios
				.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_TODO_END_POINT + '?mac=' + this.board)
				.then(response => (this.todos = response.data));

			axios
				.get(process.env.VUE_APP_PROTOCOL + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + process.env.VUE_APP_TODO_END_POINT + '?mac=' + this.board+'&command_done=1')
				.then(response => (this.todolog = response.data));

//			this.isBusy = false;
		},
		methods:{
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

<style scoped>

</style>
