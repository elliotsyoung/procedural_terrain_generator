let game_options = {
  game_board_total: 25398,
  ocean_total: 200,
  mountain_total: 300,
  forest_total: 100,
  game_board_width: 249,
  food_update_interval: 5000,
  stone_update_interval: 5000,
  wood_update_interval: 5000,
  shouldShowNumbers: false,
  cloud_count: 1
}
//  game_options = {
//   // game_board_total: 25398,
//   game_board_total: 1098,
//   ocean_total: 20,
//   mountain_total: 10,
//   forest_total: 12,
//   game_board_width: 249,
//   food_update_interval: 5000,
//   stone_update_interval: 5000,
//   wood_update_interval: 5000,
//   shouldShowNumbers: false
// }

// keeps track of all the squares in the game
let game_board = [];

let farm_squares = [];

let mine_squares = [];

let lumbermill_squares = [];

let humans = [];

// this keeps track of food production and updates it on the screen
let farmProduction = 0;
let foodTotal = 300;
let foodIncrementer = 0;
let foodDisplay = 0
//
let food_updater = setInterval(function () {
  $("#food-total").html(`${foodTotal}`)
  foodIncrementer = Math.floor((foodTotal - foodDisplay) / 10)
  if (foodIncrementer == 0) {
    foodIncrementer = 1;
  }
}, game_options.food_update_interval)

let farm_updater = setInterval(function () {
  for (const farm of farm_squares) {
    farm.updateFarm();
  }

}, game_options.food_update_interval / 2)

let screen_updater = setInterval(function () {
  if (foodDisplay < foodTotal) {
    foodDisplay += foodIncrementer;
    $("#food-total").html(`${foodDisplay}`)
  }
  $("#food-production").html(`${farmProduction}`)

}, 100)

// MINES
let stoneProduction = 0;
let stoneTotal = 150;
let stoneIncrementer = 0;
let stoneDisplay = 0
//
let stone_updater = setInterval(function () {
  $("#stone-total").html(`${stoneTotal}`)
  stoneIncrementer = Math.floor((stoneTotal - stoneDisplay) / 10)
  if (stoneIncrementer == 0) {
    stoneIncrementer = 1;
  }
}, game_options.stone_update_interval)

let mine_updater = setInterval(function () {
  for (const mine of mine_squares) {
    mine.updateMine();
  }

}, game_options.stone_update_interval / 2)

let screen_updater_2 = setInterval(function () {
  if (stoneDisplay < stoneTotal) {
    stoneDisplay += stoneIncrementer;
    $("#stone-total").html(`${stoneDisplay}`)
  }
  $("#stone-production").html(`${stoneProduction}`)

}, 100)

// LUMBERMILLS
let woodProduction = 0;
let woodTotal = 150;
let woodIncrementer = 0;
let woodDisplay = 0
//
let wood_updater = setInterval(function () {
  $("#wood-total").html(`${woodTotal}`)
  woodIncrementer = Math.floor((woodTotal - woodDisplay) / 10)
  if (woodIncrementer == 0) {
    woodIncrementer = 1;
  }
}, game_options.wood_update_interval)

let lumbermill_updater = setInterval(function () {
  for (const lumbermill of lumbermill_squares) {
    lumbermill.updateLumbermill();
  }

}, game_options.wood_update_interval / 2)

let screen_updater_3 = setInterval(function () {
  if (woodDisplay < woodTotal) {
    woodDisplay += woodIncrementer;
    $("#wood-total").html(`${woodDisplay}`)
  }
  $("#wood-production").html(`${woodProduction}`)

}, 100)

