/*class Jellybean extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "spriteAtlas", "redBean");
        this.skin = this.chooseSkin();
        this.setFrame(this.skin);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCircle(24);
        this.sceneRef = scene;
    }

    chooseSkin() {
        let newSkin = "";
        switch(Phaser.Math.Between(0, 5)) {
            case 0:
                newSkin = "pinkBean";
                break;
            case 1:
                newSkin = "tealBean";
                break;
            case 2:
            case 3:
                newSkin = "redBean";
                break;
            case 4:
            case 5:
                newSkin = "blueBean";
                break;
        }
        return newSkin;
    }

    score() {
        
    }

    
}*/

class Transition extends Phaser.Scene{
    constructor() {
        super("transition");
    }

    init(data) {
        this.score = data.score;
        this.fullScore = data.fullScore;
        this.nextSceneKey = data.nextSceneKey;
    }

    preload() {
        this.load.bitmapFont('pixelFont', 'assets/minogram_6x10.png', 'assets/minogram_6x10.xml');
        this.load.atlas("spriteAtlas", "assets/howIsThisTheFourthTimeIveHadToRedoMySpritesheet.png", "assets/spriteAtlas.json");
    }

    create() {
        this.target = null;
        this.text = `${this.score}/${this.fullScore}
`;
        if (this.score / this.fullScore >= 1) {
            this.target = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "spriteAtlas", "plant");
            this.text += "Good job!"
        }
        else if (this.score / this.fullScore > 0.66) {
            this.target = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "spriteAtlas", "bud");
            this.text += "You're getting there!";
        }
        else {
            this.target = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "spriteAtlas", "sprout");
            this.text += "Nice try!";
        }
        this.display = this.add.bitmapText(this.game.config.width * 0.5, this.game.config.height * 0.5 + 128, "pixelFont", this.text, 40, 1);
        this.display.setX(this.game.config.width * 0.5 - (this.display.width / 2)).setAlpha(0);
        this.bucket = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "spriteAtlas", "yellowBucket");
        this.tweens.chain({
            targets: this.target,
            tweens: [
                {
                    targets: this.target,
                    y: {from: this.target.y, to: this.target.y - 64},
                    onComplete: () => {
                        this.display.setAlpha(1);
                        this.time.delayedCall(3000, () => {
                            this.cameras.main.fade(1000, 0, 0, 0);
                            this.time.delayedCall(1000, () => {
                            this.scene.start(this.nextSceneKey);
                            });
                        });
                    }
                }
            ]
        });
    }
}

class End extends Phaser.Scene {
    constructor() {
        super("end");
    }

    preload() {
        this.load.bitmapFont('pixelFont', 'assets/minogram_6x10.png', 'assets/minogram_6x10.xml');
    }

    create() {
        this.add.bitmapText(this.game.config.width / 4, this.game.config.height / 3, "pixelFont", 
`Thanks for playing! Truth be told, I've been having a very difficult year. There's been much crying, much worrying, and I've lost so much weight (and hair!) from how hard I've been working, and how sick I've gotten. I've been so lucky to be supported by my friends, my family, and my professors (if you're Professor Smith for CMPM 120, hello!). I'm just happy to have finished this. Thanks again to freezyfrost on itch.io for the bitmap font files, they've been a huge help, and thanks again to you. See you soon! <3`, 20, 1).setMaxWidth(this.game.config.width / 2);
    }
}

class Level extends Phaser.Scene {

    constructor(name, beans, mapName, nextLevel) {
        super(name);
        this.name = name;
        this.beans = beans;
        this.fullScore = beans;
        this.mapName = mapName;
        this.nextLevel = nextLevel;
    }

    init() {
        this.halfBlock = 32;
        this.fullBlock = 64;
        this.drop = false;
        this.score = 0;
        this.W = this.game.config.width;
        this.H = this.game.config.height;
    }

