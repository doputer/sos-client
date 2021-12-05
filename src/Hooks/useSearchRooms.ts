import { useCallback, useEffect, useState } from 'react';

const useSearchRooms = (floorId: number | null = null) => {
  const [data, setData] = useState([]);

  const fetchRooms = useCallback(async () => {
    if (floorId === null) return;

    const response = await fetch(
      `${process.env.REACT_APP_SERVER_BASE_URL}/rooms/search?floorId=${floorId}`,
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
    fetchRooms();
  }, [fetchRooms]);

  return [data, setData, fetchRooms];
};

export default useSearchRooms;
