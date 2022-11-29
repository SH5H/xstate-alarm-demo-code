import { useActor } from '@xstate/react';

export const Alarm = ({ onDelete, clock }) => {
  const { timerId, timerRef } = clock;
  const [state, send] = useActor(timerRef);

  const leftTime = state.context.duration - state.context.elapsed;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const duration = Number(event.currentTarget[0].value);
    send({ type: 'SUBMIT', duration });
  };

  const handleOnPlay = () => {
    send('TOGGLE');
  };

  const handleOnPause = () => {
    send('TOGGLE');
  };

  const handleInitialize = () => {
    send('RESET');
  };

  const handleOnDelete = () => {
    send({ type: 'DELETE', timerId });
  };

  return (
    <>
      <p>알람: {timerId}</p>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: '500px',
          height: '100px',
          border: '1px solid white',
        }}
      >
        {state.matches('waiting') ? (
          <form
            onSubmit={handleOnSubmit}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <input
              type="number"
              defaultValue={10}
              maxLength={4}
              min="5"
              max="9999"
              step="1"
              placeholder="0000"
              pattern="[0-9]{4}"
              required={true}
            />
            <button type="submit">등록</button>
            <button type="reset" onClick={handleOnDelete}>
              삭제
            </button>
          </form>
        ) : null}
        {state.matches('playing') ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>남은 시간: {leftTime}</div>
            <button onClick={handleOnPause}>정지</button>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={handleOnDelete}>삭제</button>
          </div>
        ) : null}
        {state.matches('paused') ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>남은 시간: {leftTime}</div>
            <button onClick={handleOnPlay}>재생</button>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={handleOnDelete}>삭제</button>
          </div>
        ) : null}
        {state.matches('done') ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>완료</div>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={handleOnDelete}>삭제</button>
          </div>
        ) : null}
      </div>
    </>
  );
};
