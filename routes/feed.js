const express = require('express');
const router = express.Router();
const db = require('./database');



// Feed endpoints
router.get('/posts', async(req,res)=>{
    try {
      const feed = await db.any('SELECT * FROM feed');
      res.json(feed);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
  }
  
  });
  
  router.post('/posts/addpost', async(req,res)=>{
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
      }

    console.log(req.body);
  
    if(req.body.title=="" || req.body.content=="" ){
      res.status(400).json({msg:"please enter title and content"})
    }
    let title=req.body.title;
    let feedcontent=req.body.content;
    const createdat = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

    let insertquery = 'INSERT INTO feed (title, feedcontent,createdat) VALUES ($1, $2, $3) RETURNING *';
    const newpost = await db.one(insertquery, [title, feedcontent,createdat]);
    
    res.status(201).json(newpost);
    console.log("post inserted successfully");
  });

  router.put('/posts/updatepost/:id', async (req, res) => {
    let   id  = req.params.id;
    let title  = req.body.title;
    let  feedcontent  = req.body.feedcontent;
  
    if (!title) {
      return res.status(400).json({ error: 'Please provide a title' });
    }
    
    if (!feedcontent){
        return res.status(400).json({ error: 'Please provide a content' });
    }
  
    const updatedat = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  
    try {
      const updateQuery = 'UPDATE feed SET title = $1,feedcontent = $2,updatedat = $3 WHERE feedid = $4 RETURNING *';
      const updatedPost = await db.one(updateQuery, [title,feedcontent, updatedat, id]);
  
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  

module.exports = router;