    preload() {
        this.load.bitmapFont('pixelFont', 'assets/minogram_6x10.png', 'assets/minogram_6x10.xml');
        this.load.tilemapTiledJSON("tilemap", "assets/tilemap.json");
        this.load.tilemapTiledJSON(this.mapName, "assets/" + this.mapName + ".json");
        this.load.image("background", "assets/4by3_background.png");
        this.load.spritesheet("Sprites", "assets/howIsThisTheFourthTimeIveHadToRedoMySpritesheet.png", {frameWidth: 64, frameHeight: 64});
        this.load.atlas("spriteAtlas", "assets/howIsThisTheFourthTimeIveHadToRedoMySpritesheet.png", "assets/spriteAtlas.json");

    }

    create() {
        this.collide = [];
        this.add.image(this.W * 0.5, this.H * 0.5, "background").setScale(3.2);
        
        this.map1 = this.make.tilemap({key: this.mapName});
        this.tiles = this.map1.addTilesetImage("howIsThisTheFourthTimeIveHadToRedoMySpritesheet", "Sprites", 64, 64);

        this.backArm = this.physics.add.image(this.W * 0.5, 155.2, "spriteAtlas", "backArm");
        this.backArm.body.setAllowGravity(false);

        this.platform = this.physics.add.image(this.W * 0.5, 200, "spriteAtlas", "greenPlatform");
        this.platform.body.setAllowGravity(false);
        this.redBody = this.physics.add.image(this.W * 0.5, 123.2, "spriteAtlas", "redGuy");
        this.redBody.body.setAllowGravity(false);

        this.bean = this.physics.add.sprite(this.W * 0.5 + (8 * 3.2), 128 + 6.6, "spriteAtlas", "redBean").setBodySize(12 * 3.2, 10 * 3.2);
        this.bean.body.setAllowGravity(false);
        this.beanSkin = this.chooseSkin();
        this.bean.setFrame(this.beanSkin);

        this.frontArm = this.physics.add.image(this.W * 0.5, 155.2, "spriteAtlas", "activeFrontArm");
        this.frontArm.body.setAllowGravity(false);

        this.redGuy = [this.frontArm, this.redBody, this.backArm];

        this.layer1 = this.map1.createLayer("Tile Layer 1", this.tiles, 0, 0);
        this.collide.push(this.layer1.setCollisionFromCollisionGroup());

        this.scoreDisplay = this.add.bitmapText(15, 15, "pixelFont", this.score, 60, 1).setTint(0x000000).setTintMode(Phaser.TintModes.FILL);
        this.controls = this.add.bitmapText(15, 580, "pixelFont", 
            `Left = left 
arrow
Right = right
arrow
Drop = SPACE`, 30, 0).setTint(0x000000).setTintMode(Phaser.TintModes.FILL);

        this.beansLeftText = this.add.bitmapText(this.game.config.width - 15, 15, "pixelFont", `${this.beans} beans left`, 60, 0);
        this.beansLeftText.setX(this.game.config.width - (this.beansLeftText.width) - 15);
        

        /*this.redBucket = this.physics.add.sprite(352, 672, "spriteAtlas", "largeRedBucket");
        this.blueBucket = this.physics.add.sprite(672, 672, "spriteAtlas", "largeBlueBucket");
        this.blueBucket.setBodySize(160, 12.8);
        this.blueBucket.body.setOffset(16, 51.2);
        this.redBucket.setBodySize(160, 12.8);
        this.redBucket.body.setOffset(16, 51.2);*/

        /*this.redBucket = this.add.image(5 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "largeRedBucket");

        collide.push(this.physics.add.body(4 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        collide.push(this.physics.add.body(7 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.redScore = this.physics.add.body(4 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 160, 8).setAllowGravity(false).setImmovable(true); //win zone


        
        this.blueBucket = this.add.image(10 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "largeBlueBucket");

        collide.push(this.physics.add.body(9 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        collide.push(this.physics.add.body(12 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.blueScore = this.physics.add.body(9 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 160, 8).setAllowGravity(false).setImmovable(true); //win zone
        */
        this.addBuckets();
        this.scoreAdd = this.add.bitmapText(this.redBucket.x, 10 * this.fullBlock, "pixelFont", ``, 60, 1).setBelow(this.layer1);
        this.extraCreate();

        this.physics.add.overlap(this.redScore, this.bean, () => {
            let addition = 0;
            switch (this.beanSkin) {
                case "pinkBean":
                    addition = 2;
                    break;
                case "redBean":
                    addition = 1;
                    break;
                case "blueBean":
                    addition = -1;
                    break;
            }

            this.score += addition;

            this.beanSkin = this.chooseSkin();
            this.bean.setFrame(this.beanSkin);
            this.scoreTween(addition, this.redBucket);
            if (this.beans > 0) {
                this.frontArm.setFrame("activeFrontArm");
                this.backArm.setAlpha(1);
                this.drop = false;
                this.bean.body.setVelocityY(0);
                this.bean.body.setAllowGravity(false);
                this.bean.setPosition(this.platform.x + 8 * 3.2, 128 + 6.6);
            }
        });

        this.physics.add.overlap(this.blueScore, this.bean, () => {
            let addition = 0;
            switch (this.beanSkin) {
                case "tealBean":
                    addition = 2;
                    break;
                case "blueBean":
                    addition = 1;
                    break;
                case "redBean":
                    addition = -1;
                    break;
            }

            this.score += addition;

            this.beanSkin = this.chooseSkin();
            this.bean.setFrame(this.beanSkin);
            this.scoreTween(addition, this.blueBucket);
            if (this.beans > 0) {
                this.frontArm.setFrame("activeFrontArm");
                this.backArm.setAlpha(1);
                this.drop = false;
                this.bean.body.setVelocityY(0);
                this.bean.body.setAllowGravity(false);
                this.bean.setPosition(this.platform.x + 8 * 3.2, 128 + 6.6);
            }
            else {
                this.bean.setPosition(-100, -100);
            }
        });

        this.tweenstarted = false;
        
        this.physics.add.collider(this.bean, this.collide, () => {
            if (this.tweenstarted == false) { 
                this.tweenstarted = true;
                if (this.bean.body.onFloor()) {
                    this.tweens.add({
                        targets: this.bean,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            this.beans -= 1;
                            this.beansLeftText.setText(`${this.beans} beans left`).setX(this.game.config.width - (this.beansLeftText.width) - 15);
                            if (this.beans > 0) {
                                this.beanSkin = this.chooseSkin();
                                this.bean.setFrame(this.beanSkin);
                                this.frontArm.setFrame("activeFrontArm");
                                this.backArm.setAlpha(1);
                                this.bean.setPosition(this.platform.x + 8 * 3.2, 128 + 6.6);
                                this.drop = false;
                                this.bean.body.setVelocityY(0);
                                this.bean.body.setAllowGravity(false);
                                this.bean.setAlpha(1);
                                this.tweenstarted = false;
                            }
                            else {
                                this.cameras.main.fade(1000, 0, 0, 0);
                                this.time.delayedCall(1000, () => {
                                    this.scene.start("transition", {
                                        score: this.score,
                                        fullScore: this.fullScore,
                                        nextSceneKey: this.nextLevel
                                    });
                                });
                            }
                        }
                    });
                }
            }
        });
        