// JQuery, it makes sure the code inside ONLY runs when the document is ready
$(document).ready(function () {


  //Everything is unclamied land squares
  for (var i = 0; i < game_options.game_board_total; i++) {
    // const random_grid_type = random_grid_types[Math.floor(Math.random() * random_grid_types.length)];
    const randomLandType = Math.random() > 0.25 ? 'land-box1' : 'land-box2'
    game_board.push({
      owner: "unclaimed",
      //the default grid cell should be a land box
      cell_type: 'land-box'
    });
    $("#grid").append(`<div id='${i}' class='grid-box ${randomLandType}'> ${game_options.shouldShowNumbers ? `${i}`: ""} </div>`)
  }


  // ACTIVATE CONTEXT MENU FOR RIGHT CLICKING SQUARES
  const menu = [{
      name: 'Claim starting space',
      title: 'start button',
      fun: function () {
        if (woodTotal >= 100) {
          if (stoneTotal >= 100) {
            woodTotal -= 100
            woodDisplay = woodTotal
            stoneTotal -= 100
            stoneDisplay = stoneTotal
            $(currentlySelected).removeClass("land-box");
            $(currentlySelected).addClass("conquered-square");
          } else {
            alert("You do not have enough resources for that.");
          }
        } else {
          alert("You do not have enough resources for that.");
        }
      }
    },
    {
      name: 'create farm',
      title: 'farm button',
      fun: function () {
        if (foodTotal >= 25) {
          foodTotal -= 25
          foodDisplay = foodTotal
          $(currentlySelected).removeClass("land-box");
          $(currentlySelected).addClass("farm-box1");
          const newFarm = new FarmCell($(currentlySelected).attr("id"))
          farm_squares.push(newFarm);
          farmProduction += 5;
        } else {
          alert("You do not have enough resources for that.");
        }
      }
    },
    {
      name: 'create house',
      title: 'house button',
      fun: function () {
        if (stoneTotal >= 15) {
          if (woodTotal >= 25) {
            woodTotal -= 25
            woodDisplay = woodTotal
            stoneTotal -= 15
            stoneDisplay = stoneTotal
            $(currentlySelected).removeClass("land-box");
            $(currentlySelected).addClass("house-box");
          } else {
            alert("You do not have enough resources for that.");
          }
        } else {
          alert("You do not have enough resources for that.");
        }
      }
    },
    {
      name: 'create lumbermill',
      title: 'lumbermill button',
      fun: function () {
        if (isForest(parseInt($(currentlySelected).attr("id")))) {
          $(currentlySelected).removeClass("land-box");
          $(currentlySelected).addClass("lumbermill-box");
          const newLumbermill = new LumbermillCell($(currentlySelected).attr("id"))
          lumbermill_squares.push(newLumbermill);
          woodProduction += 5;
        } else {
          alert("That cell is NOT a forest. You can ONLY create a lumbermill in a forest.")
        }
      }
    },
    {
      name: 'create mine',
      title: 'mine button',
      fun: function () {
        if (isMountain(parseInt($(currentlySelected).attr("id")))) {
          $(currentlySelected).removeClass("land-box");
          $(currentlySelected).addClass("mine-box");
          const newMine = new MineCell($(currentlySelected).attr("id"))
          mine_squares.push(newMine);
          stoneProduction += 5;
        } else {
          alert("That is not a mountain. You can only create a mine in a mountain.")
        }
      }
    },
    {
      name: 'delete',
      title: 'delete button',
      fun: function () {
        $(currentlySelected).removeClass("sand-box");
      }
    },
    {
      name: 'create person',
      title: 'create person',
      fun: function () {
        const cellIndex = parseInt($(currentlySelected).attr("id"));
        const newHuman = new Human(cellIndex);
        humans.push(newHuman);
        const randomOffset = Math.floor(Math.random() * 20) - 5;
        $(currentlySelected).append(`<img src="./image/WalkDown.gif" id="human${humans.length}" style="left:${randomOffset}px" class="human" />`)
        $(`#human${humans.length}`).css("z-index", `${Math.floor(Math.random()*1000)}`);
      }
    },
  ];

  $("#grid").contextMenu(menu, {
    triggerOn: 'contextmenu'
  })



  $(".grid-box").click(function () {
    lastClicked = currentlySelected;
    currentlySelected = this;
    $(lastClicked).removeClass("selected");
    $(this).addClass("selected");
  })






  function enableClaimStartButton() {
    //Enable the conquer territory button
    $("#claim_start").removeAttr("disabled");
    $("#claim_start").removeClass("btn-danger");
    $("#claim_start").addClass("btn-success");

    //Event handler for when they click the button
    $("#claim_start").click(function () {
      $(lastClicked).addClass("conquered-square")
      $(this).fadeOut();
    });
  }

  $("#highlight_above").click(function () {
    let currently_selected_index = parseInt($(lastClicked).attr("id"))
    let box_above_index = getCellAbove(currently_selected_index, game_options.game_board_width);
    if (box_above_index) {
      $(`#${box_above_index}`).click();
    } else {
      alert("That box doesn't have one above it!")
    }
  });

  $("#highlight_below").click(function () {
    let currently_selected_index = parseInt($(lastClicked).attr("id"))
    let box_below_index = getCellBelow(currently_selected_index, game_options.game_board_width);
    if (box_below_index) {
      $(`#${box_below_index}`).click();
    } else {
      alert("That box doesn't have one below it!")
    }
  });


  $("#highlight_right").click(function () {
    let currently_selected_index = parseInt($(lastClicked).attr("id"))
    let box_right_index = getCellRight(currently_selected_index, game_options.game_board_width);
    if (box_right_index) {
      $(`#${box_right_index}`).click();
    } else {
      alert("That box doesn't have one to the right of it!")
    }
  });

  $("#highlight_left").click(function () {
    let currently_selected_index = parseInt($(lastClicked).attr("id"))
    let box_left_index = getCellLeft(currently_selected_index, game_options.game_board_width);
    if (box_left_index) {
      $(`#${box_left_index}`).click();
    } else {
      alert("That box doesn't have one to the left it!")
    }
  });

  // this loop generaters the forest
  for (var i = 0; i < game_options.forest_total; i++) {
    console.log("Making a forest!");
    const randomForestCell = getRandomCellFromGrid();
    generateRandomForest(randomForestCell);
  }

  // makes mountains
  for (var i = 0; i < game_options.mountain_total; i++) {
    const randomMountainCell = getRandomCellFromGrid()
    generateRandomMountain(randomMountainCell)
  }

  // makes oceans
  for (var i = 0; i < game_options.ocean_total; i++) {
    const randomOceanCell = getRandomCellFromGrid();
    generateRandomOcean(randomOceanCell);
  }



  //This line of code checks the entire map for volcanos. It will change a mountain into a volcano
  //if the mountain is surrounded by 4 ocean squares.
  for (var i = 0; i < game_options.game_board_total; i++) {
    if (isVolcano(i)) {
      // console.log(`I found a volcano at cell ${i}`);
      const volcanoCell = $(`#${i}`);
      createVolcanoCell(volcanoCell);
    }
  }

  //This does the same, but for islands
  for (var i = 0; i < game_options.game_board_total; i++) {
    if (isIsland(i)) {
      // console.log(`I found an island at cell ${i}`);
      const islandCell = $(`#${i}`);
      createIslandCell(islandCell);
    }
  }

  //creates beaches by converting ocean squares based off of how many land squares they are surrounded by
  for (var i = 0; i < game_options.game_board_total; i++) {

    const beach_type = getBeachType(i);

    if (beach_type !== null) {
      const beachCell = $(`#${i}`);
      createBeachCell(beachCell, beach_type);
    }
  }


  setTimeout(() => {
    $("#game_not_loaded_overlay").fadeOut();
  }, 2000)


}); // end of Jquery document.ready


