declare module '@supabase/gotrue-js' {
  /**
   * Some signup details
   *
   * Some other very long text.
   *
   * @param {object} signupOptions The signup options look like this
   * @param {string} [somethingElse] This one is optional
   */
  const signup: (
    signupOptions: {
      /** The email of the user which is signing up. */
      email: string
      /** The password of the user. */
      password: string
      /** If using OAuth, the access token returned from the provider. */
      access_token?: string
      /** The Oauth provider. */
      provider?: 'GOOGLE' | 'GITHUB' | 'GITLAB'
    },
    somethingElse?: string
  ) => Promise<string>

  /**
   * Some details about `login()`.
   *
   * Some other very long text.
   */
  const login: (email: string, password: string) => Promise<string>

  /**
   * Some details about forgotPassword().
   *
   * Some other very long text.
   */
  const forgotPassword: (email: string, password: string) => Promise<string>

  /**
   * Some details about user().
   *
   * Some other very long text.
   */
  const user: (jwt?: string, password?: string) => Promise<LoggedInUser>

  /**
   * Some details about onAuthStateChange.
   *
   * Some other very long text.
   */
  const onAuthStateChange: (callbackFunction: string) => boolean

  /**
   * Some details about jwt.
   *
   * Some other very long text.
   */
  const jwt: (callbackFunction: string) => string

  interface LoggedInUser {
    jwt: string
    logout: () => boolean
    data: () => UserData
  }

  interface UserData {
    /** Data specific to the app */
    app_metadata: {
      provider?: string
      [key: string]: any
    }
    /** Data specific to the user */
    user_metadata: {
      [key: string]: any
    }
    aud: string
    created_at: string
    confirmed_at: string
    email: string
    id: string
    last_sign_in_at: string
    role: string
    updated_at: string
  }
}
