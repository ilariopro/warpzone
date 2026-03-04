import Phaser from 'phaser';

interface PaginatedTextConfig {
  closeCursor?: boolean;
  style: Phaser.Types.GameObjects.Text.TextStyle;
  text: string | string[];
  height: number;
  width: number;
  x: number;
  y?: number;
  onComplete?: () => void;
}

class PaginatedText extends Phaser.GameObjects.Container {
  private currentPage = 0;
  private fullText: string | string[];
  private hitArea: Phaser.GameObjects.Rectangle;
  private closeCursor?: Phaser.GameObjects.Text;
  private nextPageCursor: Phaser.GameObjects.Text;
  private isTyping = false;
  private pages: string[] = [];
  private text: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;

  public constructor(scene: Phaser.Scene, config: PaginatedTextConfig) {
    const { x = 0, y = x, width, height, text, style, onComplete } = config;

    super(scene, x, y);
    this.scene.add.existing(this);

    this.width = width;
    this.height = height;
    this.fullText = text;
    this.text = this.scene.add.text(0, 0, '', style).setWordWrapWidth(this.width);
    this.visible = false;

    this.hitArea = this.scene.add
      .rectangle(0, 0, this.width, this.height, 0xffffff, 0)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.isTyping) {
          this.show();
        } else if (this.hasNextPage()) {
          this.nextPage();
        } else {
          onComplete?.();
        }
      });

    this.nextPageCursor = this.scene.add.text(0, 0, '→', style).setOrigin(0.5).setVisible(false);

    this.add([this.text, this.hitArea, this.nextPageCursor]);

    if (config.closeCursor) {
      this.closeCursor = this.scene.add.text(0, 0, '✓', style).setOrigin(0.5).setVisible(false);
      this.add(this.closeCursor);
    }
  }

  /**
   * Run the text with typewriter animation.
   *
   * @param speed The animation speed.
   */
  public animate(speed = 50) {
    this.setVisible(true);
    this.paginate(Array.isArray(this.fullText) ? this.fullText.join('\n') : this.fullText);
    this.updateNextPageCursor(); // show the arrow if there is a next page

    if (this.pages.length > 0) {
      this.typewrite(this.pages[this.currentPage], speed);
    } else {
      console.warn('No pages to display.');
    }
  }

  /**
   * Reset to the initial state.
   */
  public reset() {
    this.clearTimerEvent();
    this.text.setText('');
    this.currentPage = 0;
    this.isTyping = false;
    this.pages = [];
    this.visible = false;
  }

  /**
   * Show full page text immediately.
   */
  public show() {
    this.clearTimerEvent();
    this.text.setText(this.pages[this.currentPage]);
    this.isTyping = false;
    this.updateNextPageCursor();
  }

  /**
   * Typewrite the given text with a typing effect.
   *
   * @param text The text to typewrite.
   * @param speed The animation speed.
   */
  public typewrite(text: string, speed: number) {
    this.clearTimerEvent();

    const length = text.length;
    let i = 0;

    this.text.setText('');
    this.isTyping = true;

    this.timerEvent = this.scene.time.addEvent({
      callback: () => {
        this.text.text += text[i];
        ++i;

        // If typing is complete, set isTyping to false and show next page cursor
        if (i >= length) {
          this.isTyping = false;
        }
      },
      repeat: length - 1,
      delay: speed,
    });
  }

  /**
   * Paginate the text based on maxLines.
   *
   * @param text The text to paginate.
   */
  private paginate(text: string) {
    this.text.setText('');
    const pages: string[] = [];
    let currentPage: string[] = [];

    // Create a temporary hidden text object to calculate text dimensions
    const testText = new Phaser.GameObjects.Text(this.scene, 0, 0, text, this.text.style);
    testText.setVisible(false).setWordWrapWidth(this.width);
    this.scene.add.existing(testText);

    // Split text into words
    const words = text.split(' ');

    // Iterate over words and build lines respecting maxHeight
    words.forEach((word) => {
      // Add the word to the current line
      const lineWithWord = currentPage.join(' ') + (currentPage.length > 0 ? ' ' : '') + word + '→';
      testText.setText(lineWithWord).setStyle(this.text.style).setLineSpacing(this.text.lineSpacing);

      // Check if adding the word exceeds maxHeight
      if (testText.height > this.height) {
        // If it exceeds maxHeight, add suspension points and make a new page
        pages.push(currentPage.join(' '));

        // Start a new page
        currentPage = [word];
      } else {
        currentPage.push(word);
      }
    });

    // Add the last page
    if (currentPage.length > 0) {
      pages.push(currentPage.join(' '));
    }

    this.pages = pages;
    this.currentPage = 0;
    testText.destroy();
  }

  /**
   * Check if there is a next page.
   */
  private hasNextPage(): boolean {
    return this.currentPage < this.pages.length - 1;
  }

  /**
   * Go to the next page if available.
   */
  private nextPage() {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.typewrite(this.pages[this.currentPage], 50);
      this.updateNextPageCursor();
    }
  }

  /**
   * Clear the existing timer event.
   */
  private clearTimerEvent() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }
  }

  /**
   * Update cursor visibility and position, based on the actual hit area height.
   */
  private updateNextPageCursor() {
    const hasNextPage = this.hasNextPage();
    const x = this.width - 10;
    const y = this.hitArea.height - 15;

    this.closeCursor?.setVisible(!hasNextPage && !this.isTyping);
    this.nextPageCursor.setVisible(hasNextPage);

    this.closeCursor?.setPosition(x, y);
    this.nextPageCursor.setPosition(x, y);
  }
}

export { PaginatedText, type PaginatedTextConfig };
