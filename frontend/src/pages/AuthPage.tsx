import { useState, type ReactEventHandler } from 'react';
import api from '../services/api';

const AuthPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlesSubmit = async(event:  React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post('/login', {email, password});

      if (response) {
        localStorage.setItem('token', response.data.token);
      }
    } catch(error) {
      setError(error);
    }
  } 

  return (
    <>
      <h2>Auth Page</h2>
      <form onSubmit={handlesSubmit}>
        <input type='email' value={email} onChange={}/>
        <input type='password' value={password} onChange={}/>
        <button type='submit'>Login</button>
      </form>
    </>
  )
}

export default AuthPage;