// Below are helper functions and global variables used in the game

let lastClicked;

let currentlySelected;

let currentlyHoveringOverCell;

function isVolcano(cellIndex) {
  if (cellIndex === null) return;
  let cell_being_observed = $(`#${cellIndex}`);
  // if the cell is a mountain, check to see if it is
  if (isMountain(cellIndex)) {

    let surrounding_sea_cell_count = 0;
    // A cell is a volcano if it is already a mountain and if it is surrounded by at least 6 sea squares.
    // We can check the sea cell count by going clockwise around the original volcano square

    /*
    eigth   ||first cell checked || second
    ========||===================||========
    seventh || ORIGINAL CELL     || third
    ========||===================||========
    sixth   ||     fifth         || fourth.....
    */

    let surrounding_cells = {};


    surrounding_cells.above = getCellAbove(cellIndex);
    surrounding_cells.below = getCellBelow(cellIndex);
    surrounding_cells.right = getCellRight(cellIndex);
    surrounding_cells.left = getCellLeft(cellIndex);


    for (cell in surrounding_cells) {
      if (isSea(surrounding_cells[cell])) {
        surrounding_sea_cell_count++
      }
    }



    if (surrounding_sea_cell_count > 3) {
      return true;
    }

    return false;

  } // end of if isVolcano
}

