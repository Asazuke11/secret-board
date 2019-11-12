# secret-board
**N予備校プログラミング入門** Webアプリ第３章で作っている**匿名掲示板**です。


##### 機能  
トラッキングクッキーを使い、IDで匿名のまま同じ人が投稿したことがわかるように。  
ID値で動物のアイコンと、語尾が付与。  
クッキーの消費期間は２４時間。  
コメント削除機能。

N予備校テキスト外の追加機能部分
```
//  posts <-- DBに保存したものすべてをfindAllですべて読みこんだもの
//  posts.time <-- 投稿データと一緒に書き込んだDate.now()の値。

function timeDisplay(posts){ 
  for(let i = 0; i < posts.length;i++) { //DBから読みだした配列の要素全てを回し、
    let time = parseInt(posts[`${i}`].time); //文字列型で保存されたDate.now()を数値型に。
    let now = Date.now(); //現在の時間を取得、
    let day = new Date(time); // 秒数値を　曜日・月・日・年・時刻 GMT+0900　の形に。(toLocaleDateString関数を使う為)

    // toLocaleDateString関数で"月/日/年"の形にしてから、splitで[月,日,年]と配列に入れる。
    // 注)日本語化したローカル環境では年/月/日になり、herokuと違う出力になることも。
    day = day.toLocaleDateString().split("/");

    let datet = Math.floor(((now - time) / 1000));
    let hour = Math.floor(datet / 3600);
    let min = Math.floor(((datet / 60) % 60));
    let sec = Math.floor(datet % 60);

    if(hour > 24){
      posts[`${i}`].time = `${day[2]}年${day[0]}月${day[1]}日`;
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
```