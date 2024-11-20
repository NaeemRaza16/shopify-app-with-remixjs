import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Layout } from "@shopify/polaris";
import React from "react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader() {
  // Fetch all data from the Session model
  const sessions = await prisma.session.findMany();
  // Return the data as JSON
  return json(sessions);
}

// export async function action({ request }) {
//   const formData = await request.formData();

//   //   await updateUser(user.id, {
//   //     name: formData.get("displayName"),
//   //     email: formData.get("email"),
//   //   });

//   return json({
//     name: formData.get("displayName"),
//     email: formData.get("email"),
//   });
// }

const Test = () => {
  const sessions = useLoaderData();

  console.log(sessions);

  return (
    <Layout>
      <ui-title-bar title="Sessions">
        <button onClick={() => console.log("Secondary action")}>
          Secondary action
        </button>
        <button
          variant="primary"
          onClick={() => console.log("Primary action")}
        >
          Primary action
        </button>
      </ui-title-bar>
      <div>
        <h1>Session Data</h1>
        <ul>
          {sessions.map((session) => (
            <li key={session.id}>
              <strong>Id:</strong> {session.id} <br />
              <strong>inquiry:</strong> {session.shop} <br />
              <strong>Status:</strong> {session.state} <br />
              <strong>Date:</strong> {session.accessToken} <br />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Test;
