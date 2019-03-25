console.log("Cell Types File Loaded");


class FarmCell {
    constructor(cellIndex){
        // cellIndex keeps track of where on the grid the farm is. We'll need to know this in order to update the appropriate square
        this.cellIndex = parseInt(cellIndex);
        // This represents the three stages a farm can be in
        this.currentStage = 1;
    }

    updateFarm(){
        console.log(`updating farm on cell ${this.cellIndex}`);
        if(this.currentStage >= 3){
            return
        }
        this.currentStage += 1;
        // if (this.currentStage > 3) {
        //     this.currentStage = 1;
        //     foodTotal +=5
        // }
        // this removes any styles that were already on the cell
        document.getElementById(`${this.cellIndex}`).className = "";
        document.getElementById(`${this.cellIndex}`).className = `grid-box farm-box${this.currentStage}`;
    }

} //end of farm cell

class MineCell {
    constructor(cellIndex){
        // cellIndex keeps track of where on the grid the farm is. We'll need to know this in order to update the appropriate square
        this.cellIndex = parseInt(cellIndex);
        // This represents the three stages a farm can be in
        this.currentStage = 1;
    }

    updateMine(){
        console.log(`updating mine on cell ${this.cellIndex}`);

        this.currentStage += 1;
        if (this.currentStage > 3) {
            this.currentStage = 1;
            stoneTotal +=5
        }

    }


} //end of Mine Class

class LumbermillCell {
    constructor(cellIndex){
        // cellIndex keeps track of where on the grid the farm is. We'll need to know this in order to update the appropriate square
        this.cellIndex = parseInt(cellIndex);
        // This represents the three stages a farm can be in
        this.currentStage = 1;
    }

    updateLumbermill(){
        console.log(`updating lumbermill on cell ${this.cellIndex}`);

        this.currentStage += 1;
        if (this.currentStage > 3) {
            this.currentStage = 1;
            woodTotal +=10
        }

    }

} //end of Lumbermill cell

class Human{
    constructor(cellIndex){
        console.log(`creating human at ${cellIndex}`);
    }
}




