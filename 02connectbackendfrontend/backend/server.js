import express from 'express'

//"type": "module",//added to can use import statement
const app = express()

//app.use(express.static('dist')) 
//--> we run npm run build in frontend then dist file generated 
//the move the dist file in backend folder 
//now you can directly run the website form backend (npm run start)
//it solve the prblem of proxy all thing are backend so run on same url
 
//problem if you want to do change the frontend then you have to again run npm run build and then replace this new dist file with old dist file in backend

app.get('/', (req, res) => {
  res.send('Server is ready')
});
// /api/jokes should be is practice to use if want to creat an api 
//so that on front we can use /api/jokes to get the data
app.get('/api/jokes', (req, res) => {  
    const jokes = [
        {
            id: 1, 
            title: 'Joke 1',
            content: 'This is joke 1'
        },
        {
            id: 2,
            title: 'Joke 2',
            content: 'This is joke 2'
        },
        {
            id: 3,
            title: 'Joke 3',
            content: 'This is joke 3'
        }];
    res.json(jokes)//.json to send json dataa
});


const port=process.env.PORT || 3000//if value is not present in env file then use 4000

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`)
});
