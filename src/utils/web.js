import axios from 'axios';

async function loadUrl(url) {
  try {
    return await axios.get(url);
  } catch (e) {
    return e.message;
  }
}

export async function get(url) {
  const content = await loadUrl(url);
  console.log('Content is ' + content);
}
