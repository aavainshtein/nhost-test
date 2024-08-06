import { useNhostClient } from '@nhost/vue'
const { nhost } = useNhostClient()
const authClient = nhost.auth
export { authClient }
