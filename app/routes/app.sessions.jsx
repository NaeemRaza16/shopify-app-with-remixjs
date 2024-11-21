import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
// import { Redirect } from "@shopify/app-bridge/actions";
import prisma from "../db.server";

export async function loader() {
  const sessions = await prisma.session.findMany();
  return json(sessions);
}

const SessionsList = () => {
  const sessions = useLoaderData();
  const app = useAppBridge(); // Access the App Bridge instance

  // const handleNavigation = (id) => {
  //   const redirect = Redirect.create(app);
  //   redirect.dispatch(
  //     Redirect.Action.APP,
  //     `/apps/ticket-booking-system/app/sessions/${id}`
  //   );
  // };

  return (
    <div>
      <h1>Sessions</h1>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <Link to={`/app/sessions/${session.id}`}>
              {session.shop} - {session.state}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsList;
