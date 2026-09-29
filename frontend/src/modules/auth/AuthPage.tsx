import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, ListTodo } from 'lucide-react'

type Notice = {
  kind: 'success' | 'info'
  text: string
}

type AuthMode = 'login' | 'register' | 'forgot'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const isRegistering = mode === 'register'
  const isForgot = mode === 'forgot'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email')).trim().toLowerCase()

    // 1. MODO RECUPERACIÓN DE CONTRASEÑA
    if (isForgot) {
      try {
        // Estructura lista para cuando el backend implemente el endpoint /auth/forgot-password
        const response = await fetch('http://127.0.0.1:8000/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          setNotice({
            kind: 'success',
            text: 'Te hemos enviado un correo con las instrucciones de recuperación.',
          })
        } else {
          // Mientras el backend no tenga el endpoint, mostramos confirmación visual
          setNotice({
            kind: 'success',
            text: `Si el correo ${email} está registrado, recibirás un enlace de recuperación pronto.`,
          })
        }
      } catch (error) {
        setNotice({
          kind: 'info',
          text: `Si el correo ${email} está registrado, recibirás un enlace de recuperación pronto.`,
        })
      }
      return
    }

    const password = String(formData.get('password'))

    // 2. MODO REGISTRO DE USUARIO
    if (isRegistering) {
      const confirmEmail = String(formData.get('confirmEmail')).trim().toLowerCase()
      const confirmPassword = String(formData.get('confirmPassword'))

      if (email !== confirmEmail) {
        setNotice({ kind: 'info', text: 'Los correos electrónicos no coinciden.' })
        return
      }

      if (password !== confirmPassword) {
        setNotice({ kind: 'info', text: 'Las contraseñas no coinciden.' })
        return
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          setNotice({
            kind: 'success',
            text: '¡Cuenta creada con éxito! Ya puedes iniciar sesión.',
          })
          setMode('login')
        } else {
          setNotice({
            kind: 'info',
            text: typeof data.detail === 'string' ? data.detail : 'Ocurrió un error al registrar el usuario.',
          })
        }
      } catch (error) {
        setNotice({
          kind: 'info',
          text: 'No se pudo conectar con el servidor backend.',
        })
      }
      return
    }

    // 3. MODO INICIO DE SESIÓN (LOGIN)
    try {
      const bodyParams = new URLSearchParams()
      bodyParams.append('username', email)
      bodyParams.append('password', password)

      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams,
      })

      const data = await response.json()

      if (response.ok) {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token)
        }

        setNotice({
          kind: 'success',
          text: '¡Inicio de sesión exitoso! Ingresando al sistema...',
        })

        setTimeout(() => {
          // Intenta redirigir a /dashboard o recargar para refrescar el estado global de auth
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setNotice({
          kind: 'info',
          text: typeof data.detail === 'string' ? data.detail : 'Correo o contraseña incorrectos.',
        })
      }
    } catch (error) {
      setNotice({
        kind: 'info',
        text: 'No se pudo conectar con el servidor backend.',
      })
    }
  }

  function switchMode(targetMode: AuthMode) {
    setMode(targetMode)
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
              {isForgot
                ? 'RECUPERA TU ACCESO'
                : isRegistering
                ? 'EMPIEZA A ORGANIZARTE'
                : 'QUÉ BUENO TENERTE DE VUELTA'}
            </p>
            <h2>
              {isForgot
                ? '¿Olvidaste tu contraseña?'
                : isRegistering
                ? 'Crea tu cuenta'
                : 'Inicia sesión'}
            </h2>
            <p>
              {isForgot
                ? 'Ingresa tu correo y te enviaremos un enlace para restablecerla.'
                : isRegistering
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

            {!isForgot && (
              <>
                <div className="password-label-row">
                  <label className="field-label" htmlFor="password">Contraseña</label>
                  {!isRegistering && (
                    <button
                      className="recovery-link"
                      type="button"
                      onClick={() => switchMode('forgot')}
                    >
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
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            )}

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
                    onClick={() => setShowConfirmation((v) => !v)}
                    aria-label={showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                    aria-pressed={showConfirmation}
                  >
                    {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </>
            )}

            <button className="submit-button" type="submit">
              {isForgot ? 'Enviar enlace' : isRegistering ? 'Crear cuenta' : 'Entrar'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="notice-slot" aria-live="polite">
            {notice && <p className={`notice notice-${notice.kind}`}>{notice.text}</p>}
          </div>

          <p className="account-switch">
            {isForgot ? (
              <button type="button" onClick={() => switchMode('login')}>
                <ArrowLeft size={14} style={{ display: 'inline', marginRight: '4px' }} /> Volver a iniciar sesión
              </button>
            ) : isRegistering ? (
              <>
                ¿Ya tienes una cuenta?{' '}
                <button type="button" onClick={() => switchMode('login')}>
                  Iniciar sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes una cuenta?{' '}
                <button type="button" onClick={() => switchMode('register')}>
                  Registrarse?
                </button>
              </>
            )}
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