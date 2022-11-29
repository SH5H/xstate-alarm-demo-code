import React, { useEffect, useState } from 'react';

export const Alarm = ({ onDelete, index }) => {
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);

      if (elapsed === duration) {
        console.log('end');
        clearInterval(interval);
        setIsRunning(false);
      }

      return () => clearInterval(interval);
    }
  }, [isRunning, elapsed]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    const duration = target[0].value;

    setDuration(Number(duration));
  };

  const handleOnPlay = () => {
    setIsRunning(true);
  };

  const handleOnPause = () => {
    setIsRunning(false);
  };

  const handleInitialize = () => {
    setElapsed(0);
    setIsRunning(false);
  };

  const isWaiting = duration === undefined;
  const isDone = duration !== undefined && elapsed >= duration;
  const isPlayable = duration !== undefined && elapsed < duration;
  const isPause = isPlayable && !isRunning;
  const isPlaying = isPlayable && isRunning;

  return (
    <>
      <p>{index} 번째 알람</p>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: '500px',
          height: '100px',
          border: '1px solid white',
        }}
      >
        {isWaiting ? (
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
            <button type="reset" onClick={onDelete}>
              삭제
            </button>
          </form>
        ) : null}
        {isPlaying ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>남은 시간: {duration - elapsed}</div>
            <button onClick={handleOnPause}>정지</button>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        ) : null}
        {isPause ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>남은 시간: {duration - elapsed}</div>
            <button onClick={handleOnPlay}>재생</button>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        ) : null}
        {isDone ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <div>완료</div>
            <button onClick={handleInitialize}>초기화</button>
            <button onClick={onDelete}>삭제</button>
          </div>
        ) : null}
      </div>
    </>
  );
};
