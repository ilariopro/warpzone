import Phaser from 'phaser';

type CountdownConfig = {
  seconds: number;
  style?: Phaser.Types.GameObjects.Text.TextStyle;
  x: number;
  y?: number;
  onTimeUp: () => void;
};

const defaultStyle = { fontFamily: 'sans-serif', fontSize: '2em', fill: '#ffffff' };

class Countdown extends Phaser.GameObjects.Text {
  public static readonly Tick = 'tick';

  private startTime!: number;
  private totalTime: number;
  private timeElapsed = 0;
  private isStarted = false;
  private timerEvent: Phaser.Time.TimerEvent;
  private onTimeUp: () => void;

  private static defaultText = '00:00';

  public constructor(scene: Phaser.Scene, config: CountdownConfig) {
    const x = config.x;
    const y = config.y ?? x;

    super(scene, x, y, Countdown.defaultText, config.style ?? defaultStyle);
    scene.add.existing(this);

    scene.events.on('pause', this.pause, this);
    scene.events.on('resume', this.resume, this);

    this.totalTime = config.seconds * 1000; // convert to milliseconds
    this.onTimeUp = config.onTimeUp;

    this.timerEvent = scene.time.addEvent({
      delay: 100, // update every 100 ms
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
      paused: true,
    });

    this.setFormattedTime(this.totalTime);
  }

  public getTimeLeft() {
    if (!this.isStarted) {
      return this.totalTime - this.timeElapsed;
    } else {
      return this.totalTime - (Date.now() - this.startTime);
    }
  }

  public isRunning() {
    return this.isStarted;
  }

  public start() {
    if (this.isStarted) return;

    if (this.timeElapsed > 0) {
      this.resume();
      return;
    }

    this.startTime = Date.now() - this.timeElapsed;
    this.isStarted = true;
    this.timerEvent.paused = false;
  }

  public pause() {
    this.isStarted = false;
    this.timerEvent.paused = true;
  }

  public resume() {
    if (!this.isStarted) {
      this.startTime = Date.now() - this.timeElapsed;
      this.isStarted = true;
      this.timerEvent.paused = false;
    }
  }

  public reset(newTotalTime?: number) {
    this.isStarted = false;
    this.timerEvent.paused = true;
    this.timeElapsed = 0;

    if (newTotalTime) {
      this.totalTime = newTotalTime * 1000;
    }

    this.setFormattedTime(this.totalTime);
  }

  public end() {
    this.timerEvent.paused = true;
    this.isStarted = false;
    this.setText(Countdown.defaultText);
    this.onTimeUp();
  }

  private updateTimer() {
    if (!this.isStarted) return;

    this.timeElapsed = Date.now() - this.startTime;

    let timeRemaining = this.totalTime - this.timeElapsed;
    if (timeRemaining <= 0) {
      timeRemaining = 0;
      this.end();
    }

    this.setFormattedTime(timeRemaining);
    this.scene.events.emit(Countdown.Tick, this.getTimeLeft());
  }

  private setFormattedTime(time: number) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    this.setText(`${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  }
}

export { Countdown, type CountdownConfig };
