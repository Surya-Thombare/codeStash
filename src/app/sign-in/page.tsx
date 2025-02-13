// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { useToast } from '@/hooks/use-toast'
// import { authClient } from "@/lib/auth-client"

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     try {
//       const { data, error } = await authClient.signIn.email({
//         email,
//         password,
//         // name,
//         callbackURL: "/"
//       }, {
//         onRequest: () => {
//           setIsLoading(true)
//           toast({
//             description: 'Creating your account...',
//           })
//         },
//         onSuccess: () => {
//           console.log('success')
//           toast({
//             description: 'Account created successfully! Please verify your email.',
//           })
//           router.push('/')
//         },
//         onError: (ctx) => {
//           toast({
//             variant: 'destructive',
//             description: ctx.error.message || 'Failed to create account',
//           })
//         },
//       })

//       if (error) {
//         throw error
//       }
//     } catch (error) {
//       console.error('Signup error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto max-w-md py-16">
//       <div className="space-y-6">
//         <div className="space-y-2 text-center">
//           <h1 className="text-3xl font-bold">Create Account</h1>
//           <p className="text-gray-500">Enter your details to create your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label htmlFor="name" className="text-sm font-medium">
//               Name
//             </label>
//             <Input
//               id="name"
//               type="text"
//               placeholder="Enter your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="email" className="text-sm font-medium">
//               Email
//             </label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="password" className="text-sm font-medium">
//               Password
//             </label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password (min 8 characters)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength={8}
//             />
//           </div>

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Creating Account...' : 'Sign Up'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   )
// }

import { Login } from "../login";

export default function SignInPage() {
  return <Login mode="signin" />;
}