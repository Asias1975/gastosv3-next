'use client'

import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const entrar = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { prompt: 'select_account' }, },
    })
  }

  return (
    <main style={{ maxWidth: 360, margin: '80px auto', textAlign: 'center' }}>
      <h1>Gastos</h1>
      <button onClick={entrar}>Continuar con Google</button>
    </main>
  )
}