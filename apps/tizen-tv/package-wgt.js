import archiver from "archiver";
import fs from "fs";
import path from "path";

const output = fs.createWriteStream(path.join("dist", "casting-tizen.wgt"));
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`Tizen WGT package created: ${archive.pointer()} total bytes`);
});

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);
archive.directory("dist/", false);
archive.file("tizen-manifest.xml", { name: "tizen-manifest.xml" });
archive.finalize();
