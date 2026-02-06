import express from 'express';
import controller from '../controllers/realEstate.controller.js';

const router = express.Router();
//posts
router.post('/add-property', controller.addProperty);
router.post('/add-income', controller.addIncome);
router.post('/add-expense', controller.addExpense);

//gets
router.get('/get-properties',controller.getProperties);
router.get('/get-incomes',controller.getIncomes);
router.get('/get-expenses',controller.getExpenses);

//deletes
router.delete('/delete-property/:id', controller.deleteProperty);
router.delete('/delete-income/:id', controller.deleteIncome);
router.delete('/delete-expense/:id', controller.deleteExpense);

//puts
router.put('/update-property/:id', controller.updateProperty);
router.put('/update-income/:id', controller.updateIncome);
router.put('/update-expense/:id', controller.updateExpense);

export default router;