import { useState, useCallback } from "react";

function useAsyncError() {
  const [, setError] = useState();
  return useCallback(err => {
    setError(() => {
      throw err;
    });
  }, []);
}

export default useAsyncError;
