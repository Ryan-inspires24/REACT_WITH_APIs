import express from 'express'
import db  from '../firebase/config.js'

const router = express.Router()

router.post('/', async (req, res)=>
{
    try{
        const formData = req.body
        const docRef = await db.collection('responses').add(formData);
        res.status(200).json({messages: "Form submitted with success", id:docRef.id});

    }
    catch(error){
        console.error('Error saving to firestore:', error);
        res.status(500).json({error:'Failed to submit form '})
    }
});

export default router