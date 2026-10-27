import { useState, useEffect } from 'react'
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  LogOut,
  Search,
  User as UserIcon,
  Calendar,
  Clock,
  Flag,
  Edit2,
  X,
} from 'lucide-react'

type Task = {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'alta' | 'media' | 'baja' | string | null
  due_date: string | null
  due_time: string | null
  owner_id: number
}

type UserProfile = {
  id: number
  email: string
}

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'alta' | 'media' | 'baja'>('media')
  const [newDueDate, setNewDueDate] = useState('')
  const [newDueTime, setNewDueTime] = useState('')

  // Filtros y Buscador
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')

  // Estado para Edición
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState<'alta' | 'media' | 'baja'>('media')
  const [editDueDate, setEditDueDate] = useState('')
  const [editDueTime, setEditDueTime] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchUserProfile()
    fetchTasks()
  }, [])

  async function fetchUserProfile() {
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (err) {
      console.error('Error al cargar perfil de usuario', err)
    }
  }

  async function fetchTasks() {
    try {
      setLoading(true)
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        setError('No se pudieron cargar las tareas.')
      }
    } catch (err) {
      setError('Error al conectar con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const response = await fetch('http://127.0.0.1:8000/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || null,
          priority: newPriority,
          due_date: newDueDate || null,
          due_time: newDueTime || null,
        }),
      })

      if (response.ok) {
        setNewTitle('')
        setNewDescription('')
        setNewPriority('media')
        setNewDueDate('')
        setNewDueTime('')
        fetchTasks()
      }
    } catch (err) {
      alert('Error al crear la tarea')
    }
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditPriority((task.priority as 'alta' | 'media' | 'baja') || 'media')
    setEditDueDate(task.due_date || '')
    setEditDueTime(task.due_time || '')
  }

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!editingTask || !editTitle.trim()) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          priority: editPriority,
          due_date: editDueDate || null,
          due_time: editDueTime || null,
        }),
      })

      if (response.ok) {
        setEditingTask(null)
        fetchTasks()
      }
    } catch (err) {
      alert('Error al actualizar la tarea')
    }
  }

  async function toggleTask(task: Task) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function deleteTask(id: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

    if (filterStatus === 'pending') return matchesSearch && !task.completed
    if (filterStatus === 'completed') return matchesSearch && task.completed
    return matchesSearch
  })

  const pendingCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case 'alta':
        return { label: 'Alta', bg: '#fde8e8', color: '#9b1c1c' }
      case 'baja':
        return { label: 'Baja', bg: '#e1effe', color: '#1e429f' }
      default:
        return { label: 'Media', bg: '#feecdc', color: '#b43403' }
    }
  }

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Encabezado */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.2rem 2.5rem',
          backgroundColor: '#1b3b2b',
          color: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span
            style={{
              backgroundColor: '#8cb043',
              color: '#1b3b2b',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <ListTodo size={22} strokeWidth={2.5} />
          </span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px' }}>taskwork</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.9rem',
              }}
            >
              <UserIcon size={16} />
              <span>{user.email}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '900px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e9ecef',
          }}
        >
          <h1 style={{ margin: 0, color: '#1b3b2b', fontSize: '1.8rem' }}>Tu espacio de trabajo</h1>
          <p style={{ color: '#6c757d', marginTop: '0.4rem', marginBottom: '1.2rem' }}>
            Gestiona tus tareas con prioridades, fechas y horas límite.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#f1f5f2', padding: '10px 18px', borderRadius: '10px', color: '#1b3b2b' }}>
              Pendientes: <strong>{pendingCount}</strong>
            </div>
            <div style={{ backgroundColor: '#f1f5f2', padding: '10px 18px', borderRadius: '10px', color: '#1b3b2b' }}>
              Completadas: <strong>{completedCount}</strong>
            </div>
          </div>
        </div>

        {/* Formulario de Creación */}
        <form
          onSubmit={handleCreateTask}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h3 style={{ margin: 0, color: '#1b3b2b', fontSize: '1.1rem' }}>Nueva Tarea</h3>
          <input
            type="text"
            placeholder="¿Qué tienes pendiente?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '1rem' }}
          />
          <input
            type="text"
            placeholder="Descripción opcional..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '0.95rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flag size={16} color="#6c757d" />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'alta' | 'media' | 'baja')}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da' }}
              >
                <option value="alta">Prioridad Alta</option>
                <option value="media">Prioridad Media</option>
                <option value="baja">Prioridad Baja</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#6c757d" />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#6c757d" />
              <input
                type="time"
                value={newDueTime}
                onChange={(e) => setNewDueTime(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da' }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginLeft: 'auto',
                backgroundColor: '#1b3b2b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Plus size={18} /> Guardar tarea
            </button>
          </div>
        </form>

        {/* Buscador y Filtros */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.2rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid #ced4da',
              flex: '1',
              minWidth: '240px',
            }}
          >
            <Search size={18} color="#6c757d" />
            <input
              type="text"
              placeholder="Buscar tarea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'pending', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  backgroundColor: filterStatus === status ? '#1b3b2b' : '#e9ecef',
                  color: filterStatus === status ? '#ffffff' : '#495057',
                }}
              >
                {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Tareas */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            border: '1px solid #e9ecef',
          }}
        >
          {loading ? (
            <p style={{ color: '#6c757d' }}>Cargando tareas...</p>
          ) : error ? (
            <p style={{ color: '#d32f2f' }}>{error}</p>
          ) : filteredTasks.length === 0 ? (
            <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem 0' }}>
              No hay tareas que coincidan con la búsqueda.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {filteredTasks.map((task) => {
                const priorityBadge = getPriorityBadge(task.priority)
                return (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: task.completed ? '#f8f9fa' : '#ffffff',
                      border: '1px solid #e9ecef',
                      opacity: task.completed ? 0.7 : 1,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                      onClick={() => toggleTask(task)}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={22} color="#8cb043" />
                      ) : (
                        <Circle size={22} color="#6c757d" />
                      )}
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 600,
                            color: '#1b3b2b',
                            textDecoration: task.completed ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
                            {task.description}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              backgroundColor: priorityBadge.bg,
                              color: priorityBadge.color,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {priorityBadge.label}
                          </span>

                          {task.due_date && (
                            <span style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} /> {task.due_date}
                            </span>
                          )}

                          {task.due_time && (
                            <span style={{ fontSize: '0.8rem', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={13} /> {task.due_time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(task)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#155724', cursor: 'pointer' }}
                        title="Editar tarea"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#e53935', cursor: 'pointer' }}
                        title="Eliminar tarea"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Edición */}
      {editingTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#1b3b2b' }}>Editar Tarea</h3>
              <button onClick={() => setEditingTask(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ced4da' }}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción..."
                rows={3}
                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ced4da' }}
              />

              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as 'alta' | 'media' | 'baja')}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', flex: 1 }}
                >
                  <option value="alta">Prioridad Alta</option>
                  <option value="media">Prioridad Media</option>
                  <option value="baja">Prioridad Baja</option>
                </select>

                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', flex: 1 }}
                />

                <input
                  type="time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ced4da', flex: 1 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', background: '#fff', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#1b3b2b', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}