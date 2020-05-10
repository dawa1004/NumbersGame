'use strict';

{
  class Panel {
    constructor(game) { //pressedクラスがついたli要素を持つボード
      this.game = game;
      this.el = document.createElement('li');
      this.el.classList.add('pressed');
      this.el.addEventListener('click', () => { // クリックしたら次を処理
        this.check(); // 処理が煩雑なのでメソッドにする 下の方で作成
      });
    }
    getEl() { // メソッド作成
      return this.el; // elプロパティを返す
    }

    activate(num) { //パネルに配置する数値が渡ってくるのでnumで引き受ける
      this.el.classList.remove('pressed'); // パネルからpressedクラスを外す
      this.el.textContent = num; // li要素にnumをセットする
    }

    // currentNumと押し込んだパネルの数値が合っているか比較する
    check() {  // this.el.textContentは文字列なのでparseIntで数値にして比較
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
        this.el.classList.add('pressed'); // pressedクラス付与→正解はボタンが押し込まれる
        this.game.addCurrentNum(); // 次の数値を選べるように1増やす
        // currentNumが4だったらタイマーを止める
        if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  class Board {
    constructor(game) {
      this.game = game;
      this.panels = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {  //パネル作成 getLevel2乗
        this.panels.push(new Panel(this.game));
      }
      this.setup(); // setupメソッド呼び出し
    }

  setup() { // board要素取得
    const board = document.getElementById('board'); //定数宣言
    this.panels.forEach(panel => { // panelsの数だけ要素を追加
      board.appendChild(panel.getEl()); // カプセル化 boardの子ノードにpanel追加
    });
  }

  activate() { // メソッド作成
    const nums = []; // 配置したい数値を配列で用意
    for (let i = 0; i < this.game.getLevel() ** 2; i++) {
      nums.push(i);
    }
    this.panels.forEach(panel => { // それぞれのパネルに対して処理
      const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0]; // ランダムな位置から要素を一つ取り出す
      panel.activate(num); // ランダムな数値が一つずつ選ばれてパネルに反映
    });
  }
}

  class Game {
    constructor(level) { //難易度
      this.level = level;
      this.board = new Board(this); //プロパティ生成

      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;
    
      // btn要素を取得してイベントを設定
      const btn= document.getElementById('btn'); // btn要素取得
      btn.addEventListener('click', () => { // クリックしたら次の処理
        this.start();
      });
      this.setup();
    }

    setup() {
      const container = document.getElementById('container');
      const PANEL_WIDTH = 50; //わかりやすく大文字
      const BOARD_PADDING = 10;
      /* 50px * 2 + 10px * 2 */
      container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px'; //パネル全体の幅を難易度ごとに広げる
    }

    start() { //メソッド定義 プロパティやメソッドにはthisをつける
      if (typeof this.timeoutId !== 'undefined') { // もしタイマーが走っていればそれを止める
        clearTimeout(this.timeoutId);
      }
  
      this.currentNum = 0; // START押した時に0にリセット
      this.board.activate();
  
      this.startTime = Date.now(); // ボタンを押した時の現在時刻を保持
      this.runTimer();
    }

    runTimer() { //メソッド
      const timer = document.getElementById('timer'); // timer要素取得
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2); // 現在時刻からStartボタンを押した時刻を引く
    
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10); // 10ミリ秒後に呼び出す
    }
    // メソッド
    addCurrentNum() {
      this.currentNum++;
    }

    getCurrentNum() {
      return this.currentNum;
    }

    getTimeoutId() {
      return this.timeoutId;
    }

    getLevel() {
      return this.level;
    }
  }

  new Game(5); //インスタンス作成 難易度を（）に入れるとマス数になる
}