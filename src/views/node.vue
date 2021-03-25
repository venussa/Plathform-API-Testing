<!-- eslint-disable-->
<template>
    <div>
      <b-container class="container">
        <b-col md="10" offset-md="1">

          <b-card class="box">
            <b-row>
              <!-- title -->
              <h1>Node List</h1>

              <!-- breadcrumb -->
              <div class="col-md-12 breadcrumb">
                <b-row>
                  <feather-icon icon="HomeIcon" size="18" class="icon" /> Home
                </b-row>
              </div>

              <!-- datatable -->
              <b-table striped hover
                :items="items"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perpage"
              >
                <template #cell(name)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    <strong>{{ data.item.name }}</strong>
                  </div>
                </template>

                <template #cell(description)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    {{ data.item.description === null ? 'No description' : data.item.description }}
                  </div>
                </template>

                <template #cell(api_key)="data" aria-colspan="6" >
                  <div class="text-nowrap">
                    {{ data.item.api_key }}
                  </div>
                </template>

                <template #cell(action)="data" aria-colspan="6">
                  <div class="text-nowrap">
                    <b-link :to="{ name: 'sensor', params: { 'n_id': data.item.id }}">View Detail</b-link>
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
      api: [],
      apikey: httpApi.ApiKey,

      // table field data
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'description', label: 'Description', sortable: true },
        { key: 'api_key', label: 'API Key', sortable: true },
        { key: 'action', label: '#' },
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
    const http = axios.get(`${httpApi.host}/app/node?api_key=${httpApi.ApiKey}`, {
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
    })

    http.then(response => {
      this.api = response.data
    })

    http.finally(() => {
      this.items = this.api.data
      this.rows = this.api.data.length
    })
  },
}
</script>
