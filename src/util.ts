import readline from "readline";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readInput() {
  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise<string>((resolive) =>
    readInterface.question("> ", (inputString) => {
      readInterface.close();
      resolive(inputString);
    })
  );
}
