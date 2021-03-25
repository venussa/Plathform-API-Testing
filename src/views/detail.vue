<!-- eslint-disable-->
<template>
    <div>
      <b-container class="container" v-if="api !== false">
        <b-col md="10" offset-md="1">

          <b-card class="box">
            <b-row>
              <!-- title -->
              <h1>{{ api.data.name }}</h1>
              <div class="col-md-12" style="margin-top:10px">
                <b-row>
                  <p>{{ api.data.description === null ? 'No description' : api.data.description }}</p>
                </b-row>
              </div>

              <!-- breadcrumb -->
              <div class="col-md-12 breadcrumb">
                <b-row>
                  <feather-icon icon="HomeIcon" size="18" class="icon" /> 
                  <b-link :to="{ 'name': 'node' }"> Home </b-link> / 
                  <b-link :to="{ 'name': 'sensor', params: { 'n_id': $route.params.n_id }}"> Node </b-link> / 
                  Sensor
                </b-row>
              </div>

              <!-- table sensor detail -->
              <div class="col-md-12" style="margin-bottom:20px">
                  <table width="100%">
                      <tr>
                          <td style="width: 150px"><strong>Sensor Name</strong></td>
                          <td>: {{ api.data.name }}</td>
                      </tr>
                       <tr>
                          <td><strong>Description</strong></td>
                          <td>: {{ api.data.description }}</td>
                      </tr>
                      <tr>
                          <td><strong>Data Type</strong></td>
                          <td>: {{ api.data.data_type }}</td>
                      </tr>
                      <tr v-if="lastSensor !== false">
                          <td><strong>Value</strong></td>
                          <td>: {{ lastSensor.value }}</td>
                      </tr>
                      <tr v-if="lastSensor !== false">
                          <td><strong>Status</strong></td>
                          <td>: 
                            <b-badge v-if="lastSensor.sensor_status === 'down'" class="badges" variant="danger">Down</b-badge>
                            <b-badge v-if="lastSensor.sensor_status !== 'down'" class="badges" variant="success">Up</b-badge>
                          </td>
                      </tr>
                       <tr v-if="lastSensor !== false">
                          <td><strong>Last Update</strong></td>
                          <td>: {{ lastSensor.updated_at }}</td>
                      </tr>
                  </table>
              </div>

              <!-- sensor chart -->
              <div class="col-md-12" style="margin-top:30px;margin-bottom: 30px;">
                <b-row>
                  <div class="col-md-12" style="background: #f5f5f5;border: 1px #ddd solid;margin-bottom: 40px;">
                    <b-row>
                      <div class="col-md-12">
                        <p style="margin-top: 15px;text-align: right">
                          Date Filter : 
                          <input type="date" v-model="startDate" class="form-control" style="display:inline-block;width: 150px" @change="dateMatch" required> - 
                          <input type="date" v-model="endDate" class="form-control" style="display:inline-block;width: 150px" @change="dateMatch" required>
                          <span v-if="advance === true "> - 
                            <select class="form-control" v-model="lowshorting" style="display: inline-block; width: 120px;">
                              <option>Hours</option>
                              <option>Minutes</option>
                            </select>
                          </span>
                          <button class="btn btn-secondary" style="margin-left:20px;position: relative; top:-2px;padding: 11px" @click="dateFilterChart">Filter</button>
                        </p>
                      </div>
                    </b-row>
                  </div>
                  <app-echart-line :option-data="chart" />
                </b-row>
              </div>

              <!-- datatable -->
              <div class="col-md-12" style="background: #f5f5f5;border: 1px #ddd solid;margin-bottom: 40px;">
                <b-row>
                  <div class="col-md-6">
                    <p style="padding:10px;margin-top: 15px;">
                      Filter as :
                      <b-badge variant="success" style="margin-right:10px; cursor: pointer;" @click="status('up')">Up Status</b-badge>
                      <b-badge variant="danger" style="margin-right:10px; cursor: pointer;" @click="status('down')">Down Status</b-badge>
                      <b-badge variant="secondary" style="margin-right:10px; cursor: pointer;" @click="status('all')">All</b-badge>
                    </p>
                  </div>
                  <div class="col-md-6">
                    <p style="margin-top: 15px;text-align: right">
                      Date Filter : 
                      <input type="date" v-model="TStartDate" class="form-control" style="display:inline-block;width: 150px" required> - 
                      <input type="date" v-model="TEndDate" class="form-control" style="display:inline-block;width: 150px" required>
                      <button class="btn btn-secondary" style="margin-left:20px;position: relative; top:-2px;padding: 11px" @click="dateFilterTable">Filter</button>
                    </p>
                  </div>
                </b-row>
              </div>
              <b-table striped hover
                :items="items1"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perpage"
              >
                <template #cell(sensor_status)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    <p>
                      <b-badge v-if="data.item.sensor_status === 'down'" class="badges" variant="danger">Down</b-badge>
                      <b-badge v-if="data.item.sensor_status !== 'down'" class="badges" variant="success">Up</b-badge>
                    </p>
                  </div>
                </template>

                <template #cell(value)="data" aria-colspan="6" >
                  <div v-if="data !== false" class="text-nowrap">
                    <p>{{ data.item.value === null ? '0.00000' : data.item.value }}</p>
                  </div>
                </template>

              </b-table>

              <p v-if="rows1 < 1" class="loading">
                Please Wait ...
              </p>

              <!-- pagination -->
              <div class="col-md-12" style="height:10px"></div>
              <b-col md="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows1"
                  base-url="#"
                  :per-page="perpage"
                  :align="selected"
                />
              </b-col>
            </b-row>
          </b-card>

        </b-col>
      </b-container>
    </div>
