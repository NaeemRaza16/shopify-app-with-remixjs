import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

export async function loader({ params }) {
  const { id } = params;
  const session = await prisma.session.findUnique({
    where: {
      id: id,
    },
  });

  if (!session) {
    throw new Response("Session not found", { status: 404 });
  }

  return json(session);
}

const SessionDetail = () => {
  const session = useLoaderData();

  return (
    <div>
      <h1>Session Details</h1>
      <p>
        <strong>Id:</strong> {session.id}
      </p>
      <p>
        <strong>Shop:</strong> {session.shop}
      </p>
      <p>
        <strong>Status:</strong> {session.state}
      </p>
      <p>
        <strong>Expires:</strong> {session.expires}
      </p>
    </div>
  );
};

export default SessionDetail;
