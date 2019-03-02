import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
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
  public schedules: object[] = [];
}

class ScheduleGetters extends Getters<ScheduleState> {
}

class ScheduleMutations extends Mutations<ScheduleState> {
  setSchedules(data: object[]) {
    this.state.schedules = data;
  }
}

class ScheduleActions extends Actions<
  ScheduleState,
  ScheduleGetters,
  ScheduleMutations,
  ScheduleActions
> {
  private fetchSchedules(): void {
    db.collection('schedules').orderBy('start_at').get().then((querySnapshot) => {
      const docData: object[] = [];
      querySnapshot.forEach((doc) => {
        docData.push(doc.data());
      });
      this.commit('setSchedules', docData);
    });
  }
}

export const schedule = new Module({
  state:     ScheduleState,
  getters:   ScheduleGetters,
  mutations: ScheduleMutations,
  actions:   ScheduleActions,
});
