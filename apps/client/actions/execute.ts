// "use server";

// import { PISTON_API_URL } from "@/lib/constants";

// const PISTON_API_KEY = process.env.PISTON_API_KEY;

// interface ExecuteInput {
//   args?: string[];
//   code: string;
//   language: string;
//   stdin?: string;
// }

// export async function executeCode(input: ExecuteInput) {
//   if (!input.code) {
//     throw new Error("Code is required");
//   }

//   if (!input.language) {
//     throw new Error("Language is required");
//   }

//   const response = await fetch(PISTON_API_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...(PISTON_API_KEY && { Authorization: PISTON_API_KEY }),
//     },
//     body: JSON.stringify({
//       language: input.language.toLowerCase(),
//       version: "*",
//       files: [{ content: input.code }],
//       stdin: input.stdin || "",
//       args: Array.isArray(input.args) ? input.args : [],
//       run_timeout: 30_000,
//       compile_timeout: 30_000,
//     }),
//   });

//   if (!response.ok) {
//     const body = await response.text().catch(() => "");

//     let detail = body;
//     try {
//       const parsed = JSON.parse(body);
//       detail = parsed.message || JSON.stringify(parsed, null, 2);
//     } catch {
//       // body is not JSON, use as-is
//     }

//     const message = [
//       response.status,
//       detail,
//       "",
//       "This language is not supported or the execution server is down.",
//       "To change language, select language via the dropdown in the bottom right corner.",
//     ].join("\n");

//     return {
//       language: input.language,
//       version: "*",
//       run: {
//         stdout: "",
//         stderr: message,
//         code: 1,
//         signal: null,
//         output: message,
//       },
//       metadata: {
//         args: input.args || [],
//         stdin: input.stdin || "",
//         timestamp: new Date().toISOString(),
//       },
//     };
//   }

//   const data = await response.json();

//   return {
//     ...data,
//     metadata: {
//       args: input.args || [],
//       stdin: input.stdin || "",
//       timestamp: new Date().toISOString(),
//     },
//   };
// }
"use server";

import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

interface ExecuteInput {
  code: string;
  language: string;
}

export async function executeCode(input: ExecuteInput) {
  const lang = input.language.toLowerCase();

  return new Promise((resolve) => {
    const tempDir = os.tmpdir();

    let filePath = "";
    let command = "";
    let resultType: "code" | "html" = "code";

    // 🔹 Python
    if (lang === "python") {
      filePath = path.join(tempDir, "temp.py");
      fs.writeFileSync(filePath, input.code);
      command = `python "${filePath}"`;
    }

    // 🔹 JavaScript
    else if (lang === "javascript" || lang === "node") {
      filePath = path.join(tempDir, "temp.js");
      fs.writeFileSync(filePath, input.code);
      command = `node "${filePath}"`;
    }

    // 🔥 JAVA
    else if (lang === "java") {
      const classNameMatch = input.code.match(/public\s+class\s+(\w+)/);
      const className = classNameMatch?.[1] || "Main";

      filePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(filePath, input.code);

      command = `javac "${filePath}" && java -cp "${tempDir}" ${className}`;
    }

    // 🔥 C++
    else if (lang === "cpp" || lang === "c++") {
      filePath = path.join(tempDir, "temp.cpp");
      fs.writeFileSync(filePath, input.code);

      const exePath = path.join(tempDir, "temp.exe");
      command = `g++ "${filePath}" -o "${exePath}" && "${exePath}"`;
    }

    // 🌐 HTML (NEW)
    else if (lang === "html") {
      resultType = "html";

      return resolve({
        run: {
          stdout: input.code,
          stderr: "",
          code: 0,
          output: input.code,
        },
        type: "html",
      });
    } else {
      return resolve({
        run: {
          stdout: "",
          stderr: "Language not supported",
          code: 1,
          output: "Language not supported",
        },
      });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          run: {
            stdout: "",
            stderr: stderr || error.message,
            code: 1,
            output: stderr || error.message,
          },
        });
      }

      resolve({
        run: {
          stdout,
          stderr: "",
          code: 0,
          output: stdout,
        },
      });
    });
  });
}
