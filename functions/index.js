const admin = require('firebase-admin');
const functions = require('firebase-functions');
const _ = require('lodash');
const Twitter = require('twitter');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Tokyo');

admin.initializeApp();
const db = admin.firestore();

const twitterClient = new Twitter({
  consumer_key       : `${functions.config().twitter.consumer.key}`,
  consumer_secret    : `${functions.config().twitter.consumer.secret}`,
  access_token_key   : `${functions.config().twitter.access_token.key}`,
  access_token_secret: `${functions.config().twitter.access_token.secret}`,
});

function getHoloduleTweet(tweets) {
  const root = _.find(tweets, (tweet) => {
    return !tweet.in_reply_to_status_id && _.find(tweet.entities.hashtags, {text: 'ホロジュール'});
  });
  if (!root) return {};

  let schedules = [root.full_text];
  let currentID = root.id;
  _.sortBy(tweets, ['id']).forEach((tweet) => {
    if (tweet.in_reply_to_status_id === currentID) {
      schedules.push(tweet.full_text);
      currentID = tweet.id;
    }
  });
  return {
    id_str: root.id_str,
    text: _.join(schedules, '\n'),
  };
}

async function existTweet(tweet) {
  const tweetDoc = await db.collection('tweet').doc(tweet.id_str).get();
  return tweetDoc.exists;
}

function logTweet(tweet) {
  console.log(tweet);
  db.collection('tweet').doc(tweet.id_str).set({
    tweet_id: Number(tweet.id_str),
    text    : tweet.text,
  });
}

function extractEvent(tweet) {
  const reDay  = /本日.+(\d{1,2})\/(\d{1,2})/;
  const reTime = /^(\d{1,2}):(\d{1,2})/;
  const reName = /アキロゼ|さくらみこ|紫咲シオン|赤井はあと|湊あくあ|ときのそら|白上フブキ|ロボ子さん|百鬼あやめ|大空スバル|大神ミオ|夏色まつり|癒月ちょこ|夜空メル|猫又おかゆ|戌神ころね|兎田ぺこら|潤羽るしあ|星街すいせい|AZKi/g;

  const lines = tweet.text.split(/\r\n|\n/);

  let currentTime;
  let day;
  let events = [];
  lines.forEach(line => {
    const matched = {
      day  : line.match(reDay),
      time : line.match(reTime),
      names: line.match(reName),
    };

    if (matched.day) {
      day = `${matched.day[1]}/${matched.day[2]}`;
    }

    if (day) {
      if (matched.time) {
        if (24 < Number(matched.time[1])) {
          matched.time[1] = `${(Number(matched.time[1]) -24)}`;
          currentTime = moment(`${day} ${matched.time[1]}:${matched.time[2]}`, 'MM/DD HH:mm').add(1, 'd');
        } else {
          currentTime = moment(`${day} ${matched.time[0]}`, 'MM/DD HH:mm');
        }
      }

      if (matched.names) {
        events.push({
          time : currentTime,
          names: matched.names,
        });
      }
    }
  });
  return events;
}

exports.setEvent = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const tweets = await twitterClient.get('statuses/user_timeline', {
    user_id    : '916156645004029952',
    count      : 20,
    include_rts: false,
    tweet_mode : 'extended',
  });
  const holoduleTweet = getHoloduleTweet(tweets);
  if (_.isEmpty(holoduleTweet)) {
    console.log('not found holoduleTweet');
    return res.sendStatus(200);
  }
  if (await existTweet(holoduleTweet)) {
    return res.sendStatus(200);
  }

  logTweet(holoduleTweet);

  const events = extractEvent(holoduleTweet);
  if (_.isEmpty(events)) {
    console.log('not found events');
    return res.sendStatus(200);
  }

  const snapshot = await db.collection('event').where('start_at', '>=', events[0].time.toDate()).get();
  const holodule = [];
  snapshot.forEach(doc => { holodule.push(doc.data()) });

  events.forEach(event => {
    if (
      !_.find(holodule, (hololive) => {
        return (hololive.start_at.seconds === event.time.unix())
          && (_.difference(hololive.channels, event.names).length === 0)
      })
    ) {
      db.collection('event').add({
        start_at: event.time.toDate(),
        channels: event.names,
      });
    }
  });
  return res.sendStatus(200);
});
