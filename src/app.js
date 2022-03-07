#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import words from "./words.js";
import argv from "./arguments.js";

const colorblindMode = argv.colorblind;

/**
 * Indexes a word at a Math.random position.
 * @returns {String} A string containing 5 characters.
 */
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length - 1)];
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
            else return true;
        },
    });
    return guess.toUpperCase();
}

async function termleGame() {
    const isEasyMode = argv._.includes("easy");
    const maxAttempts = 6;
    let attemptCount = 0;
    const termle = getRandomWord();
    let guess = "";
    let isPlaying = true;

    console.log(
        chalk.green("Welcome to Termle, a terminal-based Wordle clone!")
    );

    if (isEasyMode)
        console.log(chalk.bgRed("Termle is being played in Easy mode!"));

    while (isPlaying && guess !== termle) {
        if (attemptCount >= maxAttempts && !isEasyMode) {
            isPlaying = false;
            break;
        }

        guess = await inquirePlayerGuess();
        let format = "";

        for (let c = 0; c < 5; c++) {
            const guessChar = guess[c];
            const wordleChar = termle[c];

            if (termle.includes(guessChar)) {
                format += colorblindMode
                    ? guessChar !== wordleChar
                        ? chalk.white.bgRed(` ${guessChar} `)
                        : chalk.bgCyan(` ${guessChar} `)
                    : guessChar !== wordleChar
                    ? chalk.black.bgYellow(` ${guessChar} `)
                    : chalk.bgGreen(` ${guessChar} `);
            } else {
                format += chalk.bgGray(` ${guessChar} `);
            }
        }
        console.log(`${format}`);
        attemptCount++;
    }

    if (guess !== termle) console.log(`The termle was ${chalk.bgRed(termle)}.`);

    if (isEasyMode)
        console.log(
            chalk.red(
                `Termle was played in easy mode using ${attemptCount} guesses.`
            )
        );
}

await termleGame();
