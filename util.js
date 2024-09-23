router.get('/api/feed/posts', async(req,res)=>{
    try {
      const feed = await db.any('SELECT * FROM feed');
      res.json(feed);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
  }
  
  });
  
  router.post('/api/feed/posts/addpost', async(req,res)=>{
  
    console.log(req.body);
  
    if(req.body.title=="" || req.body.content=="" ){
      res.status(400).json({msg:"please enter title and content"})
    }
    let title=req.body.title;
    let feedcontent=req.body.content;
    let insertquery = 'INSERT INTO feed (title, feedcontent) VALUES ($1, $2) RETURNING *';
    const newpost = await db.one(insertquery, [title, feedcontent]);
    
    res.status(201).json(newpost);
    console.log("post inserted successfully");
  });
  
  router.get('/api/admin/user/deleteuser/:id',async(req,res)=>{
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
  
  router.get('/api/admin/feed/deletepost/:id', async(req,res)=>{
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