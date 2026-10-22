import RoleLayout from './RoleLayout.jsx'
import { pagesByRole } from '../utils/navigation.js'

function AdminLayout(props) {
  return <RoleLayout {...props} items={pagesByRole.admin} role="admin" />
}

export default AdminLayout
