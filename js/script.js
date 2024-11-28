let speed = 100
let name
let numScore=0
let direction

const tela = document.createElement("canvas")
tela.width=600
tela.height=600

const text = document.createElement("span")
text.classList.add('display-6')
text.innerHTML="Pontuação:"

const score = document.createElement("span")
score.classList.add('display-6')
score.innerText=numScore

const divText=document.getElementById("divt")
const divScore=document.getElementById("divp")
const divCanva=document.getElementById("divc")
const divForm=document.getElementById("divf")

const form = document.querySelector("form")
const nameBox = document.getElementById("n")

const save = () => {
    name = document.getElementById("n").value

    const divCanva = document.getElementById("divc")
    
    if(document.getElementById("f").checked){
        speed = 200
    }else if(document.getElementById("m").checked){
        speed = 100
    }else if(document.getElementById("d").checked){
        speed = 50
    }
    

    divText.appendChild(text)
    divScore.appendChild(score)
    divCanva.appendChild(tela)

    form.remove()

    document.addEventListener("keydown", ({key}) =>{
        if(key == "ArrowUp" && direction!="down"){
            direction = "up"
        }
        if(key == "ArrowDown" && direction!="up"){
            direction = "down"
        }
        if(key == "ArrowLeft" && direction!="right"){
            direction = "left"
        }
        if(key == "ArrowRight" && direction!="left"){
            direction = "right"
        }
    })
}

const ctx = tela.getContext("2d")

const size = 30

const snake = [
    {x: 270, y:270},
]

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPos = () => {
    const num = randomNumber(0, tela.width-size)
    return Math.round(num/30) *30
}

const food = {x: randomPos(), y:randomPos(), color:"#c40909"}

const drawSnake = () => {
    ctx.fillStyle = "grey"
    snake.forEach((position, index) => {
        if(index == snake.length-1){
            ctx.fillStyle="white"
            ctx.shadowColor="white"
            ctx.shadowBlur=20
        }
        ctx.fillRect(position.x, position.y, size, size)
        ctx.shadowBlur=0
    })

}

const drawFood = () => {

    ctx.shadowColor=food.color
    ctx.shadowBlur=20
    ctx.fillStyle=food.color
    
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur=0
    
}

const moveSnake = () => {
    const head = snake[snake.length-1]
    if(!direction) return

    if(direction == "left"){
        snake.push({x:head.x-size, y:head.y})
    }
    if(direction == "right"){
        snake.push({x:head.x+size, y:head.y})
    }
    if(direction == "up"){
        snake.push({x:head.x, y:head.y-size})
    }
    if(direction == "down"){
        snake.push({x:head.x, y:head.y+size})
    }

    snake.shift()
}

const checkEat = () => {
    const head = snake[snake.length-1]

    if(head.x == food.x && head.y == food.y){
        snake.push(head)
        
        numScore+=10

        let x = randomPos()
        let y = randomPos()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPos()
            y = randomPos()
        }

        food.x = x
        food.y = y
    }
}

checkCollision = () => {
    const head = snake[snake.length-1]
    const neckIndex = snake.length-2

    const wallCollision = head.x < 0 || head.x > tela.width-size || head.y < 0 || head.y > tela.height-size

    const snakeCollision = snake.find((position, index) => {return index < neckIndex && head.x == position.x && head.y == position.y})

    if(wallCollision || snakeCollision){
        gameOver()
    }
}

const gameOver = () => {
    const head = snake[snake.length-1]

    snake.splice(0, snake.length-1)
    head.x = 270
    head.y=270
    direction = undefined
    alert("Você perdeu "+name+"! Sua pontuação foi de "+ numScore+" pontos.")
    numScore=0

    tela.remove()
    text.remove()
    score.remove()

    divForm.appendChild(form)
    
    nameBox.value=name
}

const loop = () => {
    let loopId
    clearInterval(loopId)
    ctx.clearRect(0,0,600,600)

    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()
    score.innerText=numScore

    loopId = setTimeout(() =>{
        loop()
    }, speed)
}

loop()