import React from 'react';

const MAX_HEALTH = 30;

export class GameStateHandler {
  public health: number | null;
  public healthBarDivRef: React.RefObject<HTMLDivElement | null>;
  private lastCollisionTime: number;
  private collisionCooldown: number;

  constructor() {
    this.health = MAX_HEALTH;
    this.healthBarDivRef = React.createRef<HTMLDivElement>();
    this.lastCollisionTime = 0;
    this.collisionCooldown = 1000; // ms, default 1 second
  }

  /**
   * Set the cooldown period (ms) between collisions.
   */
  setCollisionCooldown(ms: number) {
    this.collisionCooldown = ms;
  }

  /**
   * Returns true if the player can take collision damage now.
   */
  canCollide(): boolean {
    const now = Date.now();
    return now - this.lastCollisionTime >= this.collisionCooldown;
  }

  /**
   * Call this when a collision occurs.
   */
  handleCollision(): boolean {
    if (!this.canCollide()) return false;
    this.lastCollisionTime = Date.now();
    return true;
  }

  reduceHealth(amount: number) {
    if (this.health !== null) {
      this.health = Math.max(0, this.health - amount);
      if (this.healthBarDivRef.current) {
        this.healthBarDivRef.current.style.width = `${(this.health / MAX_HEALTH) * 100}%`;
      }

      if (this.health === 0) {
        // TODO: handle game over
        console.log('game over');
      }
    }
  }
}
