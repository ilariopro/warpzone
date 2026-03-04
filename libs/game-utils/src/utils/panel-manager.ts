import { BasePanel } from './base-panel';

class PanelManager {
  private panels: Map<string, BasePanel> = new Map();

  private currentPanel: BasePanel | null = null;
  private currentPanelKey: string | null = null;

  private lastPanel: BasePanel | null = null;
  private lastPanelKey: string | null = null;

  public getCurrentKey() {
    return this.currentPanelKey;
  }

  public getCurrentPanel() {
    return this.currentPanel;
  }

  public getLastKey() {
    return this.lastPanelKey;
  }

  public getLastPanel() {
    return this.lastPanel;
  }

  public getPanel(key: string) {
    if (!this.panels.has(key)) {
      console.warn(`The panel "${key}" does not exist.`);
      return;
    }

    return this.panels.get(key);
  }

  public hasPanel(key: string) {
    return this.panels.has(key);
  }

  public isTweening() {
    if (!this.currentPanel) return false;
    return this.currentPanel.isTweening();
  }

  public setPanel(key: string, panel: BasePanel) {
    if (this.panels.has(key)) {
      console.warn(`The panel "${key}" already exists.`);
      return;
    }

    this.panels.set(key, panel);
  }

  public deletePanel(key: string) {
    if (this.currentPanelKey === key) {
      this.closePanel();
    }

    this.panels.delete(key);
  }

  public openPanel(key: string) {
    if (this.isTweening()) return;

    const panel = this.getPanel(key);

    if (panel) {
      if (this.currentPanel && this.currentPanel == panel) return;

      this.currentPanel?.close();
      panel.open();
      this.currentPanel = panel;
      this.currentPanelKey = key;
    }
  }

  public closePanel() {
    if (this.isTweening()) return;

    this.lastPanel = this.currentPanel;
    this.lastPanelKey = this.currentPanelKey;

    this.currentPanel?.close();
    this.currentPanel = null;
    this.currentPanelKey = null;
  }

  public reset() {
    this.closePanel();

    this.lastPanel = null;
    this.lastPanelKey = null;
  }
}

export { PanelManager };
