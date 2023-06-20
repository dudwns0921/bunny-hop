import phaser from '../lib/phaser.js';

class Carrot extends phaser.GameObjects.Sprite {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture
   */
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(0.5);
  }
}

export default Carrot;
