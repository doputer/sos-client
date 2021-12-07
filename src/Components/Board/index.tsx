import { Button, message, Popconfirm } from 'antd';
import {
  EMPTY,
  FACILITY,
  RESERVED_SEAT,
  ROOM,
  SEAT,
} from 'Constants/object-type';
import { fetchSeatReservation } from 'Functions/fetchSeatReservation';
import { ICol } from 'Interfaces/IBoard';
import { Dispatch, SetStateAction } from 'react';

type PropsTypes = {
  board: ICol[][];
  setBoard: Dispatch<SetStateAction<ICol[][]>>;
};

export const Board = ({ board, setBoard }: PropsTypes): JSX.Element => {
  const transformLength = (type: number, length: number) => {
    if (type === ROOM) {
      if (length === 0) return `0px`;
      else return `${length * 50 + 10 * (length - 1)}px`;
    } else return `${length * 50}px`;
  };

  const itemStyle = (type: number) => {
    if (type === EMPTY || type === FACILITY)
      return { backgroundColor: '#f5f5f5', borderRadius: '4px' };
    else if (type === SEAT)
      return {
        backgroundColor: '#51bf60',
        color: '#fff',
        borderRadius: '4px',
      };
    else if (type === ROOM)
      return {
        backgroundColor: '#E5E5E5',
        borderRadius: '4px',
      };
    else if (type === RESERVED_SEAT)
      return {
        backgroundColor: '#a0a0a0',
        color: '#fff',
        borderRadius: '4px',
      };
  };

  const facilityStyle = { width: '100%', height: '100%', opacity: '60%' };

  const handleSeatReservation = async (seatId: number) => {
    try {
      const { seat, user } = await fetchSeatReservation({
        userId: 201,
        seatId,
      });

      setBoard(
        board.map((row: ICol[], y: number) =>
          row.map((col: ICol, x: number) => {
            if (x === seat.x && y === seat.y)
              return { ...col, name: user.name, type: RESERVED_SEAT };

            return col;
          }),
        ),
      );

      message.success('예약 되었습니다.', 0.5);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      {board.map((row: ICol[], y: number) =>
        row.map((col: ICol, x: number) => {
          return (
            <div
              key={x + y * row.length}
              className="flex-center"
              style={{
                ...itemStyle(col.type),
                position: 'absolute',
                width: transformLength(col.type, col.width),
                height: transformLength(col.type, col.height),
                left: `${x * 50 + 10 * x}px`,
                top: `${y * 50 + 10 * y}px`,
              }}
            >
              {col.type === SEAT ? (
                <Popconfirm
                  placement="top"
                  title={'이 좌석을 예약하시겠습니까?'}
                  onConfirm={() => {
                    handleSeatReservation(col.id);
                  }}
                  okText="네"
                  cancelText="아니오"
                >
                  <Button
                    className="flex-center"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#fff',
                    }}
                  >
                    {col.name}
                  </Button>
                </Popconfirm>
              ) : (
                <>
                  {col.type === FACILITY ? (
                    <img style={facilityStyle} src={col.name} alt="" />
                  ) : col.type !== FACILITY ? (
                    col.name
                  ) : null}
                </>
              )}
            </div>
          );
        }),
      )}
    </>
  );
};
