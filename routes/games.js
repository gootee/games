const fs = require('fs');
const express = require("express");
const router = express.Router();

router.get('/index', function(req, res) {
  res.redirect('/')
})

router.get('/', function(req, res) {
  res.render('games/index', { title: 'Games' });
});

router.get('/sudoku', function(req, res) {
  fs.readFile('sudoku.csv', 'utf8', function(err, data) {
    if (err) throw err;
    const sudokuGames = data.split('\n')
    const randomGameIndex = sudokuGames.length > 0 ? Math.ceil(Math.random() * sudokuGames.length) : 0; 
    const rawPuzzle = sudokuGames[randomGameIndex].substring(1, 164) //take off the surrounding double quotes
    res.render('games/sudoku', { puzzle: rawPuzzle });
  })
});

module.exports = router;
