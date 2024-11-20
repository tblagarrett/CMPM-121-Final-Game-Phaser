class Grid extends Phaser.GameObjects.Container {
    constructor(scene, width, height) {
        super(scene, width, height, cellSize);

        this.chanceToGen = 0.10;

        this.cells = [];
    
        for(let i = 0; i < width; i ++) {
            let row = [];
            for(let j = 0; j < height; j ++) {
                row.push(new Cell(scene, i, j));
            }
            this.cells.push(row);
        }
    }

    timeStep() {
        for(let i = 0; i < this.width; i ++) {
            for(let j = 0; j < this.height; j ++) {
                let random = Math.random();
                let cell = this.cells[i][j];
                if(random < this.chanceToGen / 2) {
                    cell.addSun();
                } else if (random < this.chanceToGen) {
                    cell.addWater(Math.random(Range(1,5)));
                }

                // check parameters for plants
            }
        }
    }

    

    getCell(x,y) {
        return this.cells[y][x];
    }

}