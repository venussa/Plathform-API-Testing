<!-- eslint-disable-->
<template>
    <div>
      <b-container class="container">
        <b-col md="10" offset-md="1">

          <b-card class="box">
            <b-row>
              <!-- title -->
              <h1 v-if="api !== false">{{ api.data.name }}</h1>
              <div class="col-md-12" style="margin-top:10px">
                <b-row>
                  <p v-if="api !== false">{{ api.data.description === null ? 'No description' : api.data.description }}</p>
                </b-row>
              </div>

              <!-- breadcrumb -->
              <div class="col-md-12 breadcrumb">
                <b-row>
                  <feather-icon icon="HomeIcon" size="18" class="icon" /> 
                  <b-link :to="{ 'name': 'node' }"> Home </b-link> / 
                  Node
                </b-row>
              </div>

              <!-- datatable -->
              <b-table striped hover
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perpage"
              >
                 <template #cell(action)="data" aria-colspan="6">
                  <div class="text-nowrap">
                    <b-link :to="{ name: 'detail', params: { 'n_id': $route.params.n_id, 's_id': data.item.id }}">View Detail</b-link>
                  </div>
                </template>

              </b-table>

              <p v-if="rows < 1" class="loading">
                Please Wait ...
              </p>

              <!-- pagination -->
              <div class="col-md-12" style="height:10px"></div>
              <b-col md="12">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
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
  BLink,
} from 'bootstrap-vue'

import axios from 'axios'
import httpApi from '@/main'
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
    BLink,
  },
  data() {
    return {
      api: false,

      // table field data
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: true },
        { key: 'data_type', label: 'Data Type', sortable: true },
        { key: 'updated_at', label: 'Time Update', sortable: true },
        { key: 'action', label: '#', sortable: true },
      ],

      // table value
      items: [],

      // pagination
      selected: 'center',
      currentPage: 1,
      perpage: 10,
      rows: 0,
    }
  },
  created() {
    // get sensor list
    const http = axios.get(`${httpApi.host}/app/node/${this.$route.params.n_id}?api_key=${httpApi.ApiKey}&with_sensors=true`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    http.then(response => {
      this.api = response.data
    })

    http.finally(() => {
      this.items = this.api.data.sensors
      this.rows = this.api.data.sensors.length
    })
  },
}
</script>
