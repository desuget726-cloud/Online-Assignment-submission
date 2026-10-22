import UserManagement from './UserManagement.jsx'

// Manages student accounts through the shared user-management table.
function ManageStudents({ onNavigate }) {
  return <UserManagement onNavigate={onNavigate} role="student" />
}

export default ManageStudents
