export const sleep = async (ms: number) => {
  const startTime = Date.now();
  const then = (resolve: (ms: number) => Promise<void>) => {
    setTimeout(() => {
      const endTime = Date.now();
      const actualSleepTime = endTime - startTime;
      resolve(actualSleepTime);
    }, ms);
  };
  return {
    then
  };
};
