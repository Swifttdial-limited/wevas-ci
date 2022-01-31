import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import jwConfing from './jwtConfig'

const { jwt } = useJwt(axios, jwConfing)
export default jwt
