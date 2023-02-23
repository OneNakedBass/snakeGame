
# Snake Game

This project was made with the intention of getting some more practice with event listeners and the call stack in JS. Nostalgia was other factor that inspired me to do this little rendition of the classic snake game, being that also the reason that made me try to give it that old school console style.

[You can play it here.](https://onenakedbass.github.io/snakeGame)


## Functionality

This simple game works with a setTimeOut loop that calls some other functions if certain conditions are met.

The setTimeOut loop is created by calling the function "iterate" recursively.

```
    function iterate(){
    if (keepIterating === true){

        setTimeout(() => {
            moveHead();
            if (headPosition[0] == foodPosition[0] && headPosition[1] == foodPosition[1]){
                eatFood();
                spawnFood();
            };
            snakeLength > 1 ? moveTail() : null;
            iterate();
        }, gameSpeed)
    }
};
```

It will first check if the game is still on, and then call the rest of the functions depending on the position of the headPosition, foodPosition and snakeLength, the rest of the functions are nested callBack functions.
