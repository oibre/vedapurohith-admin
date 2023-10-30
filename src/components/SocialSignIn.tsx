import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/FirebaseContext'

export interface ISocialSignInProps {
  enabled?: boolean
  setError: (error: string) => void
}

export function SocialSignIn({ enabled = true, setError }: ISocialSignInProps) {
  const { googleSignin, githubSignin } = useAuth()
  const navigate = useNavigate()

  async function handleGoogleLogin(): Promise<void> {
    try {
      setError('')
      await googleSignin()
      navigate('/')
    } catch {
      setError('Failed to log in with Google')
    }
  }

  return (
    <div className=" gap-2 flex justify-between flex-wrap">
      <button
        onClick={handleGoogleLogin}
        disabled={!enabled}
        className=" min-w-fit relative flex flex-grow  justify-center rounded-md border border-transparent bg-gray-100 py-4  px-9 text-sm font-medium transition-colors hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="inset-y-0 left-0 flex items-center ">
          <FaGoogle className="h-5 w-5 mr-5 text-gray-500 group-hover:text-gray-600" />
          Sign In with Google
        </span>
      </button>
    </div>
  )
}
