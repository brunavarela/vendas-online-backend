import { UpdatePasswordDTO } from "../dtos/updatePassword.dto";

export const updatePasswordMock: UpdatePasswordDTO = {
  lastPassword: 'abc',
  newPassword: 'ufghudii'
}

export const updatePasswordInvalidMock: UpdatePasswordDTO = {
  lastPassword: 'fruhfuihi',
  newPassword: 'nfierj',
}