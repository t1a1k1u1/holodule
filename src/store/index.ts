import Vue from 'vue';
import * as Vuex from 'vuex';
import { createStore, Module } from 'vuex-smart-module';
import { schedule } from './modules/schedule';

Vue.use(Vuex);

export const store = createStore(
  schedule,
  {
    strict: process.env.NODE_ENV !== 'production',
  },
);
