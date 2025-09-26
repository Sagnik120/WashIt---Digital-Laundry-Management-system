import express from 'express';
import userController from '../controller/userController.js'
const router = express.Router();

router.post('/studentRegister',userController.studentRegister);
router.post('/staffRegister',userController.staffRegister);
router.post('/studentLogin',userController.loginUser);


// Add this simple test route first
router.get('/test', (req, res) => {
    res.json({ message: 'User routes are working!' });
});


export default router;