</template>

<script>

import {
  BTable,
  BContainer,
  BCol,
  BRow,
  BCard,
  BPagination,
  BBadge,
  BLink,
} from 'bootstrap-vue'

import axios from 'axios'
import httpApi from '@/main'
import AppEchartLine from '@core/components/charts/echart/AppEchartLine.vue'
import FeatherIcon from '@/@core/components/feather-icon/FeatherIcon.vue'

export default {
  components: {
    BCol,
    BRow,
    BTable,
    BContainer,
    BCard,
    FeatherIcon,
    BPagination,
    BBadge,
    BLink,
    AppEchartLine,
  },
  data() {
    return {
      // date range storage
      startDate: '',
      endDate: '',
      timediff: '',
      TStartDate: '',
      TEndDate: '',
      TTimediff: '',
      advance: false,
      lowshorting: 'Hours',

      // axios response storage
      apikey: httpApi.ApiKey,
      api: false,
      lastSensor: false,

      // chart data
      chart: {
        xAxisData: [],
        series: [],
        interval: 1,
      },
      cStorage: false,

      // table field data
      fields: [
        { key: 'created_at', label: 'Update Time', sortable: true },
        { key: 'value', label: 'Value', sortable: true },
        { key: 'sensor_status', label: 'status' },
      ],

      // table value
      items: [],
      items1: [],

      // pagination
      selected: 'center',
      currentPage: 1,
      perpage: 10,
      rows: 0,
      rows1: 0,
    }
  },
  created() {
    // set graph date range
    if (sessionStorage.getItem('date_start') !== null) {
      this.startDate = sessionStorage.getItem('date_start')
      this.endDate = sessionStorage.getItem('date_end')
      this.timediff = sessionStorage.getItem('timediff')
    } else {
      this.startDate = this.getTime(1)
      this.endDate = this.getTime()
      this.timediff = this.strToTime(this.endDate) - this.strToTime(this.startDate)
    }

    // set table date range
    if (sessionStorage.getItem('Tdate_start') !== null) {
      this.TStartDate = sessionStorage.getItem('Tdate_start')
      this.TEndDate = sessionStorage.getItem('Tdate_end')
      this.TTimediff = sessionStorage.getItem('Ttimediff')
    } else {
      this.TStartDate = this.getTime()
      this.TEndDate = this.getTime()
      this.TTimediff = 86400
    }

    // set lower filter data
    if (sessionStorage.getItem('lowshorting') !== null) {
      this.lowshorting = sessionStorage.getItem('lowshorting')
      if (this.timediff <= 86400) {
        this.chart.interval = this.lowshorting === 'Minutes' ? 70 : 0
      } else if (this.timediff > 86400 && this.timediff <= (86400 * 2)) {
        this.chart.interval = 3
      } else if (this.timediff > (86400 * 2) && this.timediff <= (86400 * 4)) {
        this.chart.interval = 5
      } else if (this.timediff > (86400 * 4) && this.timediff <= (86400 * 7)) {
        this.chart.interval = 10
      } else if (this.timediff > (86400 * 7)) {
        this.chart.interval = 1
      }
    }

    // set table status
    if (sessionStorage.getItem('table_status') === null) {
      sessionStorage.setItem('table_status', 'all')
    }

    // set advanced filter data display
    if (this.startDate === this.endDate) {
      this.advance = true
    }

    // get main sensor detail
    const http = axios.get(`${httpApi.host}/sensor/${this.$route.params.s_id}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    http.then(response => {
      this.api = response.data
    })

    http.finally(() => {
      this.last_sensor() // call last sensor data
      this.graph_data() // call graph data
      this.table_sensor() // call table data
    })
  },

  methods: {
    // get las sensor data
    last_sensor() {
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}/last?api_key=${httpApi.ApiKey}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      http.then(response => {
        const { data } = response.data
        const datesource = data.created_at.split('T')
        const getdate = this.dateConvert(datesource[0], 1)

        const timesource = datesource[1].split('.')
        const gettime = this.timeConvert(`${timesource[0]}`, 1)
        data.updated_at = `${getdate} ${gettime}`
        this.lastSensor = data
      })
    },

    // get table data
    table_sensor() {
      // query param
      let param = `start_date=${this.TStartDate}&`
      param += 'start_time=00%3A00%3A01&'
      param += `end_date=${this.TEndDate}&`
      param += 'end_time=23%3A59%3A59'

      // axios request
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}?api_key=${httpApi.ApiKey}&${param}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      // axios response
      http.then(response => {
        const { data } = response.data.data
        const limit = data
        limit.reverse()
        this.items1 = limit
        this.rows1 = this.items1.length
        const status = sessionStorage.getItem('table_status')
        const filter = status === null ? null : status
        const recap = []

        // fix invalid date range data
        if (filter !== null) {
          for (let x = 0; x < this.rows1; x += 1) {
            let datesource = this.items1[x].created_at
            datesource = datesource.split('T')
            const getdate = datesource[0]
            const timesource = datesource[1].split('.')
            const gettime = timesource[0]
            const SD = Date.parse(`${this.TStartDate} 00:00:01`) / 1000
            const ED = Date.parse(`${this.TEndDate} 23:59:59`) / 1000
            const TS = Date.parse(getdate) / 1000

            if (TS > SD && TS <= ED) {
              if (this.items1[x].sensor_status === filter || filter === 'all') {
                this.items1[x].created_at = `${this.dateConvert(getdate, 1)} ${this.timeConvert(gettime, 1)}`
                recap.push(this.items1[x])
              }
            }
          }

          this.items1 = recap
          this.rows1 = recap.length
        }
      })
    },

    // get graph data
    graph_data() {
      // query param
      let param = `start_date=${this.startDate}&`
      param += 'start_time=00%3A00%3A01&'
      param += `end_date=${this.endDate}&`
      param += 'end_time=23%3A59%3A59'

      // axios request
      const http = axios.get(`${httpApi.host}/app/data/sensor/${this.$route.params.s_id}?api_key=${httpApi.ApiKey}&${param}`, {
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },
      })

      // axios response
      http.then(response => {
        if (typeof response.data.data === 'undefined') {
          // if the start date exceeds the end date
          this.$fire({
            title: 'Internal Server Error',
            text: 'Please reset the date range or contact administrator.',
            type: 'error',
            timer: 6000,
          })
        } else {
          // if the date is valid
          const { data } = response.data.data
          const limit = data
          limit.reverse()
          this.items = limit
          this.rows = this.items.length

          let buildData = []

          // data aggregation
          if (this.timediff >= 3600 && this.timediff < (86400 * 7)) {
            // display 1 - 2 days
            if (this.timediff < 86400) {
              if (this.lowshorting === 'Hours') {
                // per hours
                buildData = this.displayHour()
              } else {
                // per minuter
                buildData = this.displayMinutes()
              }
            } else {
              buildData = this.displayHour()
            }
          } else if (this.timediff >= (86400 * 7) && this.timediff < (2629744 * 3)) {
            // display 3 days until 1 month
            buildData = this.displayDay()
          } else if (this.timediff >= (2629744 * 3)) {
            // display bettter than 3 months
            buildData = this.displayMonth()
          }
          this.cStorage = buildData
        }

        http.finally(() => {
          for (let x = 0; x < this.cStorage.length; x += 1) {
            this.chart.xAxisData.push(`${this.cStorage[x][0]}`)
            this.chart.series.push(`${this.cStorage[x][1]}`)
          }
        })
      })
    },

    // filter display as per hours
    displayMinutes() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]

        // get time
        maindata = maindata[1].split('.')
        const gettime = maindata[0]

        // get value
        const getvals = this.items[x].value

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate)) {
          databundle.push([`${gettime}`, getvals])
          timeseries.push(`${gettime}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per hours
    displayHour() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]
        const datelabel = this.dateConvert(getdate, 0)
        console.log(getdate)

        // get time
        maindata = maindata[1].split('.')
        maindata = maindata[0].split(':')
        const gettime = this.timeConvert(`${maindata[0]}:00:00`)

        // get value
        const getvals = this.items[x].value

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate)) {
          databundle.push([`${datelabel} ${gettime}`, getvals])
          timeseries.push(`${datelabel} ${gettime}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per days
    displayDay() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        const getdate = maindata[0]
        const datelabel = this.dateConvert(getdate, 1)

        // get value
        const getvals = this.items[x].value

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate)) {
          databundle.push([`${datelabel}`, getvals])
          timeseries.push(`${datelabel}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // filter display as per days
    displayMonth() {
      const timeseries = []
      const databundle = []
      for (let x = 0; x < this.rows; x += 1) {
        let maindata = this.items[x].created_at

        // get date
        maindata = maindata.split('T')
        maindata = maindata.split('-')
        const getdate = `${maindata[0]}-${maindata[1]}`

        // get value
        const getvals = this.items[x].value

        // databundle
        if (this.strToTime(getdate) >= this.strToTime(this.startDate) && this.strToTime(getdate) <= this.strToTime(this.endDate)) {
          databundle.push([`${getdate}`, getvals])
          timeseries.push(`${getdate}`)
        }
      }

      const TS = [...new Set(timeseries)]
      databundle.reverse()
      TS.reverse()
      const DB = this.multiDimensionalUnique(databundle, TS)
      return DB
    },

    // date filter chart submit
    dateFilterChart() {
      const timestamp1 = Date.parse(`${this.startDate} 00:00:01`) / 1000
      const timestamp2 = Date.parse(`${this.endDate} 23:59:59`) / 1000
      const calcstamps = timestamp2 - timestamp1

      if (timestamp1 > timestamp2) {
        this.$fire({
          title: 'Invalid date range !!!',
          text: 'start date exceeds the end date',
          type: 'error',
          timer: 6000,
        })
      } else {
        sessionStorage.setItem('date_start', this.startDate)
        sessionStorage.setItem('date_end', this.endDate)
        sessionStorage.setItem('timediff', calcstamps)
        sessionStorage.setItem('lowshorting', this.lowshorting)
        window.location.reload()
      }
    },

    // date filter table submit
    dateFilterTable() {
      const timestamp1 = Date.parse(`${this.TStartDate} 00:00:01`) / 1000
      const timestamp2 = Date.parse(`${this.TEndDate} 23:59:59`) / 1000
      const calcstamps = timestamp2 - timestamp1

      if (timestamp1 > timestamp2) {
        this.$fire({
          title: 'Invalid date range !!!',
          text: 'start date exceeds the end date',
          type: 'error',
          timer: 6000,
        })
      } else {
        sessionStorage.setItem('Tdate_start', this.TStartDate)
        sessionStorage.setItem('Tdate_end', this.TEndDate)
        sessionStorage.setItem('Ttimediff', calcstamps)
        window.location.reload()
      }
    },

    // compare start date and end date
    dateMatch() {
      if (this.startDate === this.endDate) {
        this.advance = true
      } else {
        this.advance = false
      }
    },

    // table sorting as status
    status(data) {
      sessionStorage.setItem('table_status', data)
      window.location.reload()
    },

    // str to time
    strToTime(data) {
      return (Date.parse(data) / 1000)
    },

    // get current time
    getTime(type = 0) {
      const today = new Date()
      let dd = '01'
      if (type === 1) {
        dd = '01'
      } else {
        dd = String(today.getDate()).padStart(2, '0')
      }
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      return `${yyyy}-${mm}-${dd}`
    },

    // array dulicate data remover
    multiDimensionalUnique(arr, ts) {
      const uniques = []
      const itemsFound = {}
      const result = []
      for (let i = 0, l = arr.length; i < l; i += 1) {
        const stringified = JSON.stringify(arr[i])
        if (!itemsFound[stringified]) {
          uniques.push(arr[i])
          itemsFound[stringified] = true
        }
      }
      for (let x = 0; x < uniques.length; x += 1) {
        if (uniques[x][1] === null) {
          const data = 0
          result.push([uniques[x][0], data])
        } else {
          const data = parseFloat(uniques[x][1], 10)
          result.push([uniques[x][0], data])
        }
      }

      let total = 0
      let accul = 0
      const rs = []
      for (let x = 0; x < ts.length; x += 1) {
        for (let y = 0; y < result.length; y += 1) {
          if (ts[x] === result[y][0]) {
            if (result[y][1] > 0) {
              accul += result[y][1]
              total += 1
            }
          }
        }
        let avg = 0
        if (accul > 0) {
          avg = accul / total
        } else {
          avg = accul
        }
        rs.push([ts[x], avg.toFixed(2)])
        if (accul > 0) {
          accul = 0
          total = 0
        }
      }
      return rs
    },

    // time convert
    timeConvert(time, type = 0) {
      let timeString = time
      const H = +timeString.substr(0, 2)
      const h = (H % 12) || 12
      const ampm = H < 12 ? 'AM' : 'PM'
      if (type === 1) {
        timeString = `${h + timeString.substr(2, 3)} ${ampm}`
      } else {
        timeString = `${h + timeString.substr(0, 0)} ${ampm}`
      }
      return timeString
    },

    // date covert to name
    dateConvert(data, type = 0) {
      const datename = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      const datesplit = data.split('-')

      let month = ''
      if (type > 0) {
        month = `${datename[(parseInt(datesplit[1], 10) - 1)]} ${datesplit[2]}, ${datesplit[0]}`
      } else {
        month = `${datename[(parseInt(datesplit[1], 10) - 1)]} ${datesplit[2]}, `
      }
      return month
    },
  },
}
</script>
