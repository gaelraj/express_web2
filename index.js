// GET /characters ==> Get all characters
// POST /characters ==> Create a new character
// GET /characters/:id ==> Get a character by ID
// PUT /characters/:id ==> Update a character by ID
// DELETE /characters/:id ==> Delete a character by ID

const express = require('express')
const fs = require('fs')
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

