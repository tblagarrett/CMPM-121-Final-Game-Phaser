class Cell extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.plant = null;
        this.waterStored = 0;
    }

    sow(plant) {
        this.plant = plant;
    }

    reap() {
        plant = this.plant;
        this.plant = null;
        return plant;
    }

    canSow() {
        if (this.plant != null) {
            return true;
        }
        return false;
    }

    canReap() {
        return this.plant.isMaxLevel();
    }

    addWater(amount) {
        this.waterStored += amount;

        if(this.waterStored > 0) {
            if(this.plant.needsWater(amount)) {
            this.plant.addWater(1);
            this.waterStored--;
            }
        }
    }
    
    addSun() {
        if(this.plant.needsSun()) {
            this.plant.addSun();
        }
    }

    addStoredWater() {
        if()
    }
}