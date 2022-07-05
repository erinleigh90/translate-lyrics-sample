import { signUp, confirmEmail, signIn, signOut, resendConfirmationCode } from '../utilities/authMethods';
import styles from '../styles/Home.module.css';
import { useState } from 'react';

export default function SignIn({ handleExit, handleSuccess, authType }: any) {
  const [authErrors, setAuthErrors] = useState('');
  const [username, setUsername] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (event: any) => {
    if (event.target.name == 'username') {
      setUsername(event.target.value);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | null) => {
    let successProps: any;

    if (event == null) {
      try {
        successProps = await signOut();
        handleSuccess(successProps);
      } catch (e: any) {
        setAuthErrors(e.toString());
      }
    } else {
      event.preventDefault();
      setAuthErrors('');

      const form: FormData = new FormData(event.target as HTMLFormElement);
      const password: string = form.get('password') as string;
      const code: string = form.get('code') as string;
      const email: string = form.get('email') as string;

      try {
        switch (authType) {
          case 'signUp':
            successProps = await signUp(username, password, email);
            break;
          case 'confirm':
            successProps = await confirmEmail(username, password, code);
            break;
          case 'signIn':
            successProps = await signIn(username, password);
            break;
        }
        handleSuccess(successProps);
      } catch (e: any) {
        if (e.toString().indexOf('ConfirmUser') >= 0) {
          handleSuccess({ currentUser: null, nextAction: 'confirm' });
        } else {
          setAuthErrors(e.toString());
        }
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendConfirmationCode(username);
      setCodeSent(true);
    } catch (e: any) {
      setAuthErrors(e.toString());
    }
  }

  let authLabel: string = '';
  let greeting: string = '';
  let inputs: string[] = [];

  switch (authType) {
    case 'signUp':
      authLabel = 'Sign Up';
      inputs = ['Username', 'Password', 'Email'];
      greeting = 'Encantado de conocerte. Sign Up to start adding your favorite song lyrics!';
      break;
    case 'confirm':
      authLabel = 'Confirm Email';
      inputs = ['Username', 'Password', 'Code'];
      greeting = 'Check your email for the confirmation code we sent to you so we can confirm your email address.';
      break;
    case 'signIn':
      authLabel = 'Log In';
      inputs = ['Username', 'Password'];
      greeting = 'Willkommen zurück!';
      break;
    case 'signOut':
      authLabel = 'Sign Out';
      inputs = [];
      greeting = 'À bientôt!';
      handleSubmit(null);
  }

  const getResendCodeParagraph = () => {
    if (!codeSent) {
      return <p className={styles.center}>Can't find your confirmation code? <a onClick={handleResend}>Resend Code</a></p>;
    }
    return <p className={styles.center}>Code Sent!</p>;
  }

  return (
    <div>
      <div className={styles.modalBackdrop} onClick={handleExit}></div>
      <div className={styles.modal} role="dialog">
        <div className={styles.modalExit}>
          <button aria-label="Close" type="button" onClick={handleExit}>
            <span>
              <svg viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false">
                <path d="m6 6 20 20"></path>
                <path d="m26 6-20 20"></path>
              </svg>
            </span>
          </button>
        </div>
        <header className={styles.modalHeader}>
          <div>
            <h3>{authLabel}</h3>
          </div>
        </header>
        <div className={styles.modalBody}>
          {authErrors ?
            <div className={styles.errorMessage}>
              <div className={styles.errorIcon}>
                <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
                  <path d="m23.49 20.79c.39.73.12 1.64-.61 2.03-.22.12-.46.18-.71.18h-20.33c-.83 0-1.5-.67-1.5-1.5 0-.25.06-.49.18-.71l10.16-18.94c.39-.73 1.3-1 2.03-.61.26.14.47.35.61.61zm-11.05-18.47c-.05-.09-.12-.16-.2-.2-.24-.13-.55-.04-.68.2l-10.16 18.94c-.04.07-.06.15-.06.24 0 .28.22.5.5.5h20.33c.08 0 .16-.02.24-.06.24-.13.33-.43.2-.68zm-.48 4.68c-.58.02-1.04.51-1.02 1.1l.29 7.42c.01.27.23.48.5.48h.54c.27 0 .49-.21.5-.48l.29-7.42c0-.01 0-.03 0-.04 0-.58-.47-1.06-1.06-1.06-.01 0-.03 0-.04 0zm-.96 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"></path>
                </svg>
              </div>
              <div className={styles.errorText}>
                {authErrors}
              </div>
            </div>
            : null}
          <p>{greeting}</p>
          <form className={styles.signInForm} onSubmit={handleSubmit}>
            <div className={styles.inputFields}>
              {(inputs.indexOf('Username') >= 0) ?
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required />
                : null}
              {(inputs.indexOf('Password') >= 0) ?
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required />
                : null}
              {(inputs.indexOf('Email') >= 0) ?
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required />
                : null}
              {(inputs.indexOf('Code') >= 0) ?
                <input
                  type="text"
                  name="code"
                  placeholder="Code"
                  required />
                : null}
            </div>
            {(authType == 'confirm') ? getResendCodeParagraph() : null}
            {(authType != 'signOut') ? <input className={styles.primaryButton} type="submit" name="Sign In" /> : null}
          </form>
        </div>
      </div>
    </div>
  );

}
