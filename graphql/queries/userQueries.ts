import {gql} from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      id
      email
      username
      createdAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      permissions {
        action
        entity
        max
        min
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      id
      email
      username
      createdAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      permissions {
        action
        entity
        max
        min
      }
    }
  }
`;

export const LOGIN_GOOGLE_USER = gql`
  mutation LoginGoogleUser($loginGoogleInput: LoginGoogleInput!) {
    loginGoogleUser(loginGoogleInput: $loginGoogleInput) {
      id
      email
      username
      createdAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      permissions {
        action
        entity
        max
        min
      }
    }
  }
`;

export const LOGIN_APPLE_USER = gql`
  mutation LoginAppleUser($loginAppleInput: LoginAppleInput!) {
    loginAppleUser(loginAppleInput: $loginAppleInput) {
      id
      email
      username
      createdAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      thirdPartyAccount
      thirdPartyEmail
      permissions {
        action
        entity
        max
        min
      }
    }
  }
`;

export const LOGIN_USER_AS_GUEST = gql`
  mutation LoginUserAsGuest($deviceId: String!, $language: String!) {
    loginUserAsGuest(deviceId: $deviceId, language: $language) {
      id
      email
      username
      createdAt
      googleId
      token
      language
      name
      photo
      hasPassword
      roleId
      permissions {
        id
        name
        description
        action
        entity
        max
        min
        createdAt
        updatedAt
      }
      deviceId
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query User {
    user {
      id
      email
      username
      createdAt
      googleId
      token
      name
      language
      photo
      hasPassword
      roleId
      permissions {
        action
        entity
        max
        min
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      username
      photo
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

export const RESET_PASSWORD = gql`
  mutation Mutation($resetPasswordInput: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $resetPasswordInput)
  }
`;

export const VERIFICATE_CODE = gql`
  mutation VerificateCode($verificateCodeInput: VerificateCodeInput!) {
    verificateCode(verificateCodeInput: $verificateCodeInput)
  }
`;

export const UPDATE_PASSWORD_WITHOUT_OLD_PASSWORD = gql`
  mutation UpdatePasswordWithoutOld(
    $updatePasswordWithoutOldInput: UpdatePasswordWithoutOldInput!
  ) {
    updatePasswordWithoutOld(
      updatePasswordWithoutOldInput: $updatePasswordWithoutOldInput
    )
  }
`;

export const DELETE_HARD_MY_USER = gql`
  mutation Mutation {
    deleteHardMyUser
  }
`;
