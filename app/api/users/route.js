// app/api/users/route.js

import db from "../../../lib/db";

// A helper function to wrap the db.all method in a promise
const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// The GET function, using async/await syntax
export async function GET(request) {
  try {
    const users = await getUsers(); // Wait for the database query to complete
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
