export async function getStatus() {
  let error;
  try {
    const res = await fetch("/api/status");
    if (res.status !== 200) {
      error = new Error(res.statusText);
    }
  } catch (err) {
    error = err;
  } finally {
    if (error) {
      throw error;
    } else {
      return "ok";
    }
  }
}
