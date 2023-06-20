import Carrot from '../game/Carrot.js';
import Phaser from '../lib/phaser.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
    /** @type {Phaser.Physics.Arcade.Sprite} */
    this.player = null;

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    this.platforms = null;

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    this.cursors = null;
  }

  preload() {
    // 배경 이미지 로드
    this.load.image('background', 'assets/bg_layer1.png');
    // 바닥 이미지 로드
    this.load.image('platform', 'assets/ground_grass.png');
    // 플레이어 이미지 로드
    this.load.image('bunny-stand', 'assets/bunny1_stand.png');
    // 당근 이미지 로드
    this.load.image('carrot', 'assets/carrot.png');
    // 키보드 입력에 따른 상호작용 설정하기 위한 사전 작업
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // 로드한 배경 이미지로 배경 생성
    this.add.image(240, 320, 'background').setScrollFactor(1, 0);
    this.platforms = this.physics.add.staticGroup();

    // 바닥 물체 여러 개 랜덤 위치에 생성
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = this.platforms.create(x, y, 'platform');
      platform.scale = 0.5;

      const body = platform.body;
      body.updateFromGameObject();
    }

    // 플레이어 생성 후 크기 반으로 줄이기
    this.player = this.physics.add
      .sprite(240, 320, 'bunny-stand')
      .setScale(0.5);

    // 바닥 물체와 플레이어가 충돌하도록 설정
    this.physics.add.collider(this.platforms, this.player);

    // 플레이어와 바닥 물체의 위, 왼쪽, 오른쪽 모두 충돌하지 않도록 설정
    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    // 카메라가 플레이어 따라가도록 설정
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    // 당근 생성
    const carrot = new Carrot(this, 240, 320, 'carrot');
    this.add.existing(carrot);
  }

  update() {
    this.platforms.children.iterate((child) => {
      /**
       * @type {Phaser.Physics.Arcade.Sprite}
       */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
      }
    });

    // 플레이어가 물체와 닿을 때 높이 변경, 점프하는 효과
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocity(-300);
    }

    // 왼쪽 키 누르면 -200만큼 이동
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
      // 오른쪽 키 누르면 200만큼 이동
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
      // 그외는 멈추기
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
}
