import { login } from "@/app/lib/actions"

export default function LoginPage() {
  return (
    <form action={login as any}>
      <input
        type="text"
        name="username"
        className="bg-black border-white border-solid border-2"
        placeholder="Usernmame"
      />
      <input
        type="password"
        name="password"
        className="bg-black border-white border-solid border-2"
        placeholder="password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