function isIsland(cellIndex) {
  if (cellIndex === null) return false
  let cell_being_observed = $(`#${cellIndex}`);
  // if the cell is a mountain, check to see if it is
  if (isForest(cellIndex)) {

    let surrounding_sea_cell_count = 0;
    // A cell is an island if it is already a mountain and if it is surrounded by at least 6 sea squares.
    // We can check the sea cell count by going clockwise around the original island square

    /*
    eigth   ||first cell checked || second
    ========||===================||========
    seventh || ORIGINAL CELL     || third
    ========||===================||========
    sixth   ||     fifth         || fourth.....
    */

    let surrounding_cells = {};


    surrounding_cells.above = getCellAbove(cellIndex);
    surrounding_cells.below = getCellBelow(cellIndex);
    surrounding_cells.right = getCellRight(cellIndex);
    surrounding_cells.left = getCellLeft(cellIndex);


    for (cell in surrounding_cells) {
      if (isSea(surrounding_cells[cell])) {
        surrounding_sea_cell_count++
      }
    }



    if (surrounding_sea_cell_count > 3) {
      // console.log(`The Island at cell ${cellIndex} is surrounded by ${surrounding_sea_cell_count} sea squares`);
      return true;
    }

    return false;

  } // end of if isIsland
}

function getBeachType(cellIndex) {

  if (cellIndex === null) return false;

  let cell_being_observed = $(`#${cellIndex}`);
  // if the cell is a mountain, check to see if it is
  if (isSea(cellIndex)) {

    let surrounding_cells = {};



    surrounding_cells.above = getCellAbove(cellIndex);
    surrounding_cells.below = getCellBelow(cellIndex);
    surrounding_cells.right = getCellRight(cellIndex);
    surrounding_cells.left = getCellLeft(cellIndex);

    surrounding_cells.down_left = getCellLeft(surrounding_cells.below);
    surrounding_cells.down_right = getCellRight(surrounding_cells.below);
    surrounding_cells.up_left = getCellLeft(surrounding_cells.above);
    surrounding_cells.up_right = getCellRight(surrounding_cells.above);


    //Checking for Bays, which have 3 beaches
    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.right) && isLand(surrounding_cells.below)) {

      return "bayDown-box"
    }

    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.above) && isLand(surrounding_cells.below)) {

      return "bayLeft-box"
    }

    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.above) && isLand(surrounding_cells.right)) {

      return "bayTop-box"
    }

    if (isLand(surrounding_cells.below) && isLand(surrounding_cells.above) && isLand(surrounding_cells.right)) {

      return "bayRight-box"
    }


    //checking for rivers, which have beaches on opposite sides
    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.right)) {

      return "riverLR-box"
    }

    if (isLand(surrounding_cells.above) && isLand(surrounding_cells.below)) {

      return "riverUD-box"
    }


    //checking for L shaped beaches
    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.above)) {

      return "lbeachUL-box"
    }

    if (isLand(surrounding_cells.left) && isLand(surrounding_cells.below)) {

      return "lbeachDL-box"
    }

    if (isLand(surrounding_cells.above) && isLand(surrounding_cells.right)) {

      return "lbeachUR-box"
    }

    if (isLand(surrounding_cells.below) && isLand(surrounding_cells.right)) {

      return "lbeachDR-box"
    }




    if (isLand(surrounding_cells.below)) {

      return "beachDown-box"
    }

    if (isLand(surrounding_cells.left)) {

      return "beachLeft-box"
    }

    if (isLand(surrounding_cells.right)) {

      return "beachRight-box"
    }

    if (isLand(surrounding_cells.above)) {

      return "beachTop-box"
    }

    //checking for double corner beach boxes (both beaches on one side)
    if (isLand(surrounding_cells.down_left) && isLand(surrounding_cells.down_right)) {

      return "cornerBeachDoubleDown-box"
    }

    if (isLand(surrounding_cells.down_left) && isLand(surrounding_cells.up_left)) {

      return "cornerBeachDoubleLeft-box"
    }

    if (isLand(surrounding_cells.up_left) && isLand(surrounding_cells.up_right)) {

      return "cornerBeachDoubleUp-box"
    }

    if (isLand(surrounding_cells.up_right) && isLand(surrounding_cells.down_right)) {

      return "cornerBeachDoubleRight-box"
    }


    //checking for single corner beaches

    if (isLand(surrounding_cells.down_left)) {
      return "cornerBeachDL-box"
    }

    if (isLand(surrounding_cells.down_right)) {
      return "cornerBeachDR-box"
    }

    if (isLand(surrounding_cells.up_left)) {
      return "cornerBeachUL-box"
    }

    if (isLand(surrounding_cells.up_right)) {
      return "cornerBeachUR-box"
    }



    //return null if none of the beach conditions are satisfied
    return null;

  } // end of if isLand
  return null;
}







