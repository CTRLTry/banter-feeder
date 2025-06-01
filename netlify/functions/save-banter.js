import fs from "fs";
import path from "path";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const newLine = JSON.parse(event.body);
  const filePath = path.resolve("banter_lines.json");

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    data.push(newLine); // Add the new line to the array
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Failed to save:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
