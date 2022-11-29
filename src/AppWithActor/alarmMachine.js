import { assign, createMachine, spawn } from 'xstate';
import { timerMachine } from './timerMachine';

export const alarmMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEEA2BDATgWwMTIBECBtABgF1FQAHAe1gEsAXB2gOypAA9EAWAJgA0IAJ6J+Adn4A6AGy9ZADn6leAVkWKJAZn4BfPcLRZs0gJIRUYXGUpIQdRi3aceCAIy9F0tWv7bFdW0pAE4Q3glhMQ8JEOltWXdZMOD3VUSDIwwcaWQICEhcACUAUQBZAHkANRLbTkdmVg57NyTZORD3d35k0hD+EO0kqMRlaRCJVXcdBTCug0MQNloC+HtjHHr6RpcWxABaWRGEQ8yQDdMLKy2nJtdENTidfn40tS9edR6j0UQu9x8pAkCkUslI2gEilI7jOF1y+UgNx2zVAbgG2mk7neWOBgWm7m0x2mcQSvHcITUEi0Ggkam0Cz0QA */
  createMachine({
    context: { alarmIndex: 0, alarmList: [] },
    on: {
      ADD: {
        target: '.Added',
        actions: assign({
          alarmIndex: (context) => context.alarmIndex + 1,
          alarmList: (context) => {
            const timerId = 'timer-' + context.alarmIndex;
            const newAlarm = {
              timerId,
              timerRef: spawn(timerMachine, timerId),
            };
            return [...context.alarmList, newAlarm];
          },
        }),
      },
    },
    initial: 'Idle',
    states: {
      Idle: {
        always: {
          target: 'Added',
          cond: (context) => context.alarmList.length > 0,
        },
      },
      Added: {
        on: {
          REMOVE: {
            target: 'Idle',
            actions: assign({
              alarmList: (context, event) => {
                return context.alarmList.filter((alarm) => alarm.timerId !== event.timerId);
              },
            }),
          },
        },
      },
    },
    id: 'Alarm',
  });
