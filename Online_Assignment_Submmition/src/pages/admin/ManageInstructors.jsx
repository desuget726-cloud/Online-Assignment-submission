import UserManagement from './UserManagement.jsx'

// Manages instructor accounts through the shared user-management table.
function ManageInstructors({ onNavigate }) {
  return <UserManagement onNavigate={onNavigate} role="instructor" />
}

export default ManageInstructors
