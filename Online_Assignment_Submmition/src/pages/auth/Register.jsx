import Button from '../../components/Button.jsx'

// Replaces self-service signup with the university's administrator-controlled account process.
function Register({ onNavigate }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-brand-cream px-4 py-10">
      <section aria-labelledby="registration-title" className="w-full max-w-xl rounded-3xl border border-brand-silver bg-white p-6 text-center shadow-sm sm:p-10">
        <img alt="Mekdela Amba University logo" className="mx-auto mb-6 h-20 w-auto rounded-full border-4 border-brand-gold object-cover" src="/logo.png" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-royal">Account registration</p>
        <h1 className="mt-2 text-3xl font-bold text-brand-navy" id="registration-title">Accounts are created by the university administrator.</h1>
        <p className="mt-4 leading-7 text-brand-dark">Contact the registrar/admin if you do not have one. Public self-service registration is unavailable.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => onNavigate('login')}>Go to log in</Button>
          <Button onClick={() => onNavigate('home')} variant="outline">Back to home</Button>
        </div>
      </section>
    </main>
  )
}

export default Register
