import RoleLayout from './RoleLayout.jsx'
import { pagesByRole } from '../utils/navigation.js'

function InstructorLayout(props) {
  return <RoleLayout {...props} items={pagesByRole.instructor} role="instructor" />
}

export default InstructorLayout
