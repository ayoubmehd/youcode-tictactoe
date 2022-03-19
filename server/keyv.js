import Keyv from "keyv";

export default new Keyv("sqlite://database.sqlite", {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});
