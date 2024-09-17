const express = require('express');
const router = express.Router();
const db = require('./database');
// Admin endpoints (protected by authentication)
router.get('/user/deleteuser/:id',async(req,res)=>{
    let id=req.params.id;
    //id=toString(id);
    try {
      let deletequery="DELETE FROM users WHERE id=$1";
      const deleteuser=await db.one(deletequery, [id]);
      res.json({msg:"user deleted successfully"});
  } catch (error) {
      res.status(500).json({ msg: 'user deleted' });
      console.log(error);
  }
  
  });
  
  router.get('/feed/deletepost/:id', async(req,res)=>{
    let id=req.params.id;
    //id=toString(id);
    try {
      let deletequery="DELETE FROM feed WHERE feedid=$1";
      const deleteuser=await db.one(deletequery, [id]);
      res.json({msg:"user deleted successfully"});
  } catch (error) {
      res.status(500).json({ msg: 'post deleted' });
      console.log(error);
  }
  });
  
  

module.exports = router;