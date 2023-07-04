import { scriptContext, documentContext } from "./context.js";

await Promise.all([scriptContext.watch(), documentContext.watch()]);
