import { assign, createMachine } from 'xstate';

export const timerMachine2 =
  /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBbMAnAsgQwGMALVAOzAGIAlAUQGUbkBtABgF1FQAHAe1lQAuqHqU4gAHogBsUgKwA6AIyKALAE4AzBsVqWKvVIA0IAJ6Jd8lQHZZstSocAOWRtlWAvu+NpMuQiXJ5AHc8QTIoCjoAVQAhHABJZnYxXn4hETFJBBUpRXk1ACYNRwMNfUUCxWMzBABaFQ15KQKi3LsWMqsC2U9vDGx8YjIweQAFABs8EzwAI3HKCBER2AE8ARGfAf9hscnpubBWDiQQVLCMk6zZAsd5Fh0pLrtFEpYjU0QWgvyNK0crbRlHJyFS9ECbPxDQITKazea7KbhCjIADyAHE0QAZGhHFJ8c6iS6IDQsO6PX7FKQaKQ5NSFaqfDTfFRFKyKaksNyORwFDxecH9SEBEYw-bw0VI3EnM7pQmgLK1SryWRSNRWFQlDWqtSOakMhDsvJqFXsrSyRSc7SOMEQwbChFikV7JHIeIAYQA0lLuPjZZlEIqWKSWFYdVIWEVZBq9LJ9corPIrH8DN0iro5DbBXadqK4SK8ABXWCQZHorE45LS33COUSRDXJoqWTOY1yVW8gpxxxGjR01Q8qNqCoaTz80g8CBwMS27bkPFpGv+uoFNRSO6hxzhyPRpv62rs752XlSRw5dTq1SZ3zZwIhMKkKDzglLmQqeQk5QFVXKbSKKxxhsmy0Lo2VPFocivLYoSdWEDifP0iWXDV1zDCNXB3WMPgQG55BKKwqU0JN8IpHp+RnaCHTzB1wngxdEP3Rw1HkG41RcZN8PufUbjyEDfnUeMXj5Ppr1nGDHTGQtiwgWiLnlRA-zXIdFCpblaRXCouK-d8NQaakLxcexIKFHM9iolEADdsCETAZNrLIFPyZQVNPdsh07LD2VJKwWB5Rimx0bkbCMm8RgAESWWyXzZfJORpP5mwtVVNO+Qj-kBBwZDcUd3CAA */
  createMachine(
    {
      context: { duration: 0, elapsed: undefined },
      on: {
        RESET: {
          target: '.waiting',
        },
      },
      initial: 'waiting',
      states: {
        waiting: {
          on: {
            SUBMIT: {
              target: 'Playable',
              actions: assign({
                duration: (_, event) => event.duration,
                elapsed: 0,
              }),
            },
          },
        },
        Playable: {
          initial: 'Playing',
          states: {
            Playing: {
              invoke: {
                src: 'ticker',
              },
              always: {
                target: 'Overtime',
                cond: (context) => context.elapsed >= context.duration,
              },
              on: {
                TOGGLE: {
                  target: 'Paused',
                },
                TICK: {
                  actions: assign({
                    elapsed: (ctx) => ctx.elapsed + 1,
                  }),
                },
              },
            },
            Paused: {
              on: {
                TOGGLE: {
                  target: 'Playing',
                },
              },
            },
            Overtime: {
              type: 'final',
            },
          },
          onDone: {
            target: 'Done',
          },
        },
        Done: {},
      },
      id: 'TimerMachine',
    },
    {
      services: {
        ticker: (context, evnet) => (callback) => {
          const interval = setInterval(() => {
            if (context.elapsed < context.duration) {
              callback('TICK');
            }
          }, 1000);

          return () => clearInterval(interval);
        },
      },
    },
    {
      guards: {
        isExpired: (context) => context.elapsed >= context.duration,
      },
    },
  );
