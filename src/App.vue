<template>
  <div id="app">

      <b-button v-b-modal.modal-signin v-show="user===undefined">Sign In</b-button>
      <b-modal id="modal-signin" title="Please Sign In!" @ok="set_user">
          <label for="login">User Name : </label>
            <b-form-input id="login" v-model="user" placeholder="Enter your login"></b-form-input>
          <br />
      </b-modal>

      <b-button v-show="user!==undefined" @click="clear_user">Sign Out</b-button>

    <div class="container p-3 my-3" v-show="user!==undefined">
      <b-tabs pills>

          <b-tab v-if="user==='5361' || user==='AHome'" title="Fathenda" active>
              <b-row v-for="item in boards.entity" :key="item.id">
                  <div class="container p-3 my-3" v-if="isFather(item.Mac)">
                      <h2>{{ item.Name }}</h2>
                      <CurrentValue :board="item.Mac"></CurrentValue>
                  </div>
              </b-row>
          </b-tab>

        <b-tab v-if="user==='AHome'"  title="Monitor" active>
          <b-row v-for="item in boards.entity" :key="item.id">
            <div class="container p-3 my-3">

                <h2>{{ item.Name }}</h2>

                <CurrentValue :board="item.Mac"></CurrentValue>

            </div>
          </b-row>
        </b-tab>

        <b-tab v-if="user==='AHome'" title="Details">
          <b-button class="float-right" v-b-modal.add_board variant="success" @click="form_mode = POST">Add Board</b-button>

          <b-modal id="add_board" title="Add new BOARD" @ok="post_board">
            {{ form_mode }}
            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="MAC"
              label-for="input-sm"
            >
              <b-form-input id="new_mac" v-model="new_mac" placeholder="Enter Mac Adress"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="Name"
              label-for="input-sm"
            >
              <b-form-input id="new_name" v-model="new_name" placeholder="Enter Name"></b-form-input>
            </b-form-group>

            <b-form-group
              label-cols="4"
              label-cols-lg="2"
              label-size="sm"
              label="Description"
              label-for="input-sm"
            >
              <b-form-textarea
                id="new_description"
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
              selectable
              :select-mode="selectMode"
              @row-selected="onRowSelected"
              hover
              :items="boards.entity"
              :fields="fields"
            >
              <template v-slot:cell(CreatedAt)="row">{{ ISO_to_datetime(row.item.CreatedAt) }}</template>

              <template v-slot:cell(actions)="row">
                <b-button-group size="sm">
                  <b-button
                    size="sm"
                    variant="success"
                    @click="row.toggleDetails"
                  >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button>
                  <b-button size="sm" variant="warning" @click="reset_board(row.item.Mac)">Reset</b-button>

                  <b-button
                    v-b-modal.add_board
                    size="sm"
                    variant="primary"
                    @click="fill_form(row.item)"
                  >Edit</b-button>

                  <b-button
                    size="sm"
                    variant="danger"
                    @click="deleteBoard(row.item.ID)"
                  >Delete</b-button>
                </b-button-group>
              </template>

              <template v-slot:row-details="row">
                <b-card>
                  <BoardChart :board="row.item.Mac" />
                  <SensorBoard :board="row.item.Mac" />
                </b-card>
              </template>
            </b-table>
          </b-container>
        </b-tab>

        <b-tab v-if="user==='AHome'" title="Unknown Boards">
          <b-container fluid>
            <b-table striped hover :items="unknownboards.entity" :fields="unknownfields">

              <template v-slot:cell(actions)="row">
                <b-button-group size="sm">
                  <b-button
                          size="sm"
                          variant="danger"
                          @click="deleteUnknownBoard(row.item.Mac)"
                  >Delete</b-button>
                </b-button-group>
              </template>

            </b-table>
          </b-container>
        </b-tab>

        <b-tab v-if="user==='AHome'" title="Groups">
          <b-container fluid>
            <!-- <b-table
                    striped
                    hover
                    :items="groups.entity"
                    :fields="groupsfields"
            >-->

            <!-- </b-table> -->
          </b-container>
        </b-tab>

        <b-tab v-if="user==='AHome'" title="Rules">
          <b-container fluid>
            <b-table
                    striped
                    hover
                    :items="Rules.entity"
                    :fields="rulesfields"
            >
              <template v-slot:cell(CreatedAt)="row">
                {{ row.item.CreatedAt | format_date }}
              </template>

              <template v-slot:cell(StartsAt)="row">
                {{ row.item.StartsAt | format_uts_date }}
              </template>

              <template v-slot:cell(Expires)="row">
                {{ row.item.Expires | format_uts_date }}
              </template>

              <template v-slot:cell(RepeatEvery)="row">
                {{ row.item.RepeatEvery | format_seconds }}
              </template>


            </b-table>
          </b-container>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import { ButtonGroupPlugin } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Vue from "vue";
