class Grid extends Phaser.GameObjects.Container {
    constructor(scene, width, height) {
        super(scene, width, height, cellSize);

        this.cells = [];
        for(let i = 0; i < width; i += cellSize) {
            let row = [];
            for(let j = 0; j < height; j += cellSize) {
                row.push(new Cell(scene, i, j));
            }
            this.cells.push(row);
        }
    }
}