        // this.debugGraphics = this.add.graphics();
        // this.tilePhysicsObjects = this.drawTileCollisions(this.debugGraphics);
        
        // this.drawCollisions(this.debugGraphics);

        this.controls = this.input.keyboard.addKeys(
            { 
                'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 
                'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
                'down': Phaser.Input.Keyboard.KeyCodes.SPACE
            },
        );

        console.log(this.controls);
        this.controls.left.on("down", () => {
            this.platform.setVelocityX(-200);
            this.redGuy.forEach((part) => {
                part.setVelocityX(-200);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(-200);
            }
        });

        this.controls.left.on("up", () => {
            this.platform.setVelocityX(0);
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0);
            }
        });

        this.controls.right.on("down", () => {
            this.platform.setVelocityX(200);
            this.redGuy.forEach((part) => {
                part.setVelocityX(200);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(200);
            }
        });

        this.controls.right.on("up", () => {
            this.platform.setVelocityX(0);
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0);
            }
        });

        this.controls.down.on("down", () => {
            this.drop = true;
            this.backArm.setAlpha(0);
            this.frontArm.setFrame("idleFrontArm");
            this.bean.body.setVelocityX(0);
            this.bean.body.setAllowGravity();
        });

        this.physics.world.setBoundsCollision();
        this.platform.setCollideWorldBounds();

        this.physics.add.collider(this.platform, this.collide, () => {
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
                part.setPosition(this.platform.x, part.y);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0).setPosition(this.platform.x + 8 * 3.2, this.bean.y);
            }
        });
        

        //let bean = new Jellybean(this, 200, 200);

        

        
        
        /*this.debugGraphics = this.add.graphics();
        this.drawDebug();
        this.bean = this.physics.add.sprite(this.sw * 180, this.sh*100, "spritesAtlas", "blueBean")
            .setScale(3.2)
            .setBodySize(12, 10);*/


        //this.physics.add.collider(this.tilePhysicsObjects, this.bean);
        //console.log(this.tilePhysicsObjects);
        //this.debugGraphics.setVisible(false);

        //let bean = this.physics.add.sprite(200, 200, "spritesAtlas", "frontArm").setScale(6);
        //this.layer1.setCollisionByProperty({collides: true});

        /*this.drawDebug();
        this.input.on('pointerdown', () => {
            this.debugGraphics.visible = !this.debugGraphics.visible;
            if (this.debugGraphics.visible) {
                this.drawDebug();
            }
        });

        this.input.keyboard.on("keydown-B", event => {
            
        })*/

        //this.physics.add.staticImage(this.sw * 90, this.sh * 180, "spritesAtlas", "bottomWall").setScale(6);
        /*this.layer = this.add.layer();
        this.makeWall(100, 6);
        this.makeWall(220, 6);
        this.leftPaddle = this.physics.add.sprite(this.sw * 104, this.sh * 120, "spritesAtlas", "leftPaddle")
            .setScale(6)
            .setOrigin(0, 0.5)
            .setBodySize(48, 6)
            .setRotation(0.2)
            .setImmovable();
        this.rightPaddle = this.physics.add.sprite(this.sw* 216, this.sh * 120, "spritesAtlas", "rightPaddle")
            .setScale(6)
            .setOrigin(1, 0.5)
            .setBodySize(48, 6)
            .setRotation(-0.2)
            .setImmovable();
        this.bean = this.physics.add.sprite(this.sw * 150, this.sh * 90, "spritesAtlas", "pinkBean")
            .setScale(6)
            .setBodySize(12, 10)
            .setGravityY(9);*/
        /*this.leftPaddle.setBodySize(48, 6);
        this.rightPaddle.setBodySize(48, 6);
        this.leftPaddle.setOrigin(0, 0.5);
        this.rightPaddle.setOrigin(1, 0.5);
        this.leftPaddle.setRotation(0.2);
        this.rightPaddle.setRotation(-0.2);*/
        // between 0.2 and -0.5
        //this.layer.addAt(this.leftPaddle, 0);
        /*this.physics.add.collider(this.bean, this.leftPaddle);
        this.layer.addAt(this.rightPaddle, 0);

        this.leftBump = this.input.keyboard.addKey("A");
        this.rightBump = this.input.keyboard.addKey("D");*/
    }

    addBuckets() {
        this.redBucket = this.add.image(5 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "largeRedBucket");

        this.collide.push(this.physics.add.body(4 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        this.collide.push(this.physics.add.body(7 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.redScore = this.physics.add.body(4 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 160, 8).setAllowGravity(false).setImmovable(true); //win zone


        
        this.blueBucket = this.add.image(10 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "largeBlueBucket");

        this.collide.push(this.physics.add.body(9 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        this.collide.push(this.physics.add.body(12 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.blueScore = this.physics.add.body(9 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 160, 8).setAllowGravity(false).setImmovable(true); //win zone
    }

    extraCreate() {
        console.log("replace this");
    }

    scoreTween(add, bucket) {
        let str = "";
        if (add >= 0) {
            str += "+"
        }
        str += add;

        this.scoreAdd.setText(str).setX(bucket.x - (this.scoreAdd.width / 2));
        this.scoreDisplay.setText(this.score);
        this.beans -= 1;
        this.beansLeftText.setText(`${this.beans} beans left`).setX(this.game.config.width - (this.beansLeftText.width) - 15);
        if (this.beans == 0) {
            this.bean.disableBody();
        }

        this.tweens.chain(
            {   targets: this.scoreAdd,
                tweens: [
                    {
                        y: {from : 10 * this.fullBlock, to: 9 * this.fullBlock},
                        alpha: {from: 0, to: 1},
                        ease: "Cubic.easeOut"
                    },
                    {
                        alpha: {from: 1, to: 0},
                        ease: "Cubic.easeIn",
                        onComplete: () => {
                            if (this.beans == 0) {
                                this.cameras.main.fade(1000, 0, 0, 0);
                                this.time.delayedCall(1000, () => {
                                    this.scene.start("transition", {
                                        score: this.score,
                                        fullScore: this.fullScore,
                                        nextSceneKey: this.nextLevel
                                    });
                                });
                            }
                        }
                    }
                ],
            }
        );
    }

    /*makeWall(xPos, height) {
        let yPos = 180;
        let image = "bottomWall";
        this.layer.add(this.physics.add.staticImage(this.sw * xPos, this.sh * yPos, "spritesAtlas", image)
        .setScale(6));
        image = "midWall";
        for (let i = 1; i <= height - 1; ++i) {
            if (i == height - 1) {
                image = "topWall";
            }
            this.layer.add(this.physics.add.staticImage(this.sw * xPos, this.sh * (yPos - (i * 20)), "spritesAtlas", image)
            .setScale(6));
        }
    }*/

    //draws tile collisions and also returns the array of collision objects
    /*drawTileCollisions(graphics) {
        graphics.clear();
        graphics.lineStyle(3, 0xfc00fc, 1);

        this.layer1.forEachTile(tile => {
            const tileX = tile.getLeft();
            const tileY = tile.getTop();
            const collisionStuff = tile.getCollisionGroup();
            

            if (!collisionStuff || collisionStuff.objects.length === 0) {
                return;
            }
            

            const objects = collisionStuff.objects;

            for (let i = 0; i < objects.length; ++i) {
                const object = objects[i];
                const objX = tileX + object.x;
                const objY = tileY + object.y;

                if (object.rectangle) {
                    graphics.strokeRect(objX, objY, object.width, object.height);
                }
            }
        })
    }*/

    chooseSkin() {
        let newSkin = "";
        switch(Phaser.Math.Between(0, 5)) {
            case 0:
                newSkin = "pinkBean";
                break;
            case 1:
                newSkin = "tealBean";
                break;
            case 2:
            case 3:
                newSkin = "redBean";
                break;
            case 4:
            case 5:
                newSkin = "blueBean";
                break;
        }
        return newSkin;
    }

    /*drawCollisions(graphics) {
        const numBodies = this.physics.world.bodies.size;
        const bodies = this.physics.world.bodies.keys();
        for (let i = 0; i < numBodies; ++i) {
            const body = bodies.next().value;
            if (body.collisionCategory == 2) {
                graphics.lineStyle(3, 0xfc00fc, 1);
            }
            else if (body.collisionCategory == 4 || body.collisionCategory == 8) {
                graphics.lineStyle(3, 0x11f904, 1);
            }
            else {

            }
            if (body.isCircle) {
                graphics.strokeCircle(body.x + body.offset.x, body.y + body.offset.y, body.radius);
            }
            else {
                graphics.strokeRect(body.x + body.offset.x, body.y + body.offset.y, body.width, body.height);
            }
        }
        const numStaticBodies = this.physics.world.staticBodies.size;
        const staticBodies = this.physics.world.staticBodies.keys();
        for (let i = 0; i < numStaticBodies; ++i) {
            const body = staticBodies.next().value;
            if (body.collisionCategory == 2) {
                graphics.lineStyle(3, 0xfc00fc, 1);
            }
            if (body.collisionCategory == 4) {
                graphics.lineStyle(3, 0x11f904, 1);
            }
            graphics.strokeRect(body.x + body.offset.x, body.y + body.offset.y, body.width, body.height);
        }

    }

    updateCollisionArrays() {
        const numBodies = this.physics.world.bodies.size;
        const bodies = this.physics.world.bodies.keys();
        for (let i = 0; i < numBodies; ++i) {
            const body = bodies.next().value;
            switch (body.collisionCategory) {
                case 1:
                    this.collision1.push(body);
                    break;
                case 2:
                    this.collision2.push(body);
                    break;
                case 4:
                    this.collision4.push(body);
                    break;
                case 8:
                    this.collision8.push(body);
                    break;
                case 16:
                    this.collision16.push(body);
                    break;
            }
        }
    }*/

    
    
   update() {
        if (this.platform.body.checkWorldBounds()) {
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
                part.setPosition(this.platform.x, part.y);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0).setPosition(this.platform.x + 8 * 3.2, this.bean.y);
            }
        }

        //console.log(this.leftPaddle.body.rotation);
        /*if (this.leftBump.isDown){ 
            if (this.leftPaddle.body.rotation <= -25) {
                this.leftPaddle.body.setAngularVelocity(0);
                this.leftPaddle.setAngle(-25);
            }
            else {
                this.leftPaddle.body.setAngularVelocity(-400);
            }
        }
        else if (this.leftPaddle.body.rotation >= 11.5){
            this.leftPaddle.body.setAngularVelocity(0);
            this.leftPaddle.setAngle(11.5);
        }
        else {
            this.leftPaddle.body.setAngularVelocity(400);
        }

        if (this.rightBump.isDown){ 
            if (this.rightPaddle.body.rotation >= 25) {
                this.rightPaddle.body.setAngularVelocity(0);
                this.rightPaddle.setAngle(25);
            }
            else {
                this.rightPaddle.body.setAngularVelocity(400);
            }
        }
        else if (this.rightPaddle.body.rotation <= -11.5){
            this.rightPaddle.body.setAngularVelocity(0);
            this.rightPaddle.setAngle(-11.5);
        }
        else {
            this.rightPaddle.body.setAngularVelocity(-400);
        }*/

        /*if (this.rightBump.isDown){
            if (this.rightPaddle)
        }*/
        //console.log(this.leftPaddle.body.preRotation);
        //this.leftPaddle.setAngularAcceleration(1);
        //this.leftPaddle.body.setAngularAcceleration(1);
   }


}

class Level1 extends Level{
    constructor() {
        super("level1", 5, "tilemap", "level2")
    }
}

class Level2 extends Level {
    constructor() {
        super("level2", 7, "level2tilemap", "level3");
    }

    addBuckets() {
        this.redBucket = this.add.image(5 * this.fullBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "medRedBucket");

        this.collide.push(this.physics.add.body(4 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        this.collide.push(this.physics.add.body(6 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.redScore = this.physics.add.body(4 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 96, 8).setAllowGravity(false).setImmovable(true); //win zone


        
        this.blueBucket = this.add.image(11 * this.fullBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "medBlueBucket");

        this.collide.push(this.physics.add.body(10 * this.fullBlock, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true)); //sides
        this.collide.push(this.physics.add.body(12 * this.fullBlock - 5 * 3.2, 10 * this.fullBlock, 5 * 3.2, 64).setAllowGravity(false).setImmovable(true));

        this.blueScore = this.physics.add.body(10 * this.fullBlock + 5 * 3.2, 11 * this.fullBlock - 8, 96, 8).setAllowGravity(false).setImmovable(true); //win zone
    }

    extraCreate() {
        this.leftCandyCane1 = this.physics.add.image(this.halfBlock + this.fullBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane1.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.leftCandyCane2 = this.physics.add.image(this.fullBlock * 6 + this.halfBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane2.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.leftCandyCane3 = this.physics.add.image(this.fullBlock * 11 + this.halfBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane3.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.collide.push(this.leftCandyCane1);
        this.collide.push(this.leftCandyCane2);
        this.collide.push(this.leftCandyCane3);
    }

    update() {
        if (this.leftCandyCane1.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane1.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane1.y);
        }
        if (this.leftCandyCane2.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane2.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane2.y);
        }
        if (this.leftCandyCane3.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane3.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane3.y);
        }
        if (this.platform.body.checkWorldBounds()) {
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
                part.setPosition(this.platform.x, part.y);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0).setPosition(this.platform.x + 8 * 3.2, this.bean.y);
            }
        }
    }
}

class Level3 extends Level{
    constructor() {
        super("level3", 9, "level3tilemap", "end");
    }

    addBuckets() {
        this.redBucket = this.add.image(4 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "smallRedBucket");
        this.redScore = this.physics.add.body(4 * this.fullBlock, 10 * this.fullBlock + 56, 64, 8).setAllowGravity(false).setImmovable();

        this.blueBucket = this.add.image(11 * this.fullBlock + this.halfBlock, 10 * this.fullBlock + this.halfBlock, "spriteAtlas", "smallBlueBucket");
        this.blueScore = this.physics.add.body(11 * this.fullBlock, 10 * this.fullBlock + 56, 64, 8).setAllowGravity(false).setImmovable();
    }

    extraCreate() {
        this.leftCandyCane1 = this.physics.add.image(this.halfBlock + this.fullBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane1.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.leftCandyCane2 = this.physics.add.image(this.fullBlock * 6 + this.halfBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane2.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.leftCandyCane3 = this.physics.add.image(this.fullBlock * 11 + this.halfBlock, this.fullBlock * 6 + this.halfBlock, "spriteAtlas", "leftCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.leftCandyCane3.body.setAllowGravity(false).setImmovable().setVelocityX(120);
        this.collide.push(this.leftCandyCane1);
        this.collide.push(this.leftCandyCane2);
        this.collide.push(this.leftCandyCane3);

        this.rightCandyCane1 = this.physics.add.image(this.halfBlock + this.fullBlock, this.fullBlock * 7 + this.halfBlock, "spriteAtlas", "rightCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.rightCandyCane1.body.setAllowGravity(false).setImmovable().setVelocityX(-120);
        this.rightCandyCane2 = this.physics.add.image(this.fullBlock * 6 + this.halfBlock, this.fullBlock * 7 + this.halfBlock, "spriteAtlas", "rightCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.rightCandyCane2.body.setAllowGravity(false).setImmovable().setVelocityX(-120);
        this.rightCandyCane3 = this.physics.add.image(this.fullBlock * 11 + this.halfBlock, this.fullBlock * 7 + this.halfBlock, "spriteAtlas", "rightCandyCane").setBodySize(192, 6 * 3.2).setBelow(this.layer1);
        this.rightCandyCane3.body.setAllowGravity(false).setImmovable().setVelocityX(-120);
        this.collide.push(this.rightCandyCane1);
        this.collide.push(this.rightCandyCane2);
        this.collide.push(this.rightCandyCane3);

        this.scoreAdd = this.add.bitmapText(this.redBucket.x, 10 * this.fullBlock, "pixelFont", ``, 40, 1).setBelow(this.layer1);
    }

    update() {
        if (this.leftCandyCane1.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane1.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane1.y);
        }
        if (this.leftCandyCane2.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane2.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane2.y);
        }
        if (this.leftCandyCane3.x > this.fullBlock * 16 + this.halfBlock) {
            this.leftCandyCane3.setPosition(this.fullBlock + this.halfBlock, this.leftCandyCane3.y);
        }

        if (this.rightCandyCane1.x < this.fullBlock + this.halfBlock) {
            this.rightCandyCane1.setPosition(this.fullBlock * 16 + this.halfBlock, this.rightCandyCane1.y);
        }
        if (this.rightCandyCane2.x < this.fullBlock + this.halfBlock) {
            this.rightCandyCane2.setPosition(this.fullBlock * 16 + this.halfBlock, this.rightCandyCane2.y);
        }
        if (this.rightCandyCane3.x < this.fullBlock + this.halfBlock) {
            this.rightCandyCane3.setPosition(this.fullBlock * 16 + this.halfBlock, this.rightCandyCane3.y);
        }
        

        if (this.platform.body.checkWorldBounds()) {
            this.redGuy.forEach((part) => {
                part.setVelocityX(0);
                part.setPosition(this.platform.x, part.y);
            });
            if (this.drop != true) {
                this.bean.setVelocityX(0).setPosition(this.platform.x + 8 * 3.2, this.bean.y);
            }
        }
    }
}