export default async function fetchData(loaded, url, retries = 5, delay = 1000) {
  if (!loaded) {
    console.log(`Waiting ${delay / 1000} seconds before retrying...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchData(loaded, url, retries - 1, delay * 2);
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return { data };
  } catch (error) {
    if (retries > 0) {
      console.log(
        `Retrying in ${delay / 1000} seconds... (${retries} attempts left)`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData(loaded, url, retries - 1, delay * 2);
    } else {
      console.log('Max retries reached. Giving up.');
      return false;
    }
  }
}