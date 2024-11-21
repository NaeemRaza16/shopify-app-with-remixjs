import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import prisma from "../db.server";

// import stylesheet from "./../tailwind.css?url";

// export const links = () => [{ rel: "stylesheet", href: stylesheet }];

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
  // setIsFormOpen((prev) => !prev)
  return redirect("/app/tickets");
}

const SessionsList = () => {
  const sessions = useLoaderData();
  const [formError, setFormError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className={`w-full h-screen px-40 py-10 bg-white flex flex-col gap-10 transition-all duration-300 ${
          isFormOpen ? "bg-gray-300 opacity-30 pointer-events-none" : ""
        }`}
      >
        <div className="flex justify-between">
          <h1 className="text-3xl">Tickets</h1>
          <button
            className="bg-blue-700 ring-1 px-4 py-2 rounded-md text-white cursor-pointer"
            onClick={() => setIsFormOpen((prev) => !prev)}
          >
            Create Tickets
          </button>
        </div>
        <div className="relative overflow-x-auto ring-1 ring-gray-200 rounded-md">
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
                      <td className="px-6 py-4">
                        {session.expires?.split("T")[0]}
                      </td>
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
      </div>

      {isFormOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 w-[40%] h-[40%] p-4 rounded-md flex flex-col gap-8 ring-1">
          <div className="flex justify-between">
            <h2 className="text-xl">Create New Tickets</h2>
            <p
              className="text-xl cursor-pointer"
              onClick={() => setIsFormOpen((prev) => !prev)}
            >
              X
            </p>
          </div>
          {formError && <p style={{ color: "red" }}>{formError}</p>}
          <Form
            method="post"
            className="flex flex-col gap-6"
            onSubmit={() => setIsFormOpen(false)}
          >
            <div className="hidden" style={{ display: "none" }}>
              <label htmlFor="shop">Id:</label>
              <input
                type="text"
                id="id"
                name="id"
                required
                value={sessions.length}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="shop" className="text-lg">
                Inquiry
              </label>
              <input
                type="text"
                id="shop"
                name="shop"
                required
                className="py-1 px-2 h-12 rounded-md outline-none ring-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="state" className="text-lg">
                Status:
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="py-1 px-2 h-12 rounded-md outline-none ring-1"
              />
            </div>
            {/* Expires will be set automatically */}
            <button
              className="bg-blue-700 ring-1 px-4 py-2 text-lg rounded-md text-white"
              type="submit"
            >
              Submit
            </button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SessionsList;
