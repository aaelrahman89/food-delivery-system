export interface SignInRepo {
  signIn(form: { email: string; password: string }): Promise<string>;
}
