import React from 'react';
import Food from './Food.jsx';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

const SelectFood = ({selectedFoods, removeFood, user, sendMeal, sendFoodItems}) => {
  let timesEaten = [];

  let removeSelectedFood = (food) => {
    removeFood(food);
  }

  let submitMeal = (e) => {
    e.preventDefault();

    let meals = {
      eatenAt: Date.now(),
      eatenBy: user.userInfo.username,
      foodsEaten: {}
    };
    let newFoodIds = [];

    (_.values(selectedFoods).forEach((food, index) => {
      meals.foodsEaten[food.item_id] = timesEaten[index].value;
      if(!(food.item_id in user.foods)) {
        newFoodIds.push(food.item_id);
      }
    }));
    
    sendFoodItems(newFoodIds)
    .then(sendMeal.bind(this, meals));
    
    _.values(selectedFoods).forEach(removeSelectedFood);

  }

  let selectedFoodsDisplay;

  if(_.isEmpty(selectedFoods)){
    selectedFoodsDisplay = <div>No entry selected</div>;
  } else {
    selectedFoodsDisplay = (
      <TableBody
         displayRowCheckbox={false}
      >
        { _.values(selectedFoods).map((food, index) => {
          let id = food['item_id'];
          return (
            <Food 
              numEaten={(ref) => timesEaten[index] = ref}
              className='selectedFoodEntry'
              food={food}
              key={id}
              buttonAction={removeSelectedFood.bind(this,food)}
              buttonIcon="remove"
            />
          );
        })
      }
      </TableBody>
    );
  }

   
  return (
    <div className='select-food'>
      <h5>What I Ate:</h5>
      <Table>

        <TableHeader
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>Quantity</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Made By</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
         {selectedFoodsDisplay}
      </Table>
      {_.isEmpty(selectedFoods) ? null : <button onClick={submitMeal}>Submit</button> }
    </div>
  );
}

export default SelectFood;
