import { Auth } from 'aws-amplify';

export async function signUp(username: string, password: string, email: string) {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email
      }
    });
    return { currentUser: user, nextAction: 'confirm' };
  } catch (e: any) {
    console.log('error signing up:', e);

    if (e.toString().indexOf('InvalidPasswordException: Password did not conform with policy: Password not long enough') >= 0) {
      throw 'Oops! That password isn\'t long enough.';
    } else if (e.toString().indexOf('UsernameExistsException') >= 0) {
      throw 'Oh no! That username already exists. Is there anything else we can call you?';
    } else {
      throw 'Oops! Something went wrong, try a different username/password combination?';
    }
  }
}

export async function confirmEmail(username: string, password: string, code: string) {
  try {
    await Auth.confirmSignUp(username, code);
    return await signIn(username, password);
  } catch (e: any) {
    console.log('error confirming sign up', e);
    if (e.toString().indexOf('The user is not authenticated') >= 0) {
    } else {
      throw 'That wasn\'t right. Please check your email and try again.';
    }
  }
}

export async function resendConfirmationCode(username: string) {
  try {
    await Auth.resendSignUp(username);
  } catch (err) {
    console.log('error resending code: ', err);
    throw 'Desolé, we can\'t send your confirmation code at this time.'
  }
}

export async function signIn(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password);
    return { currentUser: user };
  } catch (e: any) {
    if (e.toString().indexOf('UserNotConfirmedException') >= 0) {
      return { currentUser: null, nextAction: 'confirm' };
    } else {
      console.log('error signing in', e);
      throw 'Hmmmm, that didn\'t work. Try a different username or password.';
    }
  }
}

export async function signOut() {
  try {
    await Auth.signOut();
    return { currentUser: null };
  } catch (e) {
    console.log('error signing out: ', e);
    throw 'Sign out failed, I guess you\'re stuck with us 🤷‍♀️';
  }
}