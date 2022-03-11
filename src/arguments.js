import yargs from "yargs";

const argv = yargs(process.argv.splice(2))
    .usage("Usage: $0 <command> [options]")
    .command("easy", "remove the 6-guess limit")
    .help("help")
    .alias("h", "help")
    .alias("v", "version")
    .alias("d", "daily")
    .describe("d", "Pick a new word every day")
    .alias("e", "easy")
    .describe("e", "no limit to the number of guesses")
    .version().argv;

export default argv;
