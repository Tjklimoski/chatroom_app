const users = [];

export function createUser(id, name, room) {
  const user = {
    id,
    name,
    room,
  };
  users.push(user);
  return user;
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function findUsersInRoom(room) {
  return users.filter((user) => user.room === room);
}

export function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);
  // remove the user from the array (db), return the removed user
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
