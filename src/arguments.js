import yargs from "yargs";

const argv = yargs(process.argv.splice(2))
    .usage("Usage: $0 <command> [options]")
    .command("easy", "remove the 6-guess limit")
    .help("help")
    .alias("h", "help")
    .alias("v", "version")
    .alias("cb", "colorblind")
    .describe("cb", "Render in colorblind-friendly mode")
    .version().argv;

export default argv;
