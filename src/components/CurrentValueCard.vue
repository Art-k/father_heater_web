<template>
    <div id="CurrentValueCard">

        <div v-if="user==='5361' || user==='AHome'">
            <b-card
                    v-if="SensorType == 'Relay'"
                    :title="SensorType"
                    align="center"
                    text-variant="black"
                    @click="switchRelay"
            >
                <b-card-text>
                    <!--          {{workingNow}}-->
                    <!--        {{Value.Value}}{{ Direction }}-->
                    <!--            <v-icon v-show="!workingNow" name="chevron-left" color="red" width="50px"></v-icon>-->
                    <v-icon name="power" :color="currentColor" width="50px"></v-icon>
                    <!--            <v-icon v-show="Value.Value === 0" name="power" color="black" width="50px"></v-icon>-->
                    <!--            <v-icon v-show="Value.Value === -1" name="power" color="orange" width="50px"></v-icon>-->
                    <!--            <v-icon v-show="!workingNow" name="chevron-right" color="red" width="50px"></v-icon>-->
                    <!--        <h2 v-show="Value.Value === 1">TURN ON</h2>-->
                    <!--        <h2 v-show="Value.Value === 0">TURN OFF<span class="glyphicon glyphicon-off"></span></h2>-->
                    <!--        <toggle-button :value="Value.Value"-->
                    <!--                       color="#ffcc00"-->
                    <!--                       :sync="false"-->
                    <!--                       :labels="true"-->
                    <!--                       height="44"-->
                    <!--                       width="120"-->
                    <!--                       font-size="25"-->
                    <!--                       @change="switchRelay"-->
                    <!--        >-->
                    <!--        </toggle-button>-->
                </b-card-text>

                <b-card-footer> {{ Value.CreatedAt | format_date }}<br>{{ board }}
                    <!--<toggle-button-->
                    <!--:value="timerEnabled"-->
                    <!--@change="EnableDisableTimes"-->
                    <!--&gt;-->
                    <!--</toggle-button>-->
                </b-card-footer>

            </b-card>
        </div>

        <div v-if="user==='5361' || user==='AHome'">
            <b-card
                    v-if="SensorType == 'Temperature'"
                    :bg-variant="Variant"
                    :title="SensorType"
                    align="center"
                    text-variant="black"
            >
                <b-card-text>

                    <h2>
                        <!--<MdThermometerIcon></MdThermometerIcon>-->
                        {{ Value.Value }} &#8451;</h2>
                </b-card-text>

                <b-card-footer> {{ Value.CreatedAt | format_date }}<br>{{ board }}
                    <!--<toggle-button-->
                    <!--:value="timerEnabled"-->
                    <!--@change="EnableDisableTimes"-->
                    <!--&gt;-->
                    <!--</toggle-button>-->
                </b-card-footer>

            </b-card>
        </div>

        <div v-if="user==='AHome'">
            <b-card
                    v-if="SensorType == 'Humidity'"
                    :title="SensorType"
                    align="center"
            >
                <b-card-text>

                    <h2>{{ Value.Value }} % </h2>
                </b-card-text>

                <b-card-footer> {{ Value.CreatedAt | format_date }}<br>{{ board }}
                    <!--<toggle-button-->
                    <!--:value="timerEnabled"-->
                    <!--@change="EnableDisableTimes"-->
                    <!--&gt;-->
                    <!--</toggle-button>-->
                </b-card-footer>

            </b-card>
        </div>

        <div v-if="user==='AHome'">
            <b-card
                    v-if="SensorType == 'Soil'"
                    :title="SensorType"
                    align="center"
            >
                <b-card-text>

                    <h2>{{ Value.Value }} % </h2>
                </b-card-text>

                <b-card-footer> {{ Value.CreatedAt | format_date }}<br>{{ board }}
                    <!--<toggle-button-->
                    <!--:value="timerEnabled"-->
                    <!--@change="EnableDisableTimes"-->
                    <!--&gt;-->
                    <!--</toggle-button>-->
                </b-card-footer>

            </b-card>
        </div>

        <div v-if="user==='AHome'">
            <b-card
                    v-if="SensorType == 'Pressure'"
                    :title="SensorType"
                    align="center"
            >
                <b-card-text>

                    <h4>{{ Value.Value }} hPa <br>{{ (Value.Value*100 / 133.322) }} mm</h4>
                </b-card-text>

                <b-card-footer> {{ Value.CreatedAt | format_date }}<br>{{ board }}

                </b-card-footer>

            </b-card>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import BootstrapVue from 'bootstrap-vue'
    import {ButtonGroupPlugin} from 'bootstrap-vue'

    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    // https://qinshenxue.github.io/vue-icon/
    import feather from 'vue-icon'

    Vue.use(feather, 'v-icon');
    //    import MdThermometerIcon from 'vue-ionicons/dist/md-thermometer.vue'

    import Vue from 'vue'

    Vue.use(BootstrapVue);
    Vue.use(ButtonGroupPlugin);
    Vue.config.productionTip = false;
    import {ToggleButton} from 'vue-js-toggle-button'

    Vue.component('ToggleButton', ToggleButton);

    export default {
        name: 'CurrentValueCard',
//    components:{
//        MdThermometerIcon
//    },
        props: {
            board: String,
            sensorType: String
        },
        data() {
            return {
                workingNow: false,
                currentColor : "yellow",
                user: undefined,
                Value: {},
                Direction: "nd", // "off"
                SensorType: this.sensorType.charAt(0).toUpperCase() + this.sensorType.slice(1),
                RefreshCount: 0,
                Variant: "white"
//          Variant: "success"
            }
        },
        created() {
            this.timer = setInterval(this.fetchDataFromServer, this.getDelayInterval());
            this.timerEnabled = false
        },
        mounted() {
            this.user = localStorage.User;
            this.fetchDataFromServer()

        },
        methods: {
            getDelayInterval: function () {
                let interval = 1000;
                switch (this.sensorType) {
                    case 'relay':
                        interval = 5000;
                        break;
                    case 'temperature':
                        interval = 60000;
                        break;
                    case 'humidity':
                        interval = 600000;
                        break;
                    case 'soil':
                        interval = 3600000;
                        break;
                    case 'pressure':
                        interval = 600000;
                        break;
                    default:
                        interval = 1000;
                }
                return interval
            },
            visibilityChanged: function (isVisible, entry) {
                if (!isVisible) {
                    clearInterval(this.timer);
                } else {
                    this.timer = setInterval(this.fetchDataFromServer, this.getDelayInterval());
                }
                console.log(entry)
            },
            switchRelay: function () {

                if (this.workingNow) {
                    this.Value.Value = -1;
                    this.currentColor = "orange";
                    let url = 'http://' + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/todo';
                    let data = {
                        mac: this.board,
                        command: "RELAY",
                        subcommand: "switch",
                        commandhash: "",
                        commanddone: false,
                        commandstatus: ""
                    };
                    axios.post(url, data);
                }
            },
            EnableDisableTimes: function () {
                if (this.timerEnabled) {
                    this.timer = setInterval(this.fetchDataFromServer, 1000);
                    this.timerEnabled = true
                } else {
                    clearInterval(this.timer);
                    this.timerEnabled = false
                }
            },

            fetchDataFromServer: function () {
                axios
                    .get('http://' + process.env.VUE_APP_HOST + process.env.VUE_APP_PORT1 + '/sensors_data?mac=' + this.board + '&type=' + this.sensorType + '&last=1')
                    .then(response => (this.Value = response.data.entity[0]));

                let DateObj = new Date(this.Value.CreatedAt);
                let Now = new Date();
                // console.log((Now - DateObj)/1000);
                if ((Now - DateObj) / 1000 > 120) {
                    if (this.Value.Type === "relay") {
                        this.workingNow = false;
                        this.currentColor = "lightgray";
                    }
                } else {
                    this.workingNow = true;
                    console.log(this.Value.Mac, this.Value.Value);
                    if (this.Value.Value === 1){
                        this.currentColor = "red";
                    }else{
                        this.currentColor = "black";
                    }
                }
                // this.currentColor = this.getColor();
            },
            ISO_to_datetime: function (timestamp) {
                let DateObj = new Date(timestamp);
                let Day = DateObj.getDate().toString().length === 2 ? DateObj.getDate() : '0' + DateObj.getDate();
                let Month = DateObj.getMonth().toString().length === 2 ? DateObj.getMonth() + 1 : '0' + DateObj.getMonth() + 1;
                let Year = DateObj.getFullYear();
                let Hours = DateObj.getHours().toString().length === 2 ? DateObj.getHours() : '0' + DateObj.getHours();
                let Minutes = DateObj.getMinutes().toString().length === 2 ? DateObj.getMinutes() : '0' + DateObj.getMinutes();
                let Seconds = DateObj.getSeconds().toString().length === 2 ? DateObj.getSeconds() : '0' + DateObj.getSeconds();
                return Day + '.' + Month + '.' + Year + ' ' + Hours + ':' + Minutes + ':' + Seconds;

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .v-icon,
    .custom-icon {
        width: 24px;
    }
</style>
