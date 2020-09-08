declare module "@supabase/gotrue-js" {

  const signup: (
    /**
     * Some description
     * @validate {xor} email, access_token
     * @validate {with} email, password
     * @validate {with} access_token, provider
     */
    signupOptions: {
      /** The email of the user which is signing up */
      email: string;
      password: string;
      access_token: string;
      provider: string;
    }
  ) => Promise<string>;


  const login: (email: string, password: string) => Promise<string>
  
  const user: (jwt?: string, password?: string) => Promise<LoggedInUser>;

  const onAuthStateChange: (callbackFunction: string) => boolean;

  interface LoggedInUser {
    jwt: string;
    logout: () => boolean;
    data: () => UserData;
  }

  interface UserData {
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    created_at: string;
    confirmed_at: string;
    email: string;
    id: string;
    last_sign_in_at: string;
    role: string;
    updated_at: string;
  }
}