Vue.use(BootstrapVue);
Vue.use(ButtonGroupPlugin);

import SensorBoard from "./components/SensorBoard.vue";
import BoardChart from "./components/BoardChart.vue";
import CurrentValue from "./components/CurrentValue.vue";

export default {
  name: "app",
  components: {
    SensorBoard,
    BoardChart,
    CurrentValue
  },
  data() {
    return {
      user : null,
        fields: [
        { key: "ID", label: "#", sortable: true, sortDirection: "desc" },
        { key: "Mac", label: "MAC", sortable: true },
        { key: "Name", label: "Name", sortable: true },
        { key: "Description", label: "Description", sortable: true },
        { key: "CreatedAt", label: "Added At", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      boards: {
        Entity: [
          {
            board: "1 sgwrvwrv",
            name: "1 wvsetbsrtb",
            description: "1 sdfbvdryndtrny"
          },
          {
            board: "2 sgwrvwrv",
            name: "2 wvsetbsrtb",
            description: "2 sdfbvdryndtrny"
          }
        ]
      },

      unknownfields: [
        { label: "selected" },
        { key: "ID", label: "#", sortable: true, sortDirection: "desc" },
        { key: "Mac", label: "MAC", sortable: true },
        { key: "CreatedAt", label: "Added At", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      unknownboards: {
        Entity: [
          {
            board: "1 sgwrvwrv",
            name: "1 wvsetbsrtb",
            description: "1 sdfbvdryndtrny"
          },
          {
            board: "2 sgwrvwrv",
            name: "2 wvsetbsrtb",
            description: "2 sdfbvdryndtrny"
          }
        ]
      },
      rulesfields: [
        { key: "ID", label: "#", sortable: true, sortDirection: "desc" },
        { key: "ActionMac", label: "MAC", sortable: true },
        { key: "CreatedAt", label: "Added At", sortable: true },
        { key: "DoIFTrue", label: "Do IF True", sortable: true },
        { key: "DoIFFalse", label: "Do IF False", sortable: true },
        { key: "StartsAt", label: "StartsAt", sortable: true },
        { key: "RepeatEvery", label: "RepeatEvery", sortable: true },
        { key: "Expires", label: "Expires", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      Rules : {
        entity : [
          {
            ID: 13,
            CreatedAt: "2020-01-12T22:53:05.369337854Z",
            UpdatedAt: "2020-01-12T22:53:05.369337854Z",
            DeletedAt: null,
            ActionMac: "a4:cf:12:d9:44:07",
            DoIFTrue: "on",
            DoIFFalse: "",
            StartsAt: 1578864600,
            RepeatEvery: 86400,
            Expires: 2525558400,
            Active: true
          },
          {
            ID: 14,
            CreatedAt: "2020-01-12T22:53:12.947376535Z",
            UpdatedAt: "2020-01-12T22:53:12.947376535Z",
            DeletedAt: null,
            ActionMac: "a4:cf:12:d9:44:07",
            DoIFTrue: "on",
            DoIFFalse: "",
            StartsAt: 1578868200,
            RepeatEvery: 86400,
            Expires: 2525558400,
            Active: true
          }
        ]
      },
      selectMode: "multi",
      selected: [],

      //            dataType: 'temperature',
      dataTypeOptions: ["no"],
      new_id: 0,
      new_mac: "",
      new_name: "",
      new_description: "",
      form_mode: "POST"
    };
  },
  mounted() {
    this.user = localStorage.User;
    this.get_boards();
    this.get_unknown_boards();
    this.get_rules();

    axios
      .get(
        "http://" +
          process.env.VUE_APP_HOST +
          process.env.VUE_APP_PORT1 +
          process.env.VUE_APP_SENSOR_TYPES_END_POINT
      )
      .then(response => (this.dataTypeOptions = response.data.entity));
  },
  methods: {
    onRowSelected(items) {
      this.selected = items;
    },

      isFather: function(mac) {
        let MacArray = ["3c:71:bf:f9:01:b0", "cc:50:e3:95:b2:b4", "cc:50:e3:95:a7:9c", "a4:cf:12:d9:44:07"];
        return MacArray.indexOf(mac) !== -1;
      },

      clear_user: function() {
          localStorage.clear();
          this.user = undefined
      },
      set_user: function () {
          localStorage.User = this.user
      },
    fill_form: function(Obj) {
      this.new_mac = Obj.Mac;
      this.new_name = Obj.Name;
      this.new_description = Obj.Description;
      this.new_id = Obj.ID;
      this.form_mode = "PATCH";
    },
    reset_board: function(Mac) {
      let url =
        "http://" +
        process.env.VUE_APP_HOST +
        process.env.VUE_APP_PORT1 +
        "/todo";
      let data = {
        mac: Mac,
        command: "BOARD",
        subcommand: "reset",
        commandhash: "",
        commanddone: false,
        commandstatus: ""
      };
      axios.post(url, data);
    },
    deleteBoard: function(board_id) {
      let url =
              process.env.VUE_APP_PROTOCOL +
              process.env.VUE_APP_HOST +
              process.env.VUE_APP_PORT1 +
              process.env.VUE_APP_BOARDS_END_POINT;
      axios.delete(url+"?id="+board_id);
    },
    get_boards: function() {
      axios
        .get(
          "http://" +
            process.env.VUE_APP_HOST +
            process.env.VUE_APP_PORT1 +
            process.env.VUE_APP_BOARDS_END_POINT
        )
        .then(response => (this.boards = response.data));
    },
    deleteUnknownBoard: function(mac){
      axios.delete(
                      "http://" +
                      process.env.VUE_APP_HOST +
                      process.env.VUE_APP_PORT1 +
                      "/unknownboards?mac="+mac
              );
      this.get_unknown_boards();
    },
    get_unknown_boards: function() {
      axios
        .get(
          "http://" +
            process.env.VUE_APP_HOST +
            process.env.VUE_APP_PORT1 +
            "/unknownboards"
        )
        .then(response => (this.unknownboards = response.data));
    },
    get_rules: function() {
      axios
        .get(
          "http://" +
            process.env.VUE_APP_HOST +
            process.env.VUE_APP_PORT1 +
            "/rules"
        )
        .then(response => (this.Rules = response.data));
    },
    timestamp_to_datetime: function(timestamp) {
      let DateObj = new Date(timestamp * 1000);
      let result = "";
      result =
        DateObj.getDate() +
        "." +
        DateObj.getMonth() +
        "." +
        DateObj.getFullYear() +
        " " +
        DateObj.getHours() +
        ":" +
        DateObj.getMinutes();
      return result;
    },
    post_board: function() {
      let url =
        process.env.VUE_APP_PROTOCOL +
        process.env.VUE_APP_HOST +
        process.env.VUE_APP_PORT1 +
        process.env.VUE_APP_BOARDS_END_POINT;

      console.log(this.form_mode);
      if (this.form_mode !== "PATCH") {
        console.log('We will POST data');
        let data = {
          mac: this.new_mac,
          name: this.new_name,
          description: this.new_description
        };
        axios.post(url, data);
      } else {
        console.log('We will PATCH data');
        let data = {
          id: this.new_id,
          name: this.new_name,
          description: this.new_description
        };
        axios.patch(url, data);
      }
      this.get_boards();
    },
    ISO_to_datetime: function(timestamp) {
      let DateObj = new Date(timestamp);
      let Day =
        DateObj.getDate().toString().length === 2
          ? DateObj.getDate()
          : "0" + DateObj.getDate();
      let Month =
        DateObj.getMonth().toString().length === 2
          ? DateObj.getMonth() + 1
          : "0" + DateObj.getMonth() + 1;
      let Year = DateObj.getFullYear();
      let Hours =
        DateObj.getHours().toString().length === 2
          ? DateObj.getHours()
          : "0" + DateObj.getHours();
      let Minutes =
        DateObj.getMinutes().toString().length === 2
          ? DateObj.getMinutes()
          : "0" + DateObj.getMinutes();
      let Seconds =
        DateObj.getSeconds().toString().length === 2
          ? DateObj.getSeconds()
          : "0" + DateObj.getSeconds();
      return (
        Day +
        "." +
        Month +
        "." +
        Year +
        " " +
        Hours +
        ":" +
        Minutes +
        ":" +
        Seconds
      );
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
