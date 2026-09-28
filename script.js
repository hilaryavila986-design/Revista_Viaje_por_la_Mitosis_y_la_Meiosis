/* =========================================================
   ENTRE CÉLULAS
   JAVASCRIPT · REVISTA DIGITAL
========================================================= */

let currentPage = 1;

const pages = document.querySelectorAll(".page");
const counter = document.getElementById("counter");


/* =========================================================
   NAVEGACIÓN
========================================================= */

function showPage(number){

    if(number < 1){
        number = 1;
    }

    if(number > pages.length){
        number = pages.length;
    }

    currentPage = number;

    pages.forEach((page, index) => {

        if(index === currentPage - 1){
            page.classList.add("active");
        }else{
            page.classList.remove("active");
        }

    });

    if(counter){
        counter.textContent =
            String(currentPage).padStart(2,"0") +
            " / " +
            String(pages.length).padStart(2,"0");
    }

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}


function nextPage(){

    if(currentPage < pages.length){
        showPage(currentPage + 1);
    }

}


function previousPage(){

    if(currentPage > 1){
        showPage(currentPage - 1);
    }

}


function goToPage(number){
    showPage(number);
}


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener("keydown", function(event){

    if(event.key === "ArrowRight"){
        nextPage();
    }

    if(event.key === "ArrowLeft"){
        previousPage();
    }

});


/* =========================================================
   QUIZ
========================================================= */

function checkQuiz(){

    const answers = {
        q1:"b",
        q2:"a",
        q3:"c",
        q4:"a",
        q5:"b"
    };

    let score = 0;

    Object.keys(answers).forEach(question => {

        const selected = document.querySelector(
            `input[name="${question}"]:checked`
        );

        if(selected && selected.value === answers[question]){
            score++;
        }

    });


    const result = document.getElementById("quiz-result");

    if(!result){
        return;
    }


    if(score === 5){

        result.textContent =
            "🎉 ¡5/5! Excelente, dominas el tema.";

    }else if(score >= 3){

        result.textContent =
            `👏 Obtuviste ${score}/5. Vas muy bien, repasa los puntos que fallaste.`;

    }else{

        result.textContent =
            `📚 Obtuviste ${score}/5. Dale otra repasada a la revista y vuelve a intentarlo.`;

    }

}


/* =========================================================
   REPASO FINAL
========================================================= */

function toggleAnswer(number){

    const answer = document.getElementById("a" + number);

    if(!answer){
        return;
    }

    answer.classList.toggle("show");

}


/* =========================================================
   SOPA DE LETRAS
========================================================= */

const wordSearchWords = [

    "MITOSIS",
    "MEIOSIS",
    "PROFASE",
    "METAFASE",
    "ANAFASE",
    "TELOFASE",
    "CROMOSOMA",
    "CROMATIDA",
    "HAPLOIDE",
    "DIPLOIDE",
    "CITOCINESIS"

];


const gridSize = 15;


/*
   Cada palabra tiene:

   [fila inicial,
    columna inicial,
    cambio de fila,
    cambio de columna]

   Ejemplo:

   [0,0,0,1]

   significa:
   empieza en fila 0,
   columna 0,
   avanza 0 filas,
   avanza 1 columna.

   Así las palabras quedan en línea recta.
*/

const placements = {

    MITOSIS:[
        0,0,
        0,1
    ],

    MEIOSIS:[
        2,2,
        1,0
    ],

    PROFASE:[
        4,0,
        1,1
    ],

    METAFASE:[
        0,14,
        1,0
    ],

    ANAFASE:[
        8,1,
        0,1
    ],

    TELOFASE:[
        10,14,
        -1,0
    ],

    CROMOSOMA:[
        6,0,
        0,1
    ],

    CROMATIDA:[
        9,14,
        -1,0
    ],

    HAPLOIDE:[
        14,0,
        -1,1
    ],

    DIPLOIDE:[
        14,14,
        -1,0
    ],

    CITOCINESIS:[
        12,2,
        0,1
    ]

};


/* =========================================================
   CREAR LA SOPA
========================================================= */

let wordGrid = [];

let selectedCells = [];

let foundWords = new Set();

let firstSelected = null;


/*
   Letras aleatorias.
*/

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


function randomLetter(){

    return alphabet[
        Math.floor(Math.random() * alphabet.length)
    ];

}


/*
   Crear matriz vacía.
*/

function createEmptyGrid(){

    wordGrid = [];

    for(let row = 0; row < gridSize; row++){

        wordGrid[row] = [];

        for(let col = 0; col < gridSize; col++){

            wordGrid[row][col] = null;

        }

    }

}


/*
   Colocar palabras.
*/

function placeWords(){

    wordSearchWords.forEach(word => {

        const placement = placements[word];

        if(!placement){
            return;
        }

        const startRow = placement[0];
        const startCol = placement[1];

        const rowDirection = placement[2];
        const colDirection = placement[3];


        for(let i = 0; i < word.length; i++){

            const row =
                startRow +
                rowDirection * i;

            const col =
                startCol +
                colDirection * i;


            if(
                row >= 0 &&
                row < gridSize &&
                col >= 0 &&
                col < gridSize
            ){

                wordGrid[row][col] =
                    word[i];

            }

        }

    });

}


/*
   Rellenar espacios vacíos.
*/

function fillEmptyCells(){

    for(let row = 0; row < gridSize; row++){

        for(let col = 0; col < gridSize; col++){

            if(!wordGrid[row][col]){

                wordGrid[row][col] =
                    randomLetter();

            }

        }

    }

}


/*
   Dibujar la cuadrícula.
*/

