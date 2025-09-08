import { writeFile } from 'fs/promises';

export function log(messsage: string) {
  console.log(messsage);
}

export function storeLog(messsage: string) {
  // const ts = Date.now();
  // writeFile(`logs/${ts}.txt`, messsage + '\n');
  log(messsage);
}