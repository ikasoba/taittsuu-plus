import { scriptContext, documentContext } from "./context.js";

await Promise.all([scriptContext.rebuild(), documentContext.rebuild()]);

await Promise.all([scriptContext.dispose(), documentContext.dispose()]);
