import RoleLayout from './RoleLayout.jsx'
import { pagesByRole } from '../utils/navigation.js'

function StudentLayout(props) {
  return <RoleLayout {...props} items={pagesByRole.student} role="student" />
}

export default StudentLayout