function isMountain(cellIndex) {
  if (cellIndex === null) return null;
  const cell_being_observed = $(`#${cellIndex}`);
  if (cell_being_observed.attr('class').split(" ").includes("mountain-box1") || cell_being_observed.attr('class').split(" ").includes("mountain-box2")) {
    return true;
  }
  return false;
}

function isLand(cellIndex) {
  // console.log(`Checking if cell ${cellIndex} is a land square`);

  if (cellIndex === null || cellIndex >= game_options.game_board_total || cellIndex < 0) {
    return null;
  }
  const cell_being_observed = $(`#${cellIndex}`);

  if (cell_being_observed.attr('class').split(" ").includes("land-box1") || cell_being_observed.attr('class').split(" ").includes("land-box2") || cell_being_observed.attr('class').split(" ").includes("mountain-box1") || cell_being_observed.attr('class').split(" ").includes("mountain-box2") || cell_being_observed.attr('class').split(" ").includes("forest-box1") || cell_being_observed.attr('class').split(" ").includes("forest-box2") || cell_being_observed.attr('class').split(" ").includes("forest-box3")) {
    return true;
  }


  return false;
}

function isSea(cellIndex) {
  if (cellIndex === null || cellIndex >= game_options.game_board_total || cellIndex < 0) {
    return null;
  }
  const cell_being_observed = $(`#${cellIndex}`);

  if (cell_being_observed.attr('class').split(" ").includes("sea-box")) {
    return true;
  }
  return false;
}

function isForest(cellIndex) {
  if (cellIndex === null) return null;
  const cell_being_observed = $(`#${cellIndex}`);
  if (cell_being_observed.attr('class').split(" ").includes("forest-box1") || cell_being_observed.attr('class').split(" ").includes("forest-box2") || cell_being_observed.attr('class').split(" ").includes("forest-box3")) {
    return true;
  }
  return false;
}

function getRandomCellFromGrid() {
  let randomCellIndex = Math.floor(Math.random() * game_options.game_board_total);
  return randomCellIndex
}



// HELPER FUNCTIONS TO DEAL WITH grid

function getCellAbove(cellIndex, width = game_options.game_board_width) {
  if (cellIndex === null) return null;
  if (cellIndex - width < 0) {
    return null;
  }
  return cellIndex - width;
}

