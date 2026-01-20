import {redirect} from "next/dist/client/components/redirect";

export default function Home() {
  redirect("/home");

  return (
      <h1>Here</h1>
  )
}
