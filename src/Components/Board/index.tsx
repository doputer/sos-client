import './index.scss';

import { Button, message, Popconfirm } from 'antd';
import { postSeatReservation } from 'Apis/reservationApi';
import {
  EMPTY,
  FACILITY,
  RESERVED_SEAT,
  ROOM,
  SEAT,
} from 'Constants/object-type';
import useAsync from 'Hooks/useAsync';
import { ICol } from 'Interfaces/IBoard';
import { useEffect, useState } from 'react';

type PropsTypes = {
  userId: number;
  board: ICol[][];
  seatsRefetch: () => void;
};

export const Board = ({
  userId,
  board,
  seatsRefetch,
}: PropsTypes): JSX.Element => {
  const [reservation, setReservation] = useState({
    userId,
    seatId: 0,
  });
  const [state, refetch] = useAsync(
    () => postSeatReservation(reservation),
    [],
    true,
  );

  useEffect(() => {
    message.info('좌석을 선택해주세요.', 1);
  }, []);

  useEffect(() => {
    if (state.error) message.error('예약할 수 없습니다.');
    else if (state.data)
      message.success('예약 되었습니다.', 0.5, () => seatsRefetch());
  }, [state]);

  const transformLength = (type: number, length: number) => {
    if (type === ROOM) {
      if (length === 0) return `0px`;
      else return `${length * 50 + 10 * (length - 1)}px`;
    } else return `${length * 50}px`;
  };

  const itemClass = (type: number) => {
    switch (type) {
      case EMPTY:
        return 'empty';
      case SEAT:
        return 'seat';
      case ROOM:
        return 'room';
      case FACILITY:
        return 'facility';
      case RESERVED_SEAT:
        return 'reserved-seat';
    }
  };

  return (
    <div className="board-cover">
      {board.map((row: ICol[], y: number) =>
        row.map((col: ICol, x: number) => {
          return (
            <div
              key={x + y * row.length}
              className={`flex-center arrangement-item ${itemClass(col.type)}`}
              style={{
                width: transformLength(col.type, col.width),
                height: transformLength(col.type, col.height),
                left: `${x * 50 + x * 10}px`,
                top: `${y * 50 + y * 10}px`,
              }}
            >
              {col.type === SEAT ? (
                <Popconfirm
                  placement="top"
                  title={'이 좌석을 예약하시겠습니까?'}
                  onConfirm={() => refetch()}
                  okText="네"
                  cancelText="아니오"
                >
                  <Button
                    onClick={() => {
                      setReservation({ ...reservation, seatId: col.id });
                    }}
                    className="flex-center arrangement-button"
                  >
                    {col.name}
                  </Button>
                </Popconfirm>
              ) : (
                <>
                  {col.type === FACILITY ? (
                    <img className="facility-image" src={col.name} alt="" />
                  ) : (
                    col.name
                  )}
                </>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};
