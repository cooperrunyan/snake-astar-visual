export const wait = async (ms: number) => (ms !== 0 ? new Promise(resolve => setTimeout(resolve, ms)) : null);
