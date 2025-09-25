import { useEffect, useState } from "react";
import { fetchMcu } from "../utils/fetchMcu";
import { McuType } from "../utils/types";

const useFetchMcu = () => {
  const [mcu, setMcu] = useState<McuType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  const loadMcuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedMcu = await fetchMcu();
      setMcu(fetchedMcu);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadMcuData();
  }, []);

  return { mcu, loading, error };
};
export default useFetchMcu;
