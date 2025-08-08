// GET /characters ==> Get all characters
// POST /characters ==> Create a new character
// GET /characters/:id ==> Get a character by ID
// PUT /characters/:id ==> Update a character by ID
// DELETE /characters/:id ==> Delete a character by ID

const express = require('express')
const fs = require('fs')
const { title } = require('process')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/characters', (req, res) => {
    res.sendFile(__dirname + '/public/characters.html')
})

app.get('/charactersData', (req, res) => {
    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    })
})

app.get('/characters/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const jsonData = JSON.parse(data);
        const character = jsonData.characters.find(c => c.id === id);

        if (!character) return res.status(404).send('Character not found');
        res.json(character);
    })
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/characters', (req, res) => {
    const newCharacter = req.body;

    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Reading error');

        const jsonData = JSON.parse(data);
        const newID = parseInt(newCharacter.id,10)
        for(let character of jsonData.characters){
            if(character.id === newID){
                return res.status(400).send('Character with this ID already exists');
            }
        }

        newCharacter.id = parseInt(newCharacter.id,10)
        jsonData.characters.push(newCharacter);

        fs.writeFile('./user.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Writing error');
            res.status(201).send('Character created successfully');
        })
    })

})

app.put('/characters/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const { name, realName, universe } = req.body;

   fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const jsonData = JSON.parse(data);
        const characterIndex = jsonData.characters.findIndex(c => c.id === id);
        if (characterIndex === -1) return res.status(404).send('Character not found');

        if(name) jsonData.characters[characterIndex].name = name;
        if(realName) jsonData.characters[characterIndex].realName = realName;
        if(universe) jsonData.characters[characterIndex].universe = universe;
    
        fs.writeFile('./user.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.send('Character updated successfully');
        })
   })  
})

app.delete('/characters/:id', (req, res) => {
    const id = parseInt(req.params.id);
    fs.readFile('./user.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading file');
        const jsonData = JSON.parse(data);
        const characterIndex = jsonData.characters.findIndex(c => c.id === id);
        if (characterIndex === -1) return res.status(404).send('Character not found');
        jsonData.characters.splice(characterIndex, 1);
        
        fs.writeFile('./user.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.send('Character deleted successfully');
        })
    }) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

