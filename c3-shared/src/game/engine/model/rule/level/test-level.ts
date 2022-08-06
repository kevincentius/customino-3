
export const testLevel = {
  frame: {
    parallel: [
      {
        serial: [
          { wait: 2 },
          {
            dialog: {
              character: 'kevincentius',
              text: `Let's play! Attacks will come in bursts, you have to survive 20 waves in a row!`,
            }
          },
          { wait: 3 },
          {
            dialog: {
              text: 'Here comes the first wave!'
            }
          },
        ]
      },
      {
        spawn: {
          character: 'kevincentius',
          frame: {
            serial: [
              {
                var: {
                  name: 'power',
                  set: 20,
                }
              },
              {
                repeatCount: 19,
                repeat: {
                  serial: [
                    { wait: 6 },
                    { sendAll: [
                      { type: 'dirty', power: { var: { name: 'power' } } },
                    ] },
                    { var: {
                      name: 'power',
                      add: 0.5,
                    } },
                    { wait: 4 },
                  ]
                }
              }
            ]
          }
        }
      }
    ]
  }
}
