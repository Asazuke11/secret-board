'use strict';
const pug = require('pug');
const Post = require('./post');
const Cookies = require('cookies');
const util = require("./handler-util");
const trackingIdKey = 'tracking_id';

function handle(req, res) {
  const cookies = new Cookies(req, res);
  addTrackingCookie(cookies);

  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': `text/html; charset=utf-8`
      });
      Post.findAll({ order: [['id', 'DESC']] }).then((posts) => {
        timeDisplay(posts);
        const nowCookie = cookies.get(trackingIdKey);
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts,
          nowCookie:nowCookie
        }));
      });
      break;
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const content = decoded.split("content=")[1];
        const now = Date.now();
        Post.create({
          content: content,
          time: now,
          trackingCookie: cookies.get(trackingIdKey),
          postedBy: req.user
        }).then(() => {
          handleRedirectPosts(req, res);
        });
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

function addTrackingCookie(cookies) {
  if (!cookies.get(trackingIdKey)) {
    const trackingId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const tomorrow = new Date(Date.now() + (1000 * 60 * 60 * 24));
    cookies.set(trackingIdKey, trackingId, { expires: tomorrow });
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function timeDisplay(posts){
  for(let i = 0; i < posts.length;i++) {
    let time = parseInt(posts[`${i}`].time);
    let now = Date.now();
    let day = new Date(time);
    day = day.toLocaleDateString().split("-");

    let datet = Math.round(((now - time) / 1000));
    let hour = Math.round(datet / 3600);
    let min = Math.round(((datet / 60) % 60));
    let sec = Math.round(datet % 60);

    if(hour > 24){
      posts[`${i}`].time = `${day[0]}年${day[1]}月${day[2]}日`;
    }else if(hour >= 1){
      posts[`${i}`].time = `${hour}時間前`;
    }else if(min >=1){
      posts[`${i}`].time = `${min}分前`;
    }else{
      posts[`${i}`].time = `${sec}秒前`;
    }

    let CookieNumber = posts[`${i}`].trackingCookie;
    const charItem = [
      "buta.pug",
      "azarasi.pug",
      "hituji.pug",
      "inu.pug",
      "kuma.pug",
      "okami.pug",
      "tanuki.pug"
      ];
    let charNumber = CookieNumber % charItem.length;
    posts[`${i}`].char = charNumber;
  }
}

function handleDelete(req, res) {
  switch (req.method) {
    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        const decoded = decodeURIComponent(body);
        const id = decoded.split('id=')[1];
        Post.findByPk(id).then((post) => {
            post.destroy().then(() => {
              handleRedirectPosts(req, res);
          })
        });
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = { 
  handle,
  handleDelete
 };