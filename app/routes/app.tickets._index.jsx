import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import prisma from "../db.server";

export async function loader() {
  const sessions = await prisma.session.findMany();
  return json(sessions);
}

export async function action({ request }) {
  const formData = await request.formData();

  const id = formData.get("id");
  const shop = formData.get("shop");
  const state = formData.get("state");
  const expires = new Date(); // Current date and time

  if (!shop || !state) {
    throw new Response("Shop and State are required", { status: 400 });
  }

  const newSession = await prisma.session.create({
    data: {
      id,
      shop,
      state,
      expires,
      accessToken: "access_token",
    },
  });

  return redirect("/app/tickets");
}

const SessionsList = () => {
  const sessions = useLoaderData();
  const [formError, setFormError] = useState(null);

  return (
    <div>
      <h1>Tickets</h1>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Inquiry
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.filter((session) => session.state !== "").length > 0 ? (
              sessions
                .filter((session) => session.state !== "") // Filter sessions by state
                .map((session) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={session.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {session.id}
                    </th>
                    <td className="px-6 py-4">{session.shop}</td>
                    <td className="px-6 py-4">{session.state}</td>
                    <td className="px-6 py-4">{session.expires.split("T")[0]}</td>
                    <td className="px-6 py-4">
                      <Link to={`/app/tickets/${session.id}`}>
                        Check Details
                      </Link>
                    </td>
                  </tr>
                ))
            ) : (
              <li>No tickets data found</li>
            )}
          </tbody>
        </table>
      </div>

      <h2>Create New Tickets</h2>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      <Form method="post">
        <div>
          <label htmlFor="shop">Id:</label>
          <input
            type="text"
            id="id"
            name="id"
            required
            value={sessions.length}
          />
        </div>
        <div>
          <label htmlFor="shop">Inquiry:</label>
          <input type="text" id="shop" name="shop" required />
        </div>
        <div>
          <label htmlFor="state">Status:</label>
          <input type="text" id="state" name="state" required />
        </div>
        {/* Expires will be set automatically */}
        <button type="submit">Create</button>
      </Form>
    </div>
  );
};

export default SessionsList;
