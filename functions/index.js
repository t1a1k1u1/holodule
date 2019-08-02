const admin = require('firebase-admin');
const functions = require('firebase-functions');
const _ = require('lodash');
const Twitter = require('twitter');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Tokyo');

admin.initializeApp();
const db = admin.firestore();
const tweetStatusRef = db.collection('appStatus').doc('tweet');
const eventsRef = db.collection('event');

const twitterClient = new Twitter({
  consumer_key       : `${functions.config().twitter.consumer.key}`,
  consumer_secret    : `${functions.config().twitter.consumer.secret}`,
  access_token_key   : `${functions.config().twitter.access_token.key}`,
  access_token_secret: `${functions.config().twitter.access_token.secret}`,
});

let params = {
  user_id    : '916156645004029952',
  count      : 20,
  include_rts: false,
  tweet_mode : 'extended',
};

const members = [
  "アキロゼ", "さくらみこ", "紫咲シオン", "赤井はあと", "湊あくあ",
  "ときのそら", "白上フブキ", "ロボ子さん", "百鬼あやめ", "大空スバル",
  "大神ミオ", "夏色まつり", "癒月ちょこ", "夜空メル", "猫又おかゆ",
  "星街すいせい", "AZKi", "戌神ころね", "兎田ぺこら", "潤羽るしあ",
  "白銀ノエル", "宝鐘マリン", "不知火フレア",
];

exports.setEvent = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const reSchedule = /^(\d{1,2}):(\d{1,2})(.+)/;
  const reName = new RegExp(_.join(members, '|'), 'g');

  const statusDoc = await tweetStatusRef.get();
  if (!statusDoc.exists) { console.log('not found tweetStatus'); return res.sendStatus(200); }

  params.since_id = statusDoc.data().recentId;
  const tweets = await twitterClient.get('statuses/user_timeline', params);
  if (tweets.length <= 0) { console.log('not found tweets'); return res.sendStatus(200); }

  const recentTweet = tweets[tweets.length - 1];
  await tweetStatusRef.update({ recentId: recentTweet.id_str });

  let events = [];
  tweets.forEach(tweet => {
    const day = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').startOf('day');
    const lines = tweet.full_text.split(/\r\n|\n/);

    lines.forEach(line => {
      const matchedSchedule = line.match(reSchedule);
      if (!matchedSchedule) return;

      const matchedNames = matchedSchedule[3].match(reName);
      if (!matchedNames) return;

      const time = day.clone().add({
        hours: Number(matchedSchedule[1]),
        minutes: Number(matchedSchedule[2]),
      });

      events.push({ time, names: matchedNames });
    });
  });
  if (events.length <= 0) { console.log('not found events'); return res.sendStatus(200); }

  events = _.sortBy(events, ['time']);
  const snapshot = await eventsRef.where('start_at', '>=', events[0].time.toDate()).get();
  const existings = [];
  snapshot.forEach(doc => { existings.push(doc.data()) });

  events.forEach(event => {
    if (_.find(existings, (existing) => {
      return (existing.start_at.seconds === event.time.unix()) && (_.difference(existing.channels, event.names).length === 0);
    })) { return; }
    eventsRef.add({
      start_at: event.time.toDate(),
      channels: event.names,
    });
  });

  return res.sendStatus(200);
});
