import React from 'react';
import Food from './Food.jsx';
import {NutritionCounter} from './NutritionCounter.jsx';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

const Meal = ({meal, foods}) => {
	return (
	<div className='meal-element'>
		<Table>

		 <TableHeader 
		 	className='meal-title'
		 	displaySelectAll={false}
		 >
        <TableRow>
          <TableHeaderColumn>Meal From: {meal.eatenAt}</TableHeaderColumn>
        </TableRow>
				<NutritionCounter meals={[meal]} foods={foods} />
      </TableHeader>

      <TableBody
      	displayRowCheckbox={false}
      >
			{_.keys(meal.foodsEaten).map((foodId) => {
				let name = foods[foodId]['item_name'];
				return (
						<Food className='food-entry' key={foodId} food ={foods[foodId]} id={foodId} />
					);
				})
			}
			</TableBody>
		</Table>
	</div>
	);
}

export default Meal