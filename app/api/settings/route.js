import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const username = session.user.name; // GitHub username

  try {
    const result = await pool.query(
      "SELECT ai_weight, trust_weight, auto_merge_threshold FROM user_settings WHERE github_username = $1",
      [username]
    );
    
    if (result.rows.length > 0) {
      return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } else {
      // Return defaults if they haven't saved anything yet
      return new Response(JSON.stringify({ ai_weight: 35, trust_weight: 25, auto_merge_threshold: 85 }), { status: 200 });
    }
  } catch (error) {
    return new Response("Database error", { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const username = session.user.name;
  const { ai_weight, trust_weight, auto_merge_threshold } = await req.json();

  try {
    await pool.query(
      `INSERT INTO user_settings (github_username, ai_weight, trust_weight, auto_merge_threshold) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (github_username) 
       DO UPDATE SET ai_weight = $2, trust_weight = $3, auto_merge_threshold = $4, updated_at = CURRENT_TIMESTAMP`,
      [username, ai_weight, trust_weight, auto_merge_threshold]
    );
    return new Response("Settings saved", { status: 200 });
  } catch (error) {
    return new Response("Database error", { status: 500 });
  }
}
