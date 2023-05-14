import { Role } from "../../contexts";

export default interface LoginResponse{
    accessToken: string,
    refreshToken: string,
    isEmailConfirmed: boolean,
    roles: Role[]
}