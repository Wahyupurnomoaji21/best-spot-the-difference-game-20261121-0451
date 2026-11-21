/** Input mouse + keyboard: klik pada panel, bidikan panah, Enter/Spasi, H, R, M. */
import { PANEL_W, PANEL_H, CURSOR_STEP, CURSOR_STEP_FAST } from './config.js';

export class InputController {
  constructor({ stage, canvasLeft, canvasRight, cursorEl, onPick, onAction }) {
    this.stage = stage;
    this.canvasLeft = canvasLeft;
    this.canvasRight = canvasRight;
    this.cursorEl = cursorEl;
    this.onPick = onPick;
    this.onAction = onAction;
    this.cursor = { x: PANEL_W / 2, y: PANEL_H / 2, panel: 'left' };
    this.active = false;
    this.bind();
  }

  bind() {
    for (const [canvas, panel] of [[this.canvasLeft, 'left'], [this.canvasRight, 'right']]) {
      canvas.addEventListener('pointerdown', (ev) => {
        if (!this.active) return;
        const pos = this.eventToScene(ev, canvas);
        if (pos) this.onPick(pos.x, pos.y, panel);
      });
      canvas.addEventListener('pointermove', (ev) => {
        const pos = this.eventToStage(ev);
        if (pos) this.moveCursorTo(pos.x, pos.y);
      });
    }
    window.addEventListener('keydown', (ev) => this.handleKey(ev));
  }

  setActive(active) {
    this.active = active;
    this.cursorEl.hidden = !active;
    if (active) this.showCursor();
  }

  eventToScene(ev, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * PANEL_W;
    const y = ((ev.clientY - rect.top) / rect.height) * PANEL_H;
    if (x < 0 || y < 0 || x > PANEL_W || y > PANEL_H) return null;
    return { x, y };
  }

  eventToStage(ev) {
    const rect = this.stage.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  }

  panelRect(panel) {
    const canvas = panel === 'left' ? this.canvasLeft : this.canvasRight;
    const stageRect = this.stage.getBoundingClientRect();
    const r = canvas.getBoundingClientRect();
    return { left: r.left - stageRect.left, top: r.top - stageRect.top, width: r.width, height: r.height };
  }

  moveCursorTo(stageX, stageY) {
    const left = this.panelRect('left');
    const right = this.panelRect('right');
    const inLeft = stageX >= left.left && stageX <= left.left + left.width && stageY >= left.top && stageY <= left.top + left.height;
    const inRight = stageX >= right.left && stageX <= right.left + right.width && stageY >= right.top && stageY <= right.top + right.height;
    if (!inLeft && !inRight) return;
    const rect = inLeft ? left : right;
    this.cursor.panel = inLeft ? 'left' : 'right';
    this.cursor.x = ((stageX - rect.left) / rect.width) * PANEL_W;
    this.cursor.y = ((stageY - rect.top) / rect.height) * PANEL_H;
    this.showCursor();
  }

  showCursor() {
    const rect = this.panelRect(this.cursor.panel);
    const stageX = rect.left + (this.cursor.x / PANEL_W) * rect.width;
    const stageY = rect.top + (this.cursor.y / PANEL_H) * rect.height;
    this.cursorEl.style.left = `${stageX}px`;
    this.cursorEl.style.top = `${stageY}px`;
    this.cursorEl.hidden = !this.active;
  }

  handleKey(ev) {
    if (!this.active) {
      if (ev.key === 'Enter' || ev.key === ' ') this.onAction('confirm');
      return;
    }
    const step = ev.shiftKey ? CURSOR_STEP_FAST : CURSOR_STEP;
    let moved = false;
    if (ev.key === 'ArrowLeft') { this.cursor.x = Math.max(0, this.cursor.x - step); moved = true; }
    else if (ev.key === 'ArrowRight') { this.cursor.x = Math.min(PANEL_W, this.cursor.x + step); moved = true; }
    else if (ev.key === 'ArrowUp') { this.cursor.y = Math.max(0, this.cursor.y - step); moved = true; }
    else if (ev.key === 'ArrowDown') { this.cursor.y = Math.min(PANEL_H, this.cursor.y + step); moved = true; }
    else if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.onPick(this.cursor.x, this.cursor.y, this.cursor.panel);
      return;
    } else if (ev.key === 'h' || ev.key === 'H') { this.onAction('hint'); return; }
    else if (ev.key === 'r' || ev.key === 'R') { this.onAction('restart'); return; }
    else if (ev.key === 'm' || ev.key === 'M') { this.onAction('mute'); return; }
    if (moved) {
      ev.preventDefault();
      this.showCursor();
    }
  }
}
