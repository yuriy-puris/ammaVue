import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import $ from 'jquery';
Vue.use(Vuex)
const store = new Vuex.Store ({
  state: {
    home_page: null,
    menu_list: null,
    pages: null,
    page_exhibitions: null,
    filter_settings: null,
    artworks: null,
    contact_page: null,
  },
  actions: {
    LOAD_MENU_LIST: function({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp-api-menus/v2/menus/18')
        .then((response) => {
            commit('SET_MENU_LIST', { menu_list: response.data.items })
          },
          (err) => {
            console.log(err)
          }
        )
    },
    LOAD_PAGE_LIST: function({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp/v2/pages')
        .then((response) => {
          commit('SET_PAGE_LIST', { pages: response.data })
        },
        (err) => {
          console.log(err)
        }
      )
    },
    LOAD_EXHIBITIONS: function({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp/v2/exhibitions')
        .then((response) => {
            commit('SET_EXHIBITIONS', { page_exhibitions: response.data })
          },
          (err) => {
            console.log(err)
          }
        )
    },
    LOAD_FILTER_SETTINGS: function({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp/v2/artworks-settings')
        .then((response) => {
          commit('SET_FILTER_SETTINGS', { filter_settings: response.data })
        },
        (err) => {
          console.log(err)
        }
      )
    },
    LOAD_ARTWORKS: function({commit}, query) {
      let queryStr = ''
      if( typeof query !== 'undefined'  ) {
        for( let key in query ) {
          if( key === 'types' ) {
            queryStr += `&filter[${key}]=${query[key]}`
          } else if ( key === 'per_page' ) {
            queryStr += `&${key}=${query[key]}`
          } else if ( key === 'new-acquisition' ) {
            queryStr += `&${key}=${query[key]}`
          } else if ( key === 'artwork_year' ) {
            queryStr += `&${key}=${query[key]}`
          } else if ( key === 'orderby' ) {
            queryStr += `&${key}=${query[key]}`
          } else {
            queryStr += `&filter[${key}]=${query[key]}`
          }
        }
      } else {
        queryStr += ''
      }
      axios.get(`http://amma-test.bigdropinc.net/wp-json/wp/v2/artworks?_embed${queryStr}`)
        .then((response) => {
            commit('SET_ARTWORKS', { artworks: response.data })
          },
          (err) => {
            console.log(err)
          }
        )
    },
    LOAD_HOME_PAGE: function({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp/v2/pages/394')
        .then((response) => {
          let home_page = {
            home_collection:  response.data.acf.home_collection_artworks,
            home_slider_artworks: response.data.acf.home_slider_artworks,
            home_exhibitions: response.data.acf.home_exhibitions,
            home_artists: response.data.acf.home_artists
          }
          commit('SET_HOME_PAGE', { home_page })
          }).catch(e => {
            console.log(e)
        })
    },
    LOAD_CONTACT_PAGE: function ({commit}) {
      axios.get('http://amma-test.bigdropinc.net/wp-json/wp/v2/pages/6')
        .then((response) => {
          commit('SET_CONTACT_PAGE', { contact_page: response.data })
        }).catch(e => {
          console.log(e)
        })
    }
  },
  mutations: {
    SET_MENU_LIST: (state, { menu_list }) => {
      state.menu_list = menu_list
    },
    SET_PAGE_LIST: (state, { pages }) => {
      state.pages = pages
    },
    SET_EXHIBITIONS: (state, { page_exhibitions }) => {
      state.page_exhibitions = page_exhibitions
    },
    SET_FILTER_SETTINGS: (state, { filter_settings }) => {
      state.filter_settings = filter_settings
    },
    SET_ARTWORKS: (state, { artworks }) => {
      state.artworks = artworks
    },
    SET_HOME_PAGE: (state, { home_page }) => {
      state.home_page = home_page
    },
    SET_CONTACT_PAGE: (state, {contact_page}) => {
      state.contact_page = contact_page
    }
  },
  getters: {
    getPage: (state) => (name) => {
      if( state.pages !== null ) {
        return state.pages.find(item => item.slug == name)
      }
    },
    getExhibitions: (state) => () => {
      return state.page_exhibitions
    },
    getSubMenuExhib: (state) => (name) => {
      return state.menu_list.find(item => item.object == name)
    }
  },
})

export default store
