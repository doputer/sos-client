import { useCallback, useEffect, useState } from 'react';

const useSearchFacilites = (floorId: number | null = null) => {
  const [data, setData] = useState([]);

  const fetchFacilities = useCallback(async () => {
    if (floorId === null) return;

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BASE_URL}/facilities/search?floorId=${floorId}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    const json = await response.json();
    setData(json);
  }, [floorId]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return [data, setData, fetchFacilities];
};

export default useSearchFacilites;
