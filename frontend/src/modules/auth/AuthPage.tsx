import { useState, type FormEvent } from 'react'
import { ArrowRight, Check, Eye, EyeOff, ListTodo } from 'lucide-react'

type Notice = {
  kind: 'success' | 'info'
  text: string
}

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isRegistering) {
      const formData = new FormData(event.currentTarget)
      const email = String(formData.get('email')).trim().toLowerCase()
      const confirmEmail = String(formData.get('confirmEmail')).trim().toLowerCase()
      const password = formData.get('password')
      const confirmPassword = formData.get('confirmPassword')

      if (email !== confirmEmail) {
        setNotice({ kind: 'info', text: 'Los correos electrónicos no coinciden.' })
        return
      }

      if (password !== confirmPassword) {
        setNotice({ kind: 'info', text: 'Las contraseñas no coinciden.' })
        return
      }

      setNotice({
        kind: 'info',
        text: 'El registro estará disponible pronto :)',
      })
      return
    }

    setNotice({
      kind: 'info',
      text: 'El acceso estará disponible pronto :).',
    })
  }

  function handleRecovery() {
    setNotice({
      kind: 'info',
      text: 'La recuperación de contraseña estará disponible pronto :)',
    })
  }

  function toggleMode() {
    setIsRegistering((registering) => !registering)
    setShowPassword(false)
    setShowConfirmation(false)
    setNotice(null)
  }

  return (
    <main className="auth-shell">
      <section className="welcome-panel" aria-label="Taskwork">
        <div className="welcome-topline">
          <a className="brand" href="#inicio" aria-label="Taskwork, inicio">
            <span className="brand-mark"><ListTodo size={21} strokeWidth={2.2} /></span>
            <span>taskwork</span>
          </a>
          <span className="edition-label">TU ESPACIO DE TRABAJO</span>
        </div>

        <div className="welcome-copy">
          <p className="eyebrow"><span /> MENOS RUIDO, MÁS AVANCE</p>
          <h1>Las ideas también necesitan <em>un lugar.</em></h1>
          <p className="welcome-description">
            Ordena lo que tienes en mente y haz espacio para lo que sigue.
          </p>
        </div>

        <div className="task-preview" aria-label="Vista previa de tareas">
          <div className="preview-heading">
            <span>Tu día, en orden</span>
            <span className="preview-date">HOY · 3 PENDIENTES</span>
          </div>
          <div className="preview-task">
            <span className="task-check"><Check size={13} /></span>
            <span>Preparar propuesta</span>
            <span className="task-time">09:30</span>
          </div>
          <div className="preview-task">
            <span className="task-check task-check-empty" />
            <span>Revisar notas del equipo</span>
            <span className="task-time">11:00</span>
          </div>
          <div className="preview-task preview-task-muted">
            <span className="task-check task-check-empty" />
            <span>Planear la próxima semana</span>
            <span className="task-time">15:15</span>
          </div>
          <div className="preview-progress"><span /></div>
        </div>

        <p className="welcome-footer">Un paso a la vez. Lo demás puede esperar.</p>
        <span className="panel-sunburst" aria-hidden="true" />
      </section>

      <section className="form-panel" id="inicio">
        <div className="mobile-brand">
          <span className="brand-mark"><ListTodo size={20} strokeWidth={2.2} /></span>
          <span>taskwork</span>
        </div>

        <div className="form-content">
          <div className="form-heading">
            <p className="eyebrow form-eyebrow">
              {isRegistering ? 'EMPIEZA A ORGANIZARTE' : 'QUÉ BUENO TENERTE DE VUELTA'}
            </p>
            <h2>{isRegistering ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
            <p>
              {isRegistering
                ? 'Completa tus datos para crear tu espacio de trabajo.'
                : 'Entra a tu espacio y retoma donde lo dejaste.'}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">Correo electrónico</label>
            <input
              className="text-input"
              id="email"
              name="email"
              type="email"
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />

            {isRegistering && (
              <div className="confirm-field">
                <label className="field-label" htmlFor="confirmEmail">Confirmar correo electrónico</label>
                <input
                  className="text-input"
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  placeholder="Repite tu correo electrónico"
                  autoComplete="off"
                  required
                />
              </div>
            )}

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">Contraseña</label>
              {!isRegistering && (
                <button className="recovery-link" type="button" onClick={handleRecovery}>
                  ¿La olvidaste?
                </button>
              )}
            </div>
            <div className="password-wrap">
              <input
                className="text-input password-input"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Escribe tu contraseña"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                required
              />
              <button
                className="visibility-button"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isRegistering && (
              <>
                <label className="field-label confirm-field" htmlFor="confirmPassword">
                  Confirmar contraseña
                </label>
                <div className="password-wrap">
                  <input
                    className="text-input password-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmation ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    className="visibility-button"
                    type="button"
                    onClick={() => setShowConfirmation((visible) => !visible)}
                    aria-label={showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                    aria-pressed={showConfirmation}
                  >
                    {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            )}

            <button className="submit-button" type="submit">
              {isRegistering ? 'Crear cuenta' : 'Entrar'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="notice-slot" aria-live="polite">
            {notice && <p className={`notice notice-${notice.kind}`}>{notice.text}</p>}
          </div>

          <p className="account-switch">
            {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
            <button type="button" onClick={toggleMode}>
              {isRegistering ? 'Iniciar sesión' : 'Registrarse?'}
            </button>
          </p>

          <div className="form-bottom">
            <span className="bottom-line" />
            <p>Tu siguiente paso empieza aquí.</p>
          </div>
        </div>

        <p className="legal-note">TASKWORK <span>·</span> ORGANIZA A TU MANERA</p>
      </section>
    </main>
  )
}