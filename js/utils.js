export function getValidJson(method, value) {
  try {
    switch (method) {
      case "stringify":
        return JSON.stringify(value);
      case "parse":
        return JSON.parse(value);
      default:
        break;
    }
  } catch (err) {
    alert(err);
  }
}
