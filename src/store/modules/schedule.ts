import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import { map } from 'lodash';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey:            process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain:        process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId:         process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
});
const db = firebase.firestore();

class ScheduleState {
  public schedules: Array<Object> = [];
}

class ScheduleGetters extends Getters<ScheduleState> {
}

class ScheduleMutations extends Mutations<ScheduleState> {
  pushSchedule(schedule: Object) {
    this.state.schedules.push(schedule);
  }
}

class ScheduleActions extends Actions<
  ScheduleState,
  ScheduleGetters,
  ScheduleMutations,
  ScheduleActions
> {
  private visit(): void {
    db.collection('schedules').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.commit('pushSchedule', {[doc.id]: doc.data()});
      });
    });
  }
}

export const schedule = new Module({
  state:     ScheduleState,
  getters:   ScheduleGetters,
  mutations: ScheduleMutations,
  actions:   ScheduleActions,
});
