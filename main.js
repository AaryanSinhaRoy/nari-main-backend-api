const express = require('express');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/feed', require('./routes/feed'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));


//Body parser middleware

//endpoints to add

// optional image insertion by admin while creating new  feed post


app.get('/api', (req, res) => {
  res.json({msg:'Welcome to nari api'});
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}....`);
})