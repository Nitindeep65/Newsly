import { useEffect, useState } from "react";

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  storeCallback: (state: T) => F
) => {
  const result = store(storeCallback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};