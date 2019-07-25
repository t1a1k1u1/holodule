import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import * as firebase from 'firebase/app';
import * as moment from 'moment-timezone';
import 'firebase/firestore';
import channels from '@/assets/channel.json';

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
  public criterionTime!: moment.Moment;
  public events: object[] = [];
  public channels: object[] = channels;
}

class ScheduleGetters extends Getters<ScheduleState> {
}

class ScheduleMutations extends Mutations<ScheduleState> {
  public setCriterionTime(payload: moment.Moment) {
    this.state.criterionTime = payload;
  }

  public setEvents(payload: object[]) {
    this.state.events = payload;
  }
}

class ScheduleActions extends Actions<
  ScheduleState,
  ScheduleGetters,
  ScheduleMutations,
  ScheduleActions
> {
  private initState(): void {
    this.commit('setCriterionTime', moment.tz('Asia/Tokyo').startOf('hour'));
  }

  private async searchEvent(time: moment.Moment): Promise<void> {
    const querySnapshot = await db.collection('event')
      .where('start_at', '>=', time.clone().toDate())
      .orderBy('start_at')
      .get();
    const docData: object[] = [];
    querySnapshot.forEach((doc) => {
      docData.push(doc.data());
    });
    this.commit('setEvents', docData);
  }
}

export const schedule = new Module({
  state:     ScheduleState,
  getters:   ScheduleGetters,
  mutations: ScheduleMutations,
  actions:   ScheduleActions,
});
