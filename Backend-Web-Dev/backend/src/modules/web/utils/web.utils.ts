import fs from "fs";
import path from "path";
import { logError } from "@/shared/utils/log";

export const readData = (filePath: string) => {
  let jsonData = ""
  if (!fs.existsSync(filePath)) {
    logError("web.utils", "readData error: File not found!!!", filePath);
    return false;
  }
  
  try {
    jsonData = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    logError("web.utils", "readData error: File read error!!!", error);
    return false;
  }

  try {
    return JSON.parse(jsonData);
  } catch (error) {
    logError("web.utils", "readData error: JSON parse error!!!", error);
    return false;
  }
};

export const writeData = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    logError("web.utils", "writeData error: File write error!!!", error);
    return false;
  }
};
