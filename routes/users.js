const express = require('express');
const router = express.Router();
const db = require('./database');
// User endpoints
router.get('/', async (req, res) => {
    try {
      const users = await db.any('SELECT * FROM users');
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
  }
  })
  
  router.get('/:id',async (req,res)=>{
    console.log(req.params.id);
    try {
      const users = await db.any('SELECT * FROM users WHERE id='+req.params.id);
      res.json(users);
  } catch (error) {
      res.status(500).json({ error: error });
  }
  });
  
  router.post('/login',async(req,res)=>{
    const { username, password } = req.body;
    console.log(req.body.username);
    console.log(req.body.password);
    
    try {
        const query = 'SELECT * FROM users WHERE username = $1 AND password ILIKE $2';
        const user = await db.oneOrNone(query, [username, password]);
        console.log(user)
        if (user) {
            // Successful login
            res.json({ message: 'Login successful' });
        } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid username or password'   
  });
        }
    } catch (error) {
        // Handle database errors
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    //users.filter((users)=>users.username==username && users.password==password);
    
  });
  
  router.post('/signup',async (req,res)=>{
  
    let username=req.body.username;
    let password=req.body.password;
    username=username.trim();
    password=password.trim();
    if(username=="" || password==""){
      res.json({msg:"Please enter username and password "});
    }
  
    
    //check of user already exists
  
    try {
      const createdat = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });

      let searchquery="SELECT * FROM users  WHERE username=$1";
      const insertquery = 'INSERT INTO users (username, password, createdat) VALUES ($1, $2,$3) RETURNING *';
  
      const users = await db.any(searchquery,[username]);
      
  
      if(users.length>0){
        res.json({msg: "user already exists"})
      }
      else{
        const newUser = await db.one(insertquery, [username, password,createdat]);
        res.status(201).json(newUser);
        console.log("user successfully inserted into the database");
      }
  
    } catch (error) {
      res.status(500).json({ error: error });
      console.log(error);
  }
  
  
  });


  router.put('/addbio/:id',async (req,res)=>{
    let bio=req.body.bio;
    let id=req.params.id;
    
  
    if (!bio) {
      return res.status(400).json({ error: 'Please provide a bio' });
    }
    
    const updatedat = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    
    try {
      const updateQuery = 'UPDATE users SET bio = $1,updatedat = $2 WHERE id = $3 RETURNING *';
      const updatedbio = await db.one(updateQuery, [bio, updatedat, id]);
  
      if (!updatedbio) {
        return res.status(404).json({ error: 'user not found' });
      }
  
      res.json({ message: 'bio updated successfully', post: updatedbio });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update bio' });
    } 

  });
  

  router.post('/addcontact/:id',async (req,res)=>{
  
    let id=req.params.id;
    let contact=req.body.contact;
    
    if(contact==""){
      res.json({msg:"Please enter contact details"});
    }
  
    try {
      //const createdat = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
      let searchquery="SELECT * FROM users  WHERE id=$1";
      const insertquery = 'INSERT INTO users (username,emergencycontact) VALUES ($1, $2) RETURNING *';
      const users = await db.any(searchquery,[id]);
      let username=users[0].username;
      
        const newcontact = await db.one(insertquery, [username,contact]);
        res.status(201).json(newcontact);
        console.log("Emergency contact successfully added");
      
  
    } catch (error) {
      res.status(500).json({ error: error });
      console.log(error);
  }
  
  
  });


  router.get('/allcontacts/:username',async (req,res)=>{
    let username=req.params.username;
    try {
        let query="SELECT emergencycontact FROM users WHERE username=$1";
      
      const allcontacts = await db.any(query, [username]);
      res.json(allcontacts);
  } catch (error) {
      res.status(500).json({ error: error });
  }
  });


  router.get('/test/:id',async(req,res)=>{
    res.json({msg:"this is a test route"});
    
  });

module.exports = router;