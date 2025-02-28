import axios from "axios";

export async function GET(req) {
  try {
    const response = await axios.get(
      "http://api.byteheart.com/api/Categories/GetAll"
    );
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
