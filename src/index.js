const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

const devs = []

const GiTHUB_URL = "https://api.github.com/users"


async function getUserFromGithub(username) {
  try {
    const { data } = await axios.get(`${GiTHUB_URL}/${username}`)

  return data
    
  } catch (error) {
    console.log(error.response.data);
  }
  
}

app.post('/devs', async(req, res) =>{
  const { username } = req.body

  //verificação pra não deixar criar um usernema igual 
  const devAlreadyExists =  devs.some(dev => dev.username === username)



  if(devAlreadyExists) {
    return res.status(400).json({message: "Dev already exists!"})
  }

  const user = await getUserFromGithub(username)

  //veridicando se esse usarname existi no GITHUB
  if (!user){
    return res.status(400).json({message: 'Usuário não encontrado no GITHUB'})
  }

  //array para armazenar os devs criados 
  const dev = {
    id: user.id,
    name: user.name,
    username
  }

  devs.push(dev)


  //status 201 quer dizer que foi criado alguma coisa 
  return res.status(201).json({
    message: "Dev criado com sucesso!",
    dev,
  })
})

app.get('/devs',(req, res) => {
  return res.json(devs)
})

app.listen(3333)

