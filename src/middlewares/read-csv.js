import fs from "node:fs";
import { parse } from "csv-parse";

export async function readCSV(fileCSVPath) {
  return new Promise((resolve, reject) => {
    const csvData = [];
    const formattedCSVData = [];

    fs.createReadStream(fileCSVPath)
      .pipe(parse({ delimiter: ";" }))
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", async () => {
        const headers = csvData[0];
        for (let i = 1; i < csvData.length; i++) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = csvData[i][j];
          }
          formattedCSVData.push(obj);
        }
        resolve(formattedCSVData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
