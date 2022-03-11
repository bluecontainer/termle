#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import words from "./words.js";
import argv from "./arguments.js";

/**
 * Indexes a word at a Math.random position.
 * @returns {String} A string containing 5 characters.
 */
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length - 1)];
}

function getWordOfDay() {
    // January 1, 2022 Game Epoch
    const epochMs = new Date(2022, 0).valueOf()
    const now = Date.now()
    const msInDay = 86400000
    const index = Math.floor((now - epochMs) / msInDay)
  
    return words[index % words.length]
  }
/**
 * Uses an inquirer prompt to take the Player's input guess.
 * @returns {String} A fully uppercase string containing 5 characters.
 */
async function inquirePlayerGuess() {
    const { guess } = await inquirer.prompt({
        name: "guess",
        type: "input",
        message: `> `,
        validate(guess) {
            if (guess.length !== 5)
                throw Error("please input a word 5 characters in length");
            else if (!words.includes(guess.toUpperCase())) {
                throw Error("use a valid word");
            }
            else 
                return true;
        },
    });
    return guess.toUpperCase();
}

function generateFormattedOutput(wordle, guess) {
    let formattedOutput = "";
    for (let c = 0; c < wordle.length; c++) {
        const guessChar = guess[c];
        const wordleChar = wordle[c];

        if (wordle.includes(guessChar)) {
            formattedOutput += (guessChar !== wordleChar
                        ? chalk.black.bgYellow(` ${guessChar} `)
                        : chalk.bgGreen(` ${guessChar} `));
        } else {
            formattedOutput += chalk.bgGray(` ${guessChar} `);
        }
    }
    return formattedOutput;
}

async function wordleGame() {
    const isEasyMode = argv.easy;
    const maxAttempts = 6;
    let attemptCount = 0;
    const isDailyWordMode = argv.daily;
    const wordle = isDailyWordMode ? getWordOfDay() : getRandomWord();
    let guess = "";
    let isPlaying = true;

    console.log(
        chalk.green("Welcome to Wordle, a terminal-based Wordle clone! (" + wordle + ")")
    );

    if (isEasyMode)
        console.log(chalk.bgRed("Easy mode (you can guess until you get it"));
    if (isDailyWordMode)
        console.log(chalk.bgGray("Daily word mode (if you have played it today the wordle hasn't changed)"));

    while (isPlaying && guess !== wordle) {
        if (attemptCount >= maxAttempts && !isEasyMode) {
            isPlaying = false;
            break;
        }

        guess = await inquirePlayerGuess();
        console.log(generateFormattedOutput(wordle, guess));
        attemptCount++;
    }

    if (guess !== wordle) {
        console.log(`The wordle was ${chalk.bgRed(wordle)}.`);
    } else {
        console.log(
            chalk.red(
                `Wordle was guessed in ${attemptCount} attempts.`
            )
        );        
    }
}

await wordleGame();
