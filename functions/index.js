const admin = require('firebase-admin');
const functions = require('firebase-functions');
const _ = require('lodash');
const Twitter = require('twitter');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Tokyo');

admin.initializeApp();
const db = admin.firestore();

exports.getSchedule = functions.region('asia-northeast1').https.onRequest((req, res) => {
  let client = new Twitter({
    consumer_key       : `${functions.config().twitter.consumer.key}`,
    consumer_secret    : `${functions.config().twitter.consumer.secret}`,
    access_token_key   : `${functions.config().twitter.access_token.key}`,
    access_token_secret: `${functions.config().twitter.access_token.secret}`,
  });

  const params = {
    user_id    : '916156645004029952',
    count      : 20,
    include_rts: false,
    tweet_mode : 'extended',
  };

  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    if (error) {
      console.log(error);
      return;
    }

    const holoduleTweet = _.find(tweets, (tweet) => {
      return _.find(tweet.entities.hashtags, (hashtag) => {
        return hashtag.text === 'ホロジュール';
      });
    });
    if (!holoduleTweet) return;

    const reply = _.find(tweets, (tweet) => {
      return tweet.in_reply_to_status_id === holoduleTweet.id;
    })

    const holoduleTweetWithReply = _.concat(
      holoduleTweet.full_text.split(/\r\n|\n/),
      reply ? reply.full_text.split(/\r\n|\n/) : []
    );

    const reDay  = /本日.+(\d{1,2})\/(\d{1,2})/;
    const reTime = /^(\d{1,2}):(\d{1,2})/;
    const reName = /アキロゼ|さくらみこ|紫咲シオン|赤井はあと|湊あくあ|ときのそら|白上フブキ|ロボ子さん|百鬼あやめ|大空スバル|大神ミオ|夏色まつり|癒月ちょこ|夜空メル|猫又おかゆ|戌神ころね/g;

    let currentTime;
    let day;
    let schedule = [];
    _.forEach(holoduleTweetWithReply, (line) => {
      const matched = {
        day:   line.match(reDay),
        time:  line.match(reTime),
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
          schedule.push({
            time: currentTime,
            names: matched.names,
          });
        }
      }
    });

    if (schedule.length === 0) {
      console.log('schedule not found');
      return;
    }

    db.collection('schedules').where('start_at', '>=', schedule[0].time.toDate()).get().then((querySnapshot) => {
      const holodule = [];
      querySnapshot.forEach((doc) => { holodule.push(doc.data()) });

      schedule.forEach((addLive) => {
        if (
          !_.find(holodule, (holoLive) => {
            return (holoLive.start_at.seconds === addLive.time.unix())
              && (_.difference(holoLive.channels, addLive.names).length === 0)
          })
        ) {
          db.collection('schedules').add({
            start_at: addLive.time.toDate(),
            channels: addLive.names,
          });
        }
      });
      return;
    })
    .catch((error) => {
      console.log(error);
    });
  });

  return res.sendStatus(200);
});