function getCellBelow(cellIndex, width = game_options.game_board_width) {
  if (cellIndex === null) return null;
  if (cellIndex + width > game_options.game_board_total) {
    return null
  }
  return cellIndex + width;
}

function getCellRight(cellIndex, width = game_options.game_board_width) {
  if (cellIndex === null || cellIndex >= game_board.game_board_total) {
    return null;
  }
  //if the next grid cell is a left hand side square, there is no right hand square
  if ((cellIndex + 1) % width == 0) {
    return null;
  }
  return cellIndex + 1;
}

function getCellLeft(cellIndex, width = game_options.game_board_width) {
  if (cellIndex === null) return null;
  //all grid squares that are multiples of the width are on the left border
  if (cellIndex % width == 0) {
    return null;
  }
  return cellIndex - 1;
}




// TERRAIN GENERATORS

function createOceanCell(cell) {
  $(cell).addClass("sea-box")
}

function createForestCell(cell) {
  const random_forest_types = ["forest-box1", "forest-box2", "forest-box3"]
  const random_forest_type = random_forest_types[Math.floor(Math.random() * random_forest_types.length)];
  $(cell).addClass(random_forest_type)
}

function createMountainCell(cell) {
  const random_mountain_types = ["mountain-box1", "mountain-box2"]
  const random_mountain_type = random_mountain_types[Math.floor(Math.random() * random_mountain_types.length)];
  $(cell).addClass(random_mountain_type)
}

function createVolcanoCell(cell) {
  $(cell).removeClass()
  $(cell).addClass("grid-box volcano-box")
}

function createIslandCell(cell) {
  $(cell).removeClass()
  $(cell).addClass("grid-box island-box")
}

function createBeachCell(cell, beach_type) {
  $(cell).removeClass()
  $(cell).addClass(`grid-box ${beach_type}`)
}

function generateRandomForest(startCellIndex) {
  // The radius represents the distance up and down the Forest will extend from its starting cell
  let current_cell_index = startCellIndex;
  const list_of_operations = [];
  const radius = Math.floor(Math.random() * 4) + 5;

  for (var i = 0; i < radius; i++) {
    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createForestCell
    });

    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {

      list_of_operations.push({
        cellIndex: current_cell_index + j,
        action: createForestCell
      });

      list_of_operations.push({
        cellIndex: current_cell_index - j,
        action: createForestCell
      });

    }


    current_cell_index = getCellAbove(current_cell_index);
  }

  //go back to the seed for the Forest and make a radius DOWN
  current_cell_index = startCellIndex
  for (var i = 0; i < radius; i++) {
    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createForestCell
    });

    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {

      list_of_operations.push({
        cellIndex: current_cell_index + j,
        action: createForestCell
      });

      list_of_operations.push({
        cellIndex: current_cell_index - j,
        action: createForestCell
      });

    }


    current_cell_index = getCellBelow(current_cell_index);
  }



  current_cell_index = startCellIndex;


  //extend Forest to left side
  for (var i = 0; i < radius; i++) {

    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createForestCell
    });

    // go randomly up and down from a square
    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {
      list_of_operations.push({
        cellIndex: current_cell_index + (j * game_options.game_board_width),
        action: createForestCell
      });

      list_of_operations.push({
        cellIndex: current_cell_index - (j * game_options.game_board_width),
        action: createForestCell
      });
    }

    current_cell_index = getCellLeft(current_cell_index);
  }



  parseOperations(list_of_operations);

} // end of generateRandomForest

