class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, framesHold = 5, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale);
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, width, height, movementSpeed, jumpVelocity, hurtBoxColor = '#f7ff0069', imageSrc, scale = 1, framesMax = 1, attackBox = { offset: { x: 0, y: 0 }, width: undefined, height: undefined }, offset = { x: 0, y: 0 }, sprites }, showHitBox = false, showHurtBox = false) {
        super({ position, imageSrc, scale, framesMax, offset });
        this.velocity = velocity;
        this.height = height;
        this.width = width;
        this.lastKey;
        this.movementSpeed = movementSpeed;
        this.jumpVelocity = jumpVelocity;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            attackOffset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
            color: '#34fb34aa'
        };
        this.hurtBoxColor = hurtBoxColor;
        this.isAttacking;
        this.health = 100;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.currentSprite;
        this.isDead = false;
        this.showHitBox = showHitBox;
        this.showHurtBox = showHurtBox;

        //Adding & Initialzing image object for sprites
        for (const sprite in sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (!this.isDead) this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.attackOffset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.attackOffset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;


        if ((this.position.y + this.height + this.velocity.y) >= canvas.height - 95) {
            this.velocity.y = 0;
            this.position.y = (canvas.height - 95) - this.height;
        } else {
            this.velocity.y += gravity;
        }

    }

    animateFrames() {
        super.animateFrames();
        if (this.showHurtBox) {
            c.fillStyle = this.hurtBoxColor;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        if (this.showHitBox) {
            if (this.image === this.sprites.attack1.image && this.frameCurrent >= this.currentSprite.activeStart && this.frameCurrent <= this.currentSprite.activeEnd) {
                c.fillStyle = this.attackBox.color;
                c.fillRect(
                    this.attackBox.position.x,
                    this.attackBox.position.y,
                    this.attackBox.width,
                    this.attackBox.height
                );
            }
        }
    }

    attack() {
        this.isAttacking = true;
        this.switchSprite('attack1');
    }

    takeHit() {
        this.health -= 20;
        if (this.health > 0) {
            this.switchSprite('takeHit');
        } else {
            this.switchSprite('death');
        }
    }

    switchSprite(sprite) {
        //overrindg all other animatinos if dead
        if (this.image === this.sprites.death.image) {
            if (this.frameCurrent === this.sprites.death.framesMax - 1) {
                this.isDead = true;
            }
            return;
        }

        //overriding all other animations with attack
        if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax - 1) return;

        //overriding all other animatinos with take hit
        if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1) return;


        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.#setImage(this.sprites.idle);
                    this.currentSprite = this.sprites.idle;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.#setImage(this.sprites.run);
                    this.currentSprite = this.sprites.run;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.#setImage(this.sprites.jump);
                    this.currentSprite = this.sprites.jump;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.#setImage(this.sprites.fall);
                    this.currentSprite = this.sprites.fall;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.#setImage(this.sprites.attack1);
                    this.currentSprite = this.sprites.attack1;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.#setImage(this.sprites.takeHit);
                    this.currentSprite = this.sprites.takeHit;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.#setImage(this.sprites.death);
                    this.currentSprite = this.sprites.death;
                }
                break;

        }
    }

    #setImage(sprite) {
        this.image = sprite.image;
        this.framesMax = sprite.framesMax;
        this.frameCurrent = 0;
        this.framesHold = sprite.framesHold;
    }
}