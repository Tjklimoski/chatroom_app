const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

const time = timeFormatter.format(Date.now());

export function createMsg(msg, name) {
  return {
    msg,
    name,
    time,
  };
}
