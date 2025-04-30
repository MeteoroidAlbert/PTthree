import * as AllModels from "./Model/index.jsx";

export const componentMap = Object.fromEntries(
    Object.entries(AllModels).map(([name, comp]) => [name, comp])
);