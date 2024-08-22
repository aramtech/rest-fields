// @ts-nocheck
const build = (await import("$/server/utils/utility_builder/index.js")).default;

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const obj = await build(__dirname, ".field.js");
export default obj;
