import UserManagement from './UserManagement.jsx'

// Keeps the existing Manage Users page while sharing student and instructor workflows.
function Users({ onNavigate }) {
  return <UserManagement onNavigate={onNavigate} />
}

export default Users
