declare module '@supabase/gotrue-js' {
  /**
   * Some signup details
   * @param {object} signupOptions The signup options look like this
   */
  const signup: (
    signupOptions: {
      /** The email of the user which is signing up */
      email: string
      password: string
      access_token: string
      provider: string
    }
  ) => Promise<string>

  /**
   * Some details about login().
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
