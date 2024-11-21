import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

// import stylesheet from "./../tailwind.css?url";

// export const links = () => [
//   { rel: "stylesheet", href: stylesheet },
// ];

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Session Details
        </h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Id:</span> {session.id}
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Inquiry:</span>{" "}
            {session.shop}
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Status:</span>{" "}
            {session.state}
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-gray-900">Date:</span>{" "}
            {session.expires?.split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;