function generateRandomMountain(startCellIndex) {
  let current_cell_index = startCellIndex;
  const list_of_operations = [];
  const mountain_range_length = Math.floor(Math.random() * 10) + 5
  const random_directions = ["up", "down", "left", "right"];
  let mountain_range_direction = random_directions[Math.floor(Math.random() * random_directions.length)]
  //mountain_range_direction = "up";
  // console.log(`Generating random mountain at square ${startCellIndex} in the ${mountain_range_direction} direction`);

  list_of_operations.push({
    cellIndex: startCellIndex,
    action: createMountainCell
  });

  switch (mountain_range_direction) {
    case "up":
    case "down":
      current_cell_index = Math.random() > 0.5 ? getCellLeft(current_cell_index) : getCellRight((current_cell_index));
      break
    case "left":
    case "right":
      current_cell_index = Math.random() > 0.5 ? getCellAbove(current_cell_index) : getCellBelow((current_cell_index));
      break
    default:
      console.log(`Direction for mountain generation not recognized: ${mountain_range_direction}`);
  }


  list_of_operations.push({
    cellIndex: current_cell_index,
    action: createMountainCell
  });

  for (let i = 0; i < mountain_range_length; i++) {
    switch (mountain_range_direction) {
      case "up":
        current_cell_index = getCellAbove(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
        current_cell_index = Math.random() > 0.5 ? getCellRight(current_cell_index) : getCellLeft(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
      case "down":
        current_cell_index = getCellBelow(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
        current_cell_index = Math.random() > 0.5 ? getCellRight(current_cell_index) : getCellLeft(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
      case "left":
        current_cell_index = getCellLeft(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
        current_cell_index = Math.random() > 0.5 ? getCellAbove(current_cell_index) : getCellBelow(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
      case "right":
        current_cell_index = getCellRight(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
        current_cell_index = Math.random() > 0.5 ? getCellAbove(current_cell_index) : getCellBelow(current_cell_index);
        list_of_operations.push({
          cellIndex: current_cell_index,
          action: createMountainCell
        });
    }
  }




  parseOperations(list_of_operations);
}


function generateRandomOcean(startCellIndex) {
  // The radius represents the distance up and down the ocean will extend from its starting cell
  let current_cell_index = startCellIndex;
  const list_of_operations = [];
  const radius = Math.floor(Math.random() * 4) + 5;

  for (var i = 0; i < radius; i++) {
    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createOceanCell
    });

    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {

      list_of_operations.push({
        cellIndex: current_cell_index + j,
        action: createOceanCell
      });

      list_of_operations.push({
        cellIndex: current_cell_index - j,
        action: createOceanCell
      });

    }


    current_cell_index = getCellAbove(current_cell_index);
  }

  //go back to the seed for the ocean and make a radius DOWN
  current_cell_index = startCellIndex
  for (var i = 0; i < radius; i++) {
    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createOceanCell
    });

    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {

      list_of_operations.push({
        cellIndex: current_cell_index + j,
        action: createOceanCell
      });

      list_of_operations.push({
        cellIndex: current_cell_index - j,
        action: createOceanCell
      });

    }


    current_cell_index = getCellBelow(current_cell_index);
  }



  current_cell_index = startCellIndex;


  //extend ocean to left side
  for (var i = 0; i < radius; i++) {

    list_of_operations.push({
      cellIndex: current_cell_index,
      action: createOceanCell
    });

    // go randomly up and down from a square
    for (var j = 0; j < Math.floor(Math.random() * radius) + 2; j++) {
      list_of_operations.push({
        cellIndex: current_cell_index + (j * game_options.game_board_width),
        action: createOceanCell
      });
      list_of_operations.push({
        cellIndex: current_cell_index - (j * game_options.game_board_width),
        action: createOceanCell
      });
    } //end of for loop

    current_cell_index = getCellLeft(current_cell_index);
  }

  // some operations cannot be done, this function applies the possible operations to the game
  parseOperations(list_of_operations);

}

function parseOperations(list_of_operations) {
  for (operation of list_of_operations) {
    //some operations will not have valid cells associated with them.
    if (operation.cellIndex < 0 || operation.cellIndex > game_options.game_board_total || operation.cellIndex === null) {
      // console.log(operation + " is an invalid operation");
      continue;
    }
    $(`#${operation.cellIndex}`).removeClass();
    $(`#${operation.cellIndex}`).addClass("grid-box");
    operation.action($(`#${operation.cellIndex}`));
  }
}