function renderWordGrid(){

    const grid = document.getElementById("word-grid");

    if(!grid){
        return;
    }

    grid.innerHTML = "";

    for(let row = 0; row < gridSize; row++){

        for(let col = 0; col < gridSize; col++){

            const cell =
                document.createElement("div");

            cell.className = "letter";

            cell.textContent =
                wordGrid[row][col];

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener(
                "click",
                () => selectCell(row,col)
            );

            grid.appendChild(cell);

        }

    }

}


/* =========================================================
   LISTA DE PALABRAS
========================================================= */

function renderWordList(){

    const list =
        document.getElementById("word-list");

    if(!list){
        return;
    }

    list.innerHTML = "";

    wordSearchWords.forEach(word => {

        const li =
            document.createElement("li");

        li.textContent = word;

        li.id =
            "word-" + word;

        list.appendChild(li);

    });

}


/* =========================================================
   SELECCIONAR CELDAS
========================================================= */

function selectCell(row,col){

    const key = `${row}-${col}`;


    /*
       Si no hay primera celda,
       esta será el comienzo.
    */

    if(firstSelected === null){

        firstSelected = {
            row:row,
            col:col
        };

        selectedCells = [key];

        paintSelection();

        updateWordMessage(
            "Ahora selecciona la última letra."
        );

        return;
    }


    /*
       Si se hace clic exactamente
       en la misma celda, cancelar.
    */

    if(
        firstSelected.row === row &&
        firstSelected.col === col
    ){

        clearSelection();

        updateWordMessage(
            "Selección cancelada."
        );

        return;
    }


    /*
       Crear línea entre las dos celdas.
    */

    const line =
        getLine(
            firstSelected.row,
            firstSelected.col,
            row,
            col
        );


    if(!line){

        updateWordMessage(
            "La palabra debe estar en línea recta."
        );

        return;
    }


    selectedCells = line.map(
        cell => `${cell.row}-${cell.col}`
    );


    const selectedWord =
        line
            .map(cell =>
                wordGrid[cell.row][cell.col]
            )
            .join("");


    const reversedWord =
        selectedWord
            .split("")
            .reverse()
            .join("");


    const matchingWord =
        wordSearchWords.find(word =>
            word === selectedWord ||
            word === reversedWord
        );


    if(matchingWord){

        if(!foundWords.has(matchingWord)){

            foundWords.add(matchingWord);

            markFound();

            const listItem =
                document.getElementById(
                    "word-" + matchingWord
                );

            if(listItem){
                listItem.classList.add("found");
            }

        }

        updateWordMessage(
            `¡Encontraste ${matchingWord}!`
        );

    }else{

        updateWordMessage(
            "Esa selección no corresponde a una palabra de la lista."
        );

    }


    firstSelected = null;

    setTimeout(() => {

        clearSelection();

    }, 600);

}


/* =========================================================
   CREAR LÍNEA RECTA
========================================================= */

function getLine(
    startRow,
    startCol,
    endRow,
    endCol
){

    const rowDiff =
        endRow - startRow;

    const colDiff =
        endCol - startCol;


    /*
       Solo permitimos:

       horizontal
       vertical
       diagonal
    */

    const validDirection =
        rowDiff === 0 ||
        colDiff === 0 ||
        Math.abs(rowDiff) === Math.abs(colDiff);


    if(!validDirection){
        return null;
    }


    const rowStep =
        rowDiff === 0
            ? 0
            : rowDiff > 0
                ? 1
                : -1;


    const colStep =
        colDiff === 0
            ? 0
            : colDiff > 0
                ? 1
                : -1;


    const length =
        Math.max(
            Math.abs(rowDiff),
            Math.abs(colDiff)
        ) + 1;


    const line = [];


    for(let i = 0; i < length; i++){

        line.push({

            row:
                startRow +
                rowStep * i,

            col:
                startCol +
                colStep * i

        });

    }


    return line;

}


/* =========================================================
   PINTAR SELECCIÓN
========================================================= */

function paintSelection(){

    const cells =
        document.querySelectorAll(".letter");


    cells.forEach(cell => {

        const key =
            `${cell.dataset.row}-${cell.dataset.col}`;


        if(selectedCells.includes(key)){

            cell.classList.add("selected");

        }else{

            cell.classList.remove("selected");

        }

    });

}


/* =========================================================
   MARCAR PALABRA ENCONTRADA
========================================================= */

function markFound(){

    const cells =
        document.querySelectorAll(".letter");


    selectedCells.forEach(key => {

        const parts = key.split("-");

        const row = parts[0];
        const col = parts[1];


        cells.forEach(cell => {

            if(
                cell.dataset.row === row &&
                cell.dataset.col === col
            ){

                cell.classList.remove("selected");

                cell.classList.add("found");

            }

        });

    });

}


/* =========================================================
   LIMPIAR SELECCIÓN
========================================================= */

function clearSelection(){

    const cells =
        document.querySelectorAll(".letter");


    cells.forEach(cell => {

        cell.classList.remove("selected");

    });


    selectedCells = [];

    firstSelected = null;

}


/* =========================================================
   MENSAJE DE LA SOPA
========================================================= */

function updateWordMessage(message){

    const element =
        document.getElementById("word-message");

    if(element){

        element.textContent = message;

    }

}


/* =========================================================
   REINICIAR SOPA
========================================================= */

function resetWordSearch(){

    foundWords.clear();

    selectedCells = [];

    firstSelected = null;

    createEmptyGrid();

    placeWords();

    fillEmptyCells();

    renderWordGrid();

    renderWordList();

    updateWordMessage(
        "Selecciona la primera letra y luego la última."
    );

}


/* =========================================================
   INICIAR TODO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        showPage(1);

        resetWordSearch